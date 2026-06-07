import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./paths";

// Layouts & Guards
import { AppLayout } from "@/app/layout/AppLayout";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

// Features (Pantallas)
import { Login } from "@/pages/LoginPage";
import { Register } from "@/pages/RegisterPage";
import { Home } from "@/pages/HomePage";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: PATHS.LOGIN, element: <Login /> },
          { path: PATHS.REGISTER, element: <Register /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: PATHS.PROFILE, element: <div>Perfil de Mascota (Placeholder)</div> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to={PATHS.LOGIN} replace /> },
]);
