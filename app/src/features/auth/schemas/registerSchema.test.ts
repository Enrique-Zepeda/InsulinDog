import { describe, expect, test } from "vitest";

import { registerSchema } from "./registerSchema";

describe("registerSchema", () => {
  test("should accept valid register values", () => {
    const result = registerSchema.safeParse({
      name: "Tonita",
      email: "tonita@example.com",
      password: "123456",
      confirmPassword: "123456",
    });

    expect(result.success).toBe(true);
  });

  test("should trim name and lowercase email", () => {
    const result = registerSchema.parse({
      name: "  Tonita  ",
      email: "  TONITA@EXAMPLE.COM  ",
      password: "  123456  ",
      confirmPassword: "  123456  ",
    });

    expect(result).toEqual({
      name: "Tonita",
      email: "tonita@example.com",
      password: "  123456  ",
      confirmPassword: "  123456  ",
    });
  });

  test("should reject an empty name", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "tonita@example.com",
      password: "123456",
      confirmPassword: "123456",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.name).toContain("El nombre es obligatorio.");
    }
  });

  test("should reject an empty email", () => {
    const result = registerSchema.safeParse({
      name: "Tonita",
      email: "",
      password: "123456",
      confirmPassword: "123456",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.email).toContain("El correo es obligatorio.");
    }
  });

  test("should reject an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Tonita",
      email: "invalid-email",
      password: "123456",
      confirmPassword: "123456",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.email).toContain("Ingresa un correo válido.");
    }
  });

  test("should reject a password with less than 6 characters", () => {
    const result = registerSchema.safeParse({
      name: "Tonita",
      email: "tonita@example.com",
      password: "12345",
      confirmPassword: "12345",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.password).toContain("La contraseña debe tener al menos 6 caracteres.");
    }
  });

  test("should reject an empty confirm password", () => {
    const result = registerSchema.safeParse({
      name: "Tonita",
      email: "tonita@example.com",
      password: "123456",
      confirmPassword: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.confirmPassword).toContain("Confirma tu contraseña.");
    }
  });

  test("should reject when passwords do not match", () => {
    const result = registerSchema.safeParse({
      name: "Tonita",
      email: "tonita@example.com",
      password: "123456",
      confirmPassword: "654321",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.confirmPassword).toContain("Las contraseñas no coinciden.");
    }
  });

  test("should acept a password with spaces", () => {
    const result = registerSchema.safeParse({
      name: "Tonita",
      email: "tonita@example.com",
      password: "      ",
      confirmPassword: "      ",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.password).toContain("La contraseña debe tener al menos 6 caracteres.");
    }
  });
});
