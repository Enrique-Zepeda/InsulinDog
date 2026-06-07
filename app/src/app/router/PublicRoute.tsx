import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";
import { useAppSelector } from "../store/hooks";

export function PublicRoute() {
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
}
