import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

import { Login } from "./LoginPage";

vi.mock("@/features/auth/hooks/useLoginForm", () => ({
  useLoginForm: vi.fn(),
}));

const mockedUseLoginForm = vi.mocked(useLoginForm);

const registerMock = vi.fn((name: string) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
}));

const createHookResult = ({
  isLoading = false,
  error = null,
  onSubmit = vi.fn(),
}: {
  isLoading?: boolean;
  error?: string | null;
  onSubmit?: ReturnType<typeof vi.fn>;
} = {}) =>
  ({
    form: {
      register: registerMock,
      formState: {
        errors: {},
      },
    },
    isLoading,
    error,
    onSubmit,
  }) as unknown as ReturnType<typeof useLoginForm>;

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseLoginForm.mockReturnValue(createHookResult());
  });

  test("should render the login form", () => {
    renderLogin();

    expect(screen.getByText("Accede a tu cuenta de InsulinDog.")).toBeInTheDocument();

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /^iniciar sesión$/i })).toBeInTheDocument();

    expect(screen.getAllByText("Iniciar sesión")).toHaveLength(2);
  });

  test("should render authentication navigation links", () => {
    renderLogin();

    expect(
      screen.getByRole("link", {
        name: /¿olvidaste tu contraseña\?/i,
      }),
    ).toHaveAttribute("href", PATHS.FORGOT_PASSWORD);

    expect(screen.getByRole("link", { name: /regístrate/i })).toHaveAttribute("href", PATHS.REGISTER);
  });

  test("should call onSubmit when the form is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => {
      event.preventDefault();
    });

    mockedUseLoginForm.mockReturnValue(
      createHookResult({
        onSubmit,
      }),
    );

    renderLogin();

    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  test("should display loading state", () => {
    mockedUseLoginForm.mockReturnValue(
      createHookResult({
        isLoading: true,
      }),
    );

    renderLogin();

    const button = screen.getByRole("button", {
      name: /iniciando sesión/i,
    });

    expect(button).toBeDisabled();
  });

  test("should display the authentication error", () => {
    mockedUseLoginForm.mockReturnValue(
      createHookResult({
        error: "Correo o contraseña incorrectos.",
      }),
    );

    renderLogin();

    expect(screen.getByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
  });

  test("should register the expected form fields", () => {
    renderLogin();

    expect(registerMock).toHaveBeenCalledWith("email");
    expect(registerMock).toHaveBeenCalledWith("password");
  });
});
