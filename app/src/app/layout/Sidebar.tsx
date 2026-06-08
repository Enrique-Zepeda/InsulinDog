import { NavLink } from "react-router-dom";
import { PATHS } from "@/app/router/paths";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200">
      <div className="p-6 border-b border-zinc-200">
        <h2 className="text-2xl font-bold text-zinc-900">InsuliDog</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4 flex-1">
        <NavLink
          to={PATHS.HOME}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-zinc-100 text-zinc-950 font-semibold"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            }`
          }
        >
          <span className="text-xl">🏠</span>
          <span>Inicio</span>
        </NavLink>

        <NavLink
          to={PATHS.PROFILE}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-zinc-100 text-zinc-950 font-semibold"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            }`
          }
        >
          <span className="text-xl">🐶</span>
          <span>Perfil</span>
        </NavLink>
        <LogoutButton variant="ghost">Salir</LogoutButton>
      </nav>
    </aside>
  );
}
