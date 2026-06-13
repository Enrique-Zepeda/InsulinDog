import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

import { AuthFooterLink } from "./AuthFooterLink";

describe("AuthFooterLink", () => {
  test("should render footer text and link text", () => {
    render(
      <MemoryRouter>
        <AuthFooterLink text="¿No tienes cuenta?" linkText="Regístrate" to="/register" />
      </MemoryRouter>,
    );

    expect(screen.getByText(/¿no tienes cuenta\?/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /regístrate/i })).toBeInTheDocument();
  });

  test("should render link with correct href", () => {
    render(
      <MemoryRouter>
        <AuthFooterLink text="¿Ya tienes cuenta?" linkText="Inicia sesión" to="/login" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /inicia sesión/i });

    expect(link).toHaveAttribute("href", "/login");
  });
});
