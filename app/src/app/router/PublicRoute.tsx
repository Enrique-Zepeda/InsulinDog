import { Navigate, Outlet } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useAppSelector } from "@/app/store/hooks";

export function PublicRoute() {
  const { isAuthenticated, isCheckingSession } = useAppSelector((state) => state.auth);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-500">Cargando sesión...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
}
