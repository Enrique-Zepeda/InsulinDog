import { supabase } from "@/shared/lib/supabase";

import { AUTH_MESSAGES } from "@/features/auth/constants/authMessages";
import { mapSupabaseUserToAuthUser } from "@/features/auth/mappers/authMapper";
import type {
  AuthMessageResponse,
  ForgotPasswordCredentials,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  UpdatePasswordCredentials,
} from "@/features/auth/types/auth.types";
import { getLoginErrorMessage, getRegisterErrorMessage } from "@/features/auth/utils/authErrors";

export async function loginWithEmail({ email, password }: LoginCredentials): Promise<LoginResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(getLoginErrorMessage(error.message));
  }

  if (!data.user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  return {
    user: mapSupabaseUserToAuthUser(data.user),
    hasSession: Boolean(data.session),
  };
}

export async function registerWithEmail({ name, email, password }: RegisterCredentials): Promise<RegisterResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw new Error(getRegisterErrorMessage(error.message));
  }

  return {
    user: data.user ? mapSupabaseUserToAuthUser(data.user, name) : null,
    hasSession: Boolean(data.session),
    message: data.session ? AUTH_MESSAGES.registerSuccess : AUTH_MESSAGES.registerConfirmEmail,
  };
}

export async function sendPasswordResetEmail({ email }: ForgotPasswordCredentials): Promise<AuthMessageResponse> {
  const redirectTo = `${window.location.origin}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw new Error("No se pudo enviar el correo de recuperación. Inténtalo de nuevo.");
  }

  return {
    message: AUTH_MESSAGES.passwordResetEmailSent,
  };
}

export async function updatePassword({ password }: UpdatePasswordCredentials): Promise<AuthMessageResponse> {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error("No se pudo actualizar la contraseña. Abre nuevamente el link de recuperación.");
  }

  return {
    message: AUTH_MESSAGES.passwordUpdated,
  };
}

export async function logoutWithSupabase(): Promise<AuthMessageResponse> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("No se pudo cerrar sesión. Inténtalo de nuevo.");
  }

  return {
    message: AUTH_MESSAGES.logoutSuccess,
  };
}
