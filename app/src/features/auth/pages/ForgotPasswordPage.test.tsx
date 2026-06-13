import type { FormEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";
import { useForgotPasswordForm } from "@/features/auth/hooks/useForgotPasswordForm";

import { ForgotPassword } from "./ForgotPasswordPage";

vi.mock("@/features/auth/hooks/useForgotPasswordForm", () => ({
  useForgotPasswordForm: vi.fn(),
}));

const mockedUseForgotPasswordForm = vi.mocked(useForgotPasswordForm);

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
  } as unknown as ReturnType<typeof useForgotPasswordForm>;
}

function renderForgotPassword() {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>,
  );
}

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseForgotPasswordForm.mockReturnValue(createHookResult());
  });

  test("should render the forgot password form", () => {
    renderForgotPassword();

    expect(
      screen.getByText("Escribe tu correo y te enviaremos un link para restablecer tu contraseña."),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /enviar link de recuperación/i,
      }),
    ).toBeInTheDocument();
  });

  test("should render the login link with the correct path", () => {
    renderForgotPassword();

    expect(screen.getByRole("link", { name: /inicia sesión/i })).toHaveAttribute("href", PATHS.LOGIN);
  });

  test("should call onSubmit when the form is submitted", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    mockedUseForgotPasswordForm.mockReturnValue(
      createHookResult({
        onSubmit,
      }),
    );

    renderForgotPassword();

    await user.click(
      screen.getByRole("button", {
        name: /enviar link de recuperación/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  test("should display loading state", () => {
    mockedUseForgotPasswordForm.mockReturnValue(
      createHookResult({
        isLoading: true,
      }),
    );

    renderForgotPassword();

    const button = screen.getByRole("button", {
      name: /enviando correo/i,
    });

    expect(button).toBeDisabled();
  });

  test("should display the recovery error", () => {
    mockedUseForgotPasswordForm.mockReturnValue(
      createHookResult({
        error: "No se pudo enviar el correo de recuperación.",
      }),
    );

    renderForgotPassword();

    expect(screen.getByText("No se pudo enviar el correo de recuperación.")).toBeInTheDocument();
  });

  test("should display the recovery success message", () => {
    mockedUseForgotPasswordForm.mockReturnValue(
      createHookResult({
        successMessage: "Revisa tu correo para restablecer tu contraseña.",
      }),
    );

    renderForgotPassword();

    expect(screen.getByText("Revisa tu correo para restablecer tu contraseña.")).toBeInTheDocument();
  });

  test("should register the email field", () => {
    renderForgotPassword();

    expect(registerMock).toHaveBeenCalledWith("email");
  });
});
