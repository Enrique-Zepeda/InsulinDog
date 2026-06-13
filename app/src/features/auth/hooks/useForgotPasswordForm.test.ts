import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { clearAuthFeedback } from "@/features/auth/slices/authSlice";

import { useForgotPasswordForm } from "./useForgotPasswordForm";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  forgotPassword: vi.fn(),
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

vi.mock("@/features/auth/thunks", () => ({
  forgotPassword: mocks.forgotPassword,
}));

describe("useForgotPasswordForm", () => {
  const forgotPasswordAction = {
    type: "auth/forgotPassword",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    Object.assign(mocks.authState, {
      isLoading: false,
      error: null,
      successMessage: null,
    });

    mocks.forgotPassword.mockReturnValue(forgotPasswordAction);
    mocks.unwrap.mockResolvedValue(undefined);

    mocks.dispatch.mockImplementation((action) => {
      if (action === forgotPasswordAction) {
        return {
          unwrap: mocks.unwrap,
        };
      }

      return action;
    });
  });

  test("should return auth feedback state from Redux", () => {
    Object.assign(mocks.authState, {
      isLoading: true,
      error: "No se pudo enviar el correo.",
      successMessage: null,
    });

    const { result } = renderHook(() => useForgotPasswordForm());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe("No se pudo enviar el correo.");
    expect(result.current.successMessage).toBeNull();
  });

  test("should not submit when email is invalid", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());

    act(() => {
      result.current.form.register("email");
      result.current.form.setValue("email", "invalid-email");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.forgotPassword).not.toHaveBeenCalled();
    expect(mocks.dispatch).not.toHaveBeenCalled();

    expect(result.current.form.getFieldState("email").error?.message).toBe("Ingresa un correo válido.");
  });

  test("should clear feedback, dispatch forgotPassword and reset after success", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("email", "  USER@EXAMPLE.COM  ");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(1, clearAuthFeedback());

    expect(mocks.forgotPassword).toHaveBeenCalledWith({
      email: "user@example.com",
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(2, forgotPasswordAction);

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).toHaveBeenCalledOnce();
  });

  test("should not reset the form when forgotPassword fails", async () => {
    mocks.unwrap.mockRejectedValue(new Error("No se pudo enviar el correo."));

    const { result } = renderHook(() => useForgotPasswordForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("email", "user@example.com");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.forgotPassword).toHaveBeenCalledWith({
      email: "user@example.com",
    });

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).not.toHaveBeenCalled();

    expect(result.current.form.getValues("email")).toBe("user@example.com");
  });
});
