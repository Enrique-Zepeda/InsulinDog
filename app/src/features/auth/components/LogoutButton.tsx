import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

type LogoutButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  children?: ReactNode;
};

export function LogoutButton({ children = "Cerrar sesión", disabled, ...buttonProps }: LogoutButtonProps) {
  const { logout, isLoading } = useLogout();

  return (
    <Button type="button" onClick={logout} disabled={disabled || isLoading} {...buttonProps}>
      {isLoading ? "Cerrando sesión..." : children}
    </Button>
  );
}
