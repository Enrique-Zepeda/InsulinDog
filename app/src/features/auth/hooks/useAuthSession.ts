import { useEffect } from "react";

import { useAppDispatch } from "@/app/store/hooks";
import { supabase } from "@/shared/lib/supabase";
import { mapSupabaseUserToAuthUser } from "@/features/auth/mappers/authMapper";
import { clearAuthState, setAuthSession } from "@/features/auth/slices/authSlice";

export function useAuthSession() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    const loadCurrentSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        dispatch(clearAuthState());
        return;
      }

      const user = data.session?.user ? mapSupabaseUserToAuthUser(data.session.user) : null;

      dispatch(setAuthSession(user));
    };

    loadCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ? mapSupabaseUserToAuthUser(session.user) : null;

      dispatch(setAuthSession(user));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);
}
