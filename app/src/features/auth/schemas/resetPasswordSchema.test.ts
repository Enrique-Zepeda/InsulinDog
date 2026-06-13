import { describe, expect, test } from "vitest";

import { resetPasswordSchema } from "./resetPasswordSchema";

describe("resetPasswordSchema", () => {
  test("should accept valid reset password values", () => {
    const result = resetPasswordSchema.safeParse({
      password: "123456",
      confirmPassword: "123456",
    });

    expect(result.success).toBe(true);
  });

  test("should reject a password with less than 6 characters", () => {
    const result = resetPasswordSchema.safeParse({
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
    const result = resetPasswordSchema.safeParse({
      password: "123456",
      confirmPassword: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.confirmPassword).toContain("Confirma tu nueva contraseña.");
    }
  });

  test("should reject when passwords do not match", () => {
    const result = resetPasswordSchema.safeParse({
      password: "123456",
      confirmPassword: "654321",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.confirmPassword).toContain("Las contraseñas no coinciden.");
    }
  });
});
