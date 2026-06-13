import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";
import { clearAuthFeedback } from "@/features/auth/slices/authSlice";

import { useRegisterForm } from "./useRegisterForm";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  registerUser: vi.fn(),
  unwrap: vi.fn(),

  authState: {
    isLoading: false,
    error: null as string | null,
    successMessage: null as string | null,
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
  registerUser: mocks.registerUser,
}));

describe("useRegisterForm", () => {
  const registerAction = {
    type: "auth/registerUser",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    Object.assign(mocks.authState, {
      isLoading: false,
      error: null,
      successMessage: null,
    });

    mocks.registerUser.mockReturnValue(registerAction);

    mocks.unwrap.mockResolvedValue({
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "User",
      },
      hasSession: true,
      message: "Registro exitoso.",
    });

    mocks.dispatch.mockImplementation((action) => {
      if (action === registerAction) {
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
      error: "No se pudo crear la cuenta.",
      successMessage: "Revisa tu correo.",
    });

    const { result } = renderHook(() => useRegisterForm());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe("No se pudo crear la cuenta.");
    expect(result.current.successMessage).toBe("Revisa tu correo.");
  });

  test("should not submit when passwords do not match", async () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.form.register("name");
      result.current.form.register("email");
      result.current.form.register("password");
      result.current.form.register("confirmPassword");

      result.current.form.setValue("name", "User");
      result.current.form.setValue("email", "user@example.com");
      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "654321");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.registerUser).not.toHaveBeenCalled();
    expect(mocks.dispatch).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    expect(result.current.form.getFieldState("confirmPassword").error?.message).toBe("Las contraseñas no coinciden.");
  });

  test("should register, reset and navigate when session exists", async () => {
    const { result } = renderHook(() => useRegisterForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("name", "  User Jara  ");
      result.current.form.setValue("email", "  user@EXAMPLE.COM  ");
      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(1, clearAuthFeedback());

    expect(mocks.registerUser).toHaveBeenCalledWith({
      name: "User Jara",
      email: "user@example.com",
      password: "123456",
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(2, registerAction);

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith(PATHS.HOME);
  });

  test("should reset but not navigate when registration succeeds without session", async () => {
    mocks.unwrap.mockResolvedValue({
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "User",
      },
      hasSession: false,
      message: "Revisa tu correo para confirmar tu cuenta.",
    });

    const { result } = renderHook(() => useRegisterForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("name", "User");
      result.current.form.setValue("email", "user@example.com");
      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.registerUser).toHaveBeenCalledWith({
      name: "User",
      email: "user@example.com",
      password: "123456",
    });

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).toHaveBeenCalledOnce();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  test("should not reset or navigate when registration fails", async () => {
    mocks.unwrap.mockRejectedValue(new Error("No se pudo crear la cuenta."));

    const { result } = renderHook(() => useRegisterForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("name", "User");
      result.current.form.setValue("email", "user@example.com");
      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.registerUser).toHaveBeenCalledWith({
      name: "User",
      email: "user@example.com",
      password: "123456",
    });

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    expect(result.current.form.getValues()).toEqual({
      name: "User",
      email: "user@example.com",
      password: "123456",
      confirmPassword: "123456",
    });
  });
});
