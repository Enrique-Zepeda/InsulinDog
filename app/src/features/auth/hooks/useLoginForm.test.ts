import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";
import { clearAuthFeedback } from "@/features/auth/slices/authSlice";

import { useLoginForm } from "./useLoginForm";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  loginUser: vi.fn(),
  unwrap: vi.fn(),

  authState: {
    isLoading: false,
    error: null as string | null,
  },
}));

vi.mock("@/app/store/hooks", () => ({
  useAppDispatch: () => mocks.dispatch,

  useAppSelector: (selector: (state: { auth: typeof mocks.authState }) => unknown) =>
    selector({
      auth: mocks.authState,
    }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/features/auth/thunks", () => ({
  loginUser: mocks.loginUser,
}));

describe("useLoginForm", () => {
  const loginAction = {
    type: "auth/loginUser",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    Object.assign(mocks.authState, {
      isLoading: false,
      error: null,
    });

    mocks.loginUser.mockReturnValue(loginAction);

    mocks.unwrap.mockResolvedValue({
      hasSession: true,
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "User",
      },
    });

    mocks.dispatch.mockImplementation((action) => {
      if (action === loginAction) {
        return {
          unwrap: mocks.unwrap,
        };
      }

      return action;
    });
  });

  test("should return auth state from Redux", () => {
    Object.assign(mocks.authState, {
      isLoading: true,
      error: "Correo o contraseña incorrectos.",
    });

    const { result } = renderHook(() => useLoginForm());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe("Correo o contraseña incorrectos.");
  });

  test("should not submit when form values are invalid", async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.form.register("email");
      result.current.form.register("password");

      result.current.form.setValue("email", "invalid-email");
      result.current.form.setValue("password", "");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.loginUser).not.toHaveBeenCalled();
    expect(mocks.dispatch).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    expect(result.current.form.getFieldState("email").error?.message).toBe("Ingresa un correo válido.");

    expect(result.current.form.getFieldState("password").error?.message).toBe("La contraseña es obligatoria.");
  });

  test("should clear feedback, login, reset and navigate when session exists", async () => {
    const { result } = renderHook(() => useLoginForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.register("email");
      result.current.form.register("password");

      result.current.form.setValue("email", "  user@EXAMPLE.COM  ");

      result.current.form.setValue("password", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(1, clearAuthFeedback());

    expect(mocks.loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "123456",
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(2, loginAction);

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith(PATHS.HOME);
  });

  test("should not reset or navigate when login does not create a session", async () => {
    mocks.unwrap.mockResolvedValue({
      hasSession: false,
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "User",
      },
    });

    const { result } = renderHook(() => useLoginForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("email", "user@example.com");

      result.current.form.setValue("password", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "123456",
    });

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  test("should not reset or navigate when login fails", async () => {
    mocks.unwrap.mockRejectedValue(new Error("Invalid login credentials"));

    const { result } = renderHook(() => useLoginForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("email", "user@example.com");

      result.current.form.setValue("password", "wrong-password");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "wrong-password",
    });

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    expect(result.current.form.getValues()).toEqual({
      email: "user@example.com",
      password: "wrong-password",
    });
  });
});
