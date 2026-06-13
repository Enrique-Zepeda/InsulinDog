import { beforeEach, describe, expect, test, vi } from "vitest";

import { AUTH_MESSAGES } from "@/features/auth/constants/authMessages";

import {
  loginWithEmail,
  logoutWithSupabase,
  registerWithEmail,
  sendPasswordResetEmail,
  updatePassword,
} from "./authService";

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),

  mapSupabaseUserToAuthUser: vi.fn(),
  getLoginErrorMessage: vi.fn(),
  getRegisterErrorMessage: vi.fn(),
}));

vi.mock("@/shared/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      resetPasswordForEmail: mocks.resetPasswordForEmail,
      updateUser: mocks.updateUser,
      signOut: mocks.signOut,
    },
  },
}));

vi.mock("@/features/auth/mappers/authMapper", () => ({
  mapSupabaseUserToAuthUser: mocks.mapSupabaseUserToAuthUser,
}));

vi.mock("@/features/auth/utils/authErrors", () => ({
  getLoginErrorMessage: mocks.getLoginErrorMessage,
  getRegisterErrorMessage: mocks.getRegisterErrorMessage,
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loginWithEmail", () => {
    test("should login and return the mapped user with an active session", async () => {
      const credentials = {
        email: "user@example.com",
        password: "123456",
      };

      const supabaseUser = {
        id: "user-1",
        email: "user@example.com",
        user_metadata: {
          full_name: "User",
        },
      };

      const authUser = {
        id: "user-1",
        email: "user@example.com",
        name: "User",
      };

      mocks.signInWithPassword.mockResolvedValue({
        data: {
          user: supabaseUser,
          session: {
            access_token: "token",
          },
        },
        error: null,
      });

      mocks.mapSupabaseUserToAuthUser.mockReturnValue(authUser);

      const result = await loginWithEmail(credentials);

      expect(mocks.signInWithPassword).toHaveBeenCalledWith(credentials);

      expect(mocks.mapSupabaseUserToAuthUser).toHaveBeenCalledWith(supabaseUser);

      expect(result).toEqual({
        user: authUser,
        hasSession: true,
      });
    });

    test("should throw the formatted login error when Supabase fails", async () => {
      const credentials = {
        email: "user@example.com",
        password: "wrong-password",
      };

      mocks.signInWithPassword.mockResolvedValue({
        data: {
          user: null,
          session: null,
        },
        error: {
          message: "Invalid login credentials",
        },
      });

      mocks.getLoginErrorMessage.mockReturnValue("Correo o contraseña incorrectos.");

      await expect(loginWithEmail(credentials)).rejects.toThrow("Correo o contraseña incorrectos.");

      expect(mocks.getLoginErrorMessage).toHaveBeenCalledWith("Invalid login credentials");

      expect(mocks.mapSupabaseUserToAuthUser).not.toHaveBeenCalled();
    });

    test("should throw when Supabase does not return a user", async () => {
      mocks.signInWithPassword.mockResolvedValue({
        data: {
          user: null,
          session: null,
        },
        error: null,
      });

      await expect(
        loginWithEmail({
          email: "user@example.com",
          password: "123456",
        }),
      ).rejects.toThrow("No se pudo obtener la información del usuario.");

      expect(mocks.mapSupabaseUserToAuthUser).not.toHaveBeenCalled();
    });
  });

  describe("registerWithEmail", () => {
    test("should register, map the user and return success message when session exists", async () => {
      const credentials = {
        name: "User",
        email: "user@example.com",
        password: "123456",
      };

      const supabaseUser = {
        id: "user-1",
        email: "user@example.com",
        user_metadata: {},
      };

      const authUser = {
        id: "user-1",
        email: "user@example.com",
        name: "User",
      };

      mocks.signUp.mockResolvedValue({
        data: {
          user: supabaseUser,
          session: {
            access_token: "token",
          },
        },
        error: null,
      });

      mocks.mapSupabaseUserToAuthUser.mockReturnValue(authUser);

      const result = await registerWithEmail(credentials);

      expect(mocks.signUp).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "123456",
        options: {
          data: {
            full_name: "User",
          },
        },
      });

      expect(mocks.mapSupabaseUserToAuthUser).toHaveBeenCalledWith(supabaseUser, "User");

      expect(result).toEqual({
        user: authUser,
        hasSession: true,
        message: AUTH_MESSAGES.registerSuccess,
      });
    });

    test("should return confirmation message when registration has no session", async () => {
      mocks.signUp.mockResolvedValue({
        data: {
          user: null,
          session: null,
        },
        error: null,
      });

      const result = await registerWithEmail({
        name: "User",
        email: "user@example.com",
        password: "123456",
      });

      expect(result).toEqual({
        user: null,
        hasSession: false,
        message: AUTH_MESSAGES.registerConfirmEmail,
      });

      expect(mocks.mapSupabaseUserToAuthUser).not.toHaveBeenCalled();
    });

    test("should throw the formatted registration error when Supabase fails", async () => {
      mocks.signUp.mockResolvedValue({
        data: {
          user: null,
          session: null,
        },
        error: {
          message: "Email rate limit exceeded",
        },
      });

      mocks.getRegisterErrorMessage.mockReturnValue("Supabase bloqueó temporalmente el envío de correos.");

      await expect(
        registerWithEmail({
          name: "User",
          email: "user@example.com",
          password: "123456",
        }),
      ).rejects.toThrow("Supabase bloqueó temporalmente el envío de correos.");

      expect(mocks.getRegisterErrorMessage).toHaveBeenCalledWith("Email rate limit exceeded");
    });
  });

  describe("sendPasswordResetEmail", () => {
    test("should send the reset email with the correct redirect URL", async () => {
      mocks.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await sendPasswordResetEmail({
        email: "user@example.com",
      });

      expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      expect(result).toEqual({
        message: AUTH_MESSAGES.passwordResetEmailSent,
      });
    });

    test("should throw when the reset email cannot be sent", async () => {
      mocks.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: {
          message: "Email service error",
        },
      });

      await expect(
        sendPasswordResetEmail({
          email: "user@example.com",
        }),
      ).rejects.toThrow("No se pudo enviar el correo de recuperación. Inténtalo de nuevo.");
    });
  });

  describe("updatePassword", () => {
    test("should update the password and return success message", async () => {
      mocks.updateUser.mockResolvedValue({
        data: {
          user: {},
        },
        error: null,
      });

      const result = await updatePassword({
        password: "newPassword123",
      });

      expect(mocks.updateUser).toHaveBeenCalledWith({
        password: "newPassword123",
      });

      expect(result).toEqual({
        message: AUTH_MESSAGES.passwordUpdated,
      });
    });

    test("should throw when the password cannot be updated", async () => {
      mocks.updateUser.mockResolvedValue({
        data: {
          user: null,
        },
        error: {
          message: "Invalid recovery session",
        },
      });

      await expect(
        updatePassword({
          password: "newPassword123",
        }),
      ).rejects.toThrow("No se pudo actualizar la contraseña. Abre nuevamente el link de recuperación.");
    });
  });

  describe("logoutWithSupabase", () => {
    test("should logout and return success message", async () => {
      mocks.signOut.mockResolvedValue({
        error: null,
      });

      const result = await logoutWithSupabase();

      expect(mocks.signOut).toHaveBeenCalledOnce();

      expect(result).toEqual({
        message: AUTH_MESSAGES.logoutSuccess,
      });
    });

    test("should throw when logout fails", async () => {
      mocks.signOut.mockResolvedValue({
        error: {
          message: "Logout error",
        },
      });

      await expect(logoutWithSupabase()).rejects.toThrow("No se pudo cerrar sesión. Inténtalo de nuevo.");
    });
  });
});
