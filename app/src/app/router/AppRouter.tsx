import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./paths";

// Layouts & Guards
import { AppLayout } from "@/app/layout/AppLayout";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Login } from "@/features/auth/pages/LoginPage";
import { Register } from "@/features/auth/pages/RegisterPage";
import { ForgotPassword } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPassword } from "@/features/auth/pages/ResetPasswordPage";
import { Home } from "@/features/dashboard/pages/HomePage";

// Features (Pantallas)

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
    element: <AuthLayout />,
    children: [
      { path: PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: PATHS.RESET_PASSWORD, element: <ResetPassword /> },
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
