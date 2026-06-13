import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { AuthCard } from "./AuthCard";

describe("AuthCard", () => {
  test("should render title and description", () => {
    render(
      <AuthCard title="Iniciar sesión" description="Accede a tu cuenta de InsulinDog">
        <div>Contenido del formulario</div>
      </AuthCard>,
    );

    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.getByText("Accede a tu cuenta de InsulinDog")).toBeInTheDocument();
  });

  test("should render the InsulinDog logo", () => {
    render(
      <AuthCard title="Iniciar sesión" description="Accede a tu cuenta">
        <div>Contenido</div>
      </AuthCard>,
    );

    expect(screen.getByRole("img", { name: /insulindog logo/i })).toBeInTheDocument();
  });

  test("should render children content", () => {
    render(
      <AuthCard title="Registro" description="Crea tu cuenta">
        <button type="button">Crear cuenta</button>
      </AuthCard>,
    );

    expect(screen.getByRole("button", { name: /crear cuenta/i })).toBeInTheDocument();
  });
});
