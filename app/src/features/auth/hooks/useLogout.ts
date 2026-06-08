import { useNavigate } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logoutUser } from "@/features/auth/thunks";

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((state) => state.auth);

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate(PATHS.LOGIN, { replace: true });
    } catch {
      // El error ya queda en Redux.
    }
  };

  return {
    logout,
    isLoading,
  };
}
