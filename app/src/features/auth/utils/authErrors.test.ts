import { describe, expect, test } from "vitest";

import { getLoginErrorMessage, getRegisterErrorMessage } from "./authErrors";

const RATE_LIMIT_MESSAGE =
  "Supabase bloqueó temporalmente el envío de correos. Espera una hora o configura SMTP propio para seguir probando.";

const EMAIL_NOT_VERIFIED_MESSAGE = "Tu cuenta no está verificada. Revisa tu correo y confirma tu cuenta.";

const INVALID_CREDENTIALS_MESSAGE = "Correo o contraseña incorrectos.";

const GENERIC_LOGIN_MESSAGE = "No se pudo iniciar sesión. Inténtalo de nuevo.";

describe("getRegisterErrorMessage", () => {
  test("should return Supabase rate limit message when error includes email rate limit", () => {
    const result = getRegisterErrorMessage("Email rate limit exceeded");

    expect(result).toBe(RATE_LIMIT_MESSAGE);
  });

  test("should return Supabase rate limit message when error includes rate limit", () => {
    const result = getRegisterErrorMessage("Rate limit exceeded");

    expect(result).toBe(RATE_LIMIT_MESSAGE);
  });

  test("should return Supabase rate limit message when error includes too many requests", () => {
    const result = getRegisterErrorMessage("Too many requests");

    expect(result).toBe(RATE_LIMIT_MESSAGE);
  });

  test("should be case insensitive", () => {
    const result = getRegisterErrorMessage("TOO MANY REQUESTS");

    expect(result).toBe(RATE_LIMIT_MESSAGE);
  });

  test("should return original message when error is not rate limit related", () => {
    const result = getRegisterErrorMessage("User already registered");

    expect(result).toBe("User already registered");
  });
});

describe("getLoginErrorMessage", () => {
  test("should return not verified message when error includes email not confirmed", () => {
    const result = getLoginErrorMessage("Email not confirmed");

    expect(result).toBe(EMAIL_NOT_VERIFIED_MESSAGE);
  });

  test("should return not verified message when error includes email not verified", () => {
    const result = getLoginErrorMessage("Email not verified");

    expect(result).toBe(EMAIL_NOT_VERIFIED_MESSAGE);
  });

  test("should return not verified message when error includes not confirmed", () => {
    const result = getLoginErrorMessage("User not confirmed");

    expect(result).toBe(EMAIL_NOT_VERIFIED_MESSAGE);
  });

  test("should return invalid credentials message when error includes invalid login credentials", () => {
    const result = getLoginErrorMessage("Invalid login credentials");

    expect(result).toBe(INVALID_CREDENTIALS_MESSAGE);
  });

  test("should return invalid credentials message when error includes invalid credentials", () => {
    const result = getLoginErrorMessage("Invalid credentials");

    expect(result).toBe(INVALID_CREDENTIALS_MESSAGE);
  });

  test("should be case insensitive", () => {
    const result = getLoginErrorMessage("INVALID LOGIN CREDENTIALS");

    expect(result).toBe(INVALID_CREDENTIALS_MESSAGE);
  });

  test("should return generic login error when message is unknown", () => {
    const result = getLoginErrorMessage("Something went wrong");

    expect(result).toBe(GENERIC_LOGIN_MESSAGE);
  });
});
