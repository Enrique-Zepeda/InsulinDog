import { describe, expect, test } from "vitest";

import { loginSchema } from "./loginSchema";

describe("loginSchema", () => {
  test("should accept a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  test("should trim and lowercase the email", () => {
    const result = loginSchema.parse({
      email: "  TEST@EXAMPLE.COM  ",
      password: "123456",
    });

    expect(result.email).toBe("test@example.com");
  });

  test("should reject an empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "123456",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.email).toContain("El correo es obligatorio.");
    }
  });

  test("should reject an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "123456",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.email).toContain("Ingresa un correo válido.");
    }
  });

  test("should reject an empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.password).toContain("La contraseña es obligatoria.");
    }
  });
});
