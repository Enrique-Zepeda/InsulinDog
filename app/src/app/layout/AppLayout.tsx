// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden text-zinc-900">
      {/* Menú lateral (PC) */}
      <Sidebar />

      {/* Área central con el contenido inyectado */}
      <div className="flex flex-col flex-1 relative w-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* Menú inferior (Móvil) */}
        <BottomNav />
      </div>
    </div>
  );
}
