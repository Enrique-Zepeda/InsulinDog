import type { User } from "@supabase/supabase-js";

import type { AuthUser } from "@/features/auth/types/auth.types";

export function mapSupabaseUserToAuthUser(user: User, fallbackName?: string): AuthUser {
  const fullName = user.user_metadata.full_name;

  return {
    id: user.id,
    email: user.email ?? null,
    name: typeof fullName === "string" ? fullName : (fallbackName ?? null),
  };
}
