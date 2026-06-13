import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { AuthTextField } from "./AuthTextField";

const createRegistration = () => ({
  name: "email",
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
});

describe("AuthTextField", () => {
  test("should render label and input", () => {
    render(
      <AuthTextField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        registration={createRegistration()}
      />,
    );

    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
  });

  test("should render placeholder", () => {
    render(
      <AuthTextField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        registration={createRegistration()}
      />,
    );

    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument();
  });

  test("should render error message when error exists", () => {
    render(
      <AuthTextField
        id="email"
        label="Correo electrónico"
        type="email"
        registration={createRegistration()}
        error={{
          type: "required",
          message: "El correo es obligatorio.",
        }}
      />,
    );

    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
  });

  test("should render password input as hidden by default", () => {
    render(
      <AuthTextField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="Tu contraseña"
        registration={createRegistration()}
      />,
    );

    const input = screen.getByLabelText("Contraseña");

    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /mostrar contraseña/i })).toBeInTheDocument();
  });

  test("should toggle password visibility when clicking the button", async () => {
    const user = userEvent.setup();

    render(
      <AuthTextField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="Tu contraseña"
        registration={createRegistration()}
      />,
    );

    const input = screen.getByLabelText("Contraseña");
    const toggleButton = screen.getByRole("button", {
      name: /mostrar contraseña/i,
    });

    expect(input).toHaveAttribute("type", "password");

    await user.click(toggleButton);

    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /ocultar contraseña/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ocultar contraseña/i }));

    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /mostrar contraseña/i })).toBeInTheDocument();
  });

  test("should not render password toggle button when field is not password", () => {
    render(
      <AuthTextField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        registration={createRegistration()}
      />,
    );

    expect(screen.queryByRole("button", { name: /mostrar contraseña/i })).not.toBeInTheDocument();
  });
});
