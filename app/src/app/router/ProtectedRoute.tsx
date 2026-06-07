import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";
import { useAppSelector } from "../store/hooks";

export function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Cargando...</p> {/* Luego pondrás un spinner de shadcn aquí */}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return <Outlet />;
}
