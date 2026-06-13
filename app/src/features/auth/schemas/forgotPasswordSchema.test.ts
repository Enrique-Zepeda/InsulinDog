import { describe, expect, test } from "vitest";

import { forgotPasswordSchema } from "./forgotPasswordSchema";

describe("forgotPasswordSchema", () => {
  test("should accept a valid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "edgar@example.com",
    });

    expect(result.success).toBe(true);
  });

  test("should trim and lowercase the email", () => {
    const result = forgotPasswordSchema.parse({
      email: "  EDGAR@EXAMPLE.COM  ",
    });

    expect(result.email).toBe("edgar@example.com");
  });

  test("should reject an empty email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.email).toContain("El correo es obligatorio.");
    }
  });

  test("should reject an invalid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "invalid-email",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.email).toContain("Ingresa un correo válido.");
    }
  });
});
