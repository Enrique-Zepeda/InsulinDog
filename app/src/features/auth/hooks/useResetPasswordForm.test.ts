import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";
import { clearAuthFeedback } from "@/features/auth/slices/authSlice";

import { useResetPasswordForm } from "./useResetPasswordForm";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  resetPassword: vi.fn(),
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
  resetPassword: mocks.resetPassword,
}));

describe("useResetPasswordForm", () => {
  const resetPasswordAction = {
    type: "auth/resetPassword",
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    Object.assign(mocks.authState, {
      isLoading: false,
      error: null,
      successMessage: null,
    });

    mocks.resetPassword.mockReturnValue(resetPasswordAction);
    mocks.unwrap.mockResolvedValue(undefined);

    mocks.dispatch.mockImplementation((action) => {
      if (action === resetPasswordAction) {
        return {
          unwrap: mocks.unwrap,
        };
      }

      return action;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should return auth state from Redux", () => {
    Object.assign(mocks.authState, {
      isLoading: true,
      error: "No se pudo actualizar la contraseña.",
      successMessage: "Contraseña actualizada.",
    });

    const { result } = renderHook(() => useResetPasswordForm());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe("No se pudo actualizar la contraseña.");
    expect(result.current.successMessage).toBe("Contraseña actualizada.");
  });

  test("should not submit when passwords do not match", async () => {
    const { result } = renderHook(() => useResetPasswordForm());

    act(() => {
      result.current.form.register("password");
      result.current.form.register("confirmPassword");

      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "654321");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.resetPassword).not.toHaveBeenCalled();
    expect(mocks.dispatch).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    expect(result.current.form.getFieldState("confirmPassword").error?.message).toBe("Las contraseñas no coinciden.");
  });

  test("should clear feedback, reset password and reset the form after success", async () => {
    const { result } = renderHook(() => useResetPasswordForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(1, clearAuthFeedback());

    expect(mocks.resetPassword).toHaveBeenCalledWith({
      password: "123456",
    });

    expect(mocks.dispatch).toHaveBeenNthCalledWith(2, resetPasswordAction);

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).toHaveBeenCalledOnce();
  });

  test("should navigate to login after 1200 milliseconds", async () => {
    const { result } = renderHook(() => useResetPasswordForm());

    act(() => {
      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mocks.navigate).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1199);
    });

    expect(mocks.navigate).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(mocks.navigate).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith(PATHS.LOGIN);
  });

  test("should not reset or navigate when reset password fails", async () => {
    mocks.unwrap.mockRejectedValue(new Error("No se pudo actualizar la contraseña."));

    const { result } = renderHook(() => useResetPasswordForm());

    const resetSpy = vi.spyOn(result.current.form, "reset");

    act(() => {
      result.current.form.setValue("password", "123456");
      result.current.form.setValue("confirmPassword", "123456");
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(mocks.resetPassword).toHaveBeenCalledWith({
      password: "123456",
    });

    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    expect(result.current.form.getValues()).toEqual({
      password: "123456",
      confirmPassword: "123456",
    });
  });
});
