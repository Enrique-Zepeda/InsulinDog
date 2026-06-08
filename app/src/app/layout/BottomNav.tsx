import { NavLink } from "react-router-dom";
import { PATHS } from "@/app/router/paths";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export function BottomNav() {
  return (
    <nav className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-200 flex items-center justify-around px-2 pb-safe z-50">
      <NavLink
        to={PATHS.HOME}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 w-full h-full text-xs transition-colors ${
            isActive ? "text-zinc-950 font-semibold" : "text-zinc-400 hover:text-zinc-600"
          }`
        }
      >
        <span className="text-xl leading-none">🏠</span>
        <span>Inicio</span>
      </NavLink>

      <NavLink
        to={PATHS.PROFILE}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 w-full h-full text-xs transition-colors ${
            isActive ? "text-zinc-950 font-semibold" : "text-zinc-400 hover:text-zinc-600"
          }`
        }
      >
        <span className="text-xl leading-none">🐶</span>
        <span>Perfil</span>
      </NavLink>
      <LogoutButton variant="ghost" className="justify-start">
        Salir
      </LogoutButton>
    </nav>
  );
}
