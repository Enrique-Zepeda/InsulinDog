import { supabase } from "@/shared/lib/supabase";

export type RegisterCredentials = {
  name: string;
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
    throw new Error(error.message);
  }

  const user: AuthUser | null = data.user
    ? {
        id: data.user.id,
        email: data.user.email ?? null,
        name: (data.user.user_metadata.full_name as string | undefined) ?? name,
      }
    : null;

  return {
    user,
    hasSession: Boolean(data.session),
    message: data.session
      ? "Cuenta creada correctamente."
      : "Cuenta creada. Revisa tu correo para confirmar tu cuenta.",
  };
}
