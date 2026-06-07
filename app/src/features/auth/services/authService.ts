import type { User } from "@supabase/supabase-js";
import { supabase } from "@/shared/lib/supabase";

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
};

export type RegisterResponse = {
  user: AuthUser | null;
  hasSession: boolean;
  message: string;
};

export type LoginResponse = {
  user: AuthUser;
  hasSession: boolean;
};

export type ForgotPasswordCredentials = {
  email: string;
};

export type UpdatePasswordCredentials = {
  password: string;
};

export type AuthMessageResponse = {
  message: string;
};

const REGISTER_SUCCESS_MESSAGE = "Cuenta creada correctamente.";

const REGISTER_CONFIRM_EMAIL_MESSAGE = "Cuenta creada. Revisa tu correo para confirmar tu cuenta.";

function mapSupabaseUserToAuthUser(user: User, fallbackName?: string): AuthUser {
  const fullName = user.user_metadata.full_name;

  return {
    id: user.id,
    email: user.email ?? null,
    name: typeof fullName === "string" ? fullName : (fallbackName ?? null),
  };
}

function getRegisterErrorMessage(message: string) {
  if (message.toLowerCase().includes("email rate limit")) {
    return "Supabase bloqueó temporalmente el envío de correos. Espera una hora o desactiva la confirmación de email mientras desarrollas.";
  }

  return message;
}

function getLoginErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("email not confirmed") ||
    normalizedMessage.includes("email not verified") ||
    normalizedMessage.includes("not confirmed")
  ) {
    return "Tu cuenta no verificada. Revisa tu correo y confirma tu cuenta.";
  }

  if (normalizedMessage.includes("invalid login credentials") || normalizedMessage.includes("invalid credentials")) {
    return "Correo o contraseña incorrectos.";
  }

  return "No se pudo iniciar sesión. Inténtalo de nuevo.";
}

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
    message: data.session ? REGISTER_SUCCESS_MESSAGE : REGISTER_CONFIRM_EMAIL_MESSAGE,
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
    message: "Te enviamos un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.",
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
    message: "Tu contraseña fue actualizada correctamente.",
  };
}
