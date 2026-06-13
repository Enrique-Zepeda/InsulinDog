import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { AuthAlert } from "./AuthAlert";

describe("AuthAlert", () => {
  test("should render nothing when message is null", () => {
    const { container } = render(<AuthAlert message={null} variant="error" />);

    expect(container).toBeEmptyDOMElement();
  });

  test("should render nothing when message is undefined", () => {
    const { container } = render(<AuthAlert variant="success" />);

    expect(container).toBeEmptyDOMElement();
  });

  test("should render the message", () => {
    render(<AuthAlert message="Correo o contraseña incorrectos." variant="error" />);

    expect(screen.getByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
  });

  test("should apply error styles when variant is error", () => {
    render(<AuthAlert message="Ocurrió un error." variant="error" />);

    const alert = screen.getByText("Ocurrió un error.");

    expect(alert).toHaveClass("border-destructive/30");
    expect(alert).toHaveClass("bg-destructive/10");
    expect(alert).toHaveClass("text-destructive");
  });

  test("should apply success styles when variant is success", () => {
    render(<AuthAlert message="Operación exitosa." variant="success" />);

    const alert = screen.getByText("Operación exitosa.");

    expect(alert).toHaveClass("border-emerald-500/30");
    expect(alert).toHaveClass("bg-emerald-500/10");
    expect(alert).toHaveClass("text-emerald-700");
  });
});
