import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { FormEvent } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";

import { Register } from "./RegisterPage";

vi.mock("@/features/auth/hooks/useRegisterForm", () => ({
  useRegisterForm: vi.fn(),
}));

const mockedUseRegisterForm = vi.mocked(useRegisterForm);

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
  } as unknown as ReturnType<typeof useRegisterForm>;
}

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseRegisterForm.mockReturnValue(createHookResult());
  });

  test("should render the register form", () => {
    renderRegister();

    // Usamos la descripción porque "Crear cuenta" aparece
    // tanto en el título como en el botón.
    expect(screen.getByText("Registra tu cuenta para empezar a usar InsulinDog.")).toBeInTheDocument();

    expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /^crear cuenta$/i })).toBeInTheDocument();
  });

  test("should render the login link with the correct path", () => {
    renderRegister();

    expect(screen.getByRole("link", { name: /inicia sesión/i })).toHaveAttribute("href", PATHS.LOGIN);
  });

  test("should call onSubmit when the form is submitted", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    mockedUseRegisterForm.mockReturnValue(
      createHookResult({
        onSubmit,
      }),
    );

    renderRegister();

    await user.click(screen.getByRole("button", { name: /^crear cuenta$/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  test("should display loading state", () => {
    mockedUseRegisterForm.mockReturnValue(
      createHookResult({
        isLoading: true,
      }),
    );

    renderRegister();

    const button = screen.getByRole("button", {
      name: /creando cuenta/i,
    });

    expect(button).toBeDisabled();
  });

  test("should display the registration error", () => {
    mockedUseRegisterForm.mockReturnValue(
      createHookResult({
        error: "No se pudo crear la cuenta.",
      }),
    );

    renderRegister();

    expect(screen.getByText("No se pudo crear la cuenta.")).toBeInTheDocument();
  });

  test("should display the registration success message", () => {
    mockedUseRegisterForm.mockReturnValue(
      createHookResult({
        successMessage: "Revisa tu correo para confirmar tu cuenta.",
      }),
    );

    renderRegister();

    expect(screen.getByText("Revisa tu correo para confirmar tu cuenta.")).toBeInTheDocument();
  });

  test("should register all form fields", () => {
    renderRegister();

    expect(registerMock).toHaveBeenCalledWith("name");
    expect(registerMock).toHaveBeenCalledWith("email");
    expect(registerMock).toHaveBeenCalledWith("password");
    expect(registerMock).toHaveBeenCalledWith("confirmPassword");
  });
});
