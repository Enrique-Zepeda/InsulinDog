import type { FormEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";

import { ResetPassword } from "./ResetPasswordPage";

vi.mock("@/features/auth/hooks/useResetPasswordForm", () => ({
  useResetPasswordForm: vi.fn(),
}));

const mockedUseResetPasswordForm = vi.mocked(useResetPasswordForm);

const registerMock = vi.fn((name: string) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
}));

type HookOptions = {
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
  onSubmit?: ReturnType<typeof vi.fn>;
};

function createHookResult({
  isLoading = false,
  error = null,
  successMessage = null,
  onSubmit = vi.fn(),
}: HookOptions = {}) {
  return {
    form: {
      register: registerMock,
      formState: {
        errors: {},
      },
    },
    isLoading,
    error,
    successMessage,
    onSubmit,
  } as unknown as ReturnType<typeof useResetPasswordForm>;
}

function renderResetPassword() {
  return render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>,
  );
}

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseResetPasswordForm.mockReturnValue(createHookResult());
  });

  test("should render the reset password form", () => {
    renderResetPassword();

    expect(screen.getByText("Escribe una nueva contraseña para tu cuenta.")).toBeInTheDocument();

    expect(screen.getByLabelText(/^nueva contraseña$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^confirmar nueva contraseña$/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /^actualizar contraseña$/i,
      }),
    ).toBeInTheDocument();
  });

  test("should render the login link with the correct path", () => {
    renderResetPassword();

    expect(screen.getByRole("link", { name: /inicia sesión/i })).toHaveAttribute("href", PATHS.LOGIN);
  });

  test("should call onSubmit when the form is submitted", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    mockedUseResetPasswordForm.mockReturnValue(
      createHookResult({
        onSubmit,
      }),
    );

    renderResetPassword();

    await user.click(
      screen.getByRole("button", {
        name: /^actualizar contraseña$/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  test("should display loading state", () => {
    mockedUseResetPasswordForm.mockReturnValue(
      createHookResult({
        isLoading: true,
      }),
    );

    renderResetPassword();

    const button = screen.getByRole("button", {
      name: /^actualizando\.\.\.$/i,
    });

    expect(button).toBeDisabled();
  });

  test("should display the reset password error", () => {
    mockedUseResetPasswordForm.mockReturnValue(
      createHookResult({
        error: "No se pudo actualizar la contraseña.",
      }),
    );

    renderResetPassword();

    expect(screen.getByText("No se pudo actualizar la contraseña.")).toBeInTheDocument();
  });

  test("should display the reset password success message", () => {
    mockedUseResetPasswordForm.mockReturnValue(
      createHookResult({
        successMessage: "Contraseña actualizada correctamente.",
      }),
    );

    renderResetPassword();

    expect(screen.getByText("Contraseña actualizada correctamente.")).toBeInTheDocument();
  });

  test("should register both password fields", () => {
    renderResetPassword();

    expect(registerMock).toHaveBeenCalledWith("password");
    expect(registerMock).toHaveBeenCalledWith("confirmPassword");
  });
});
