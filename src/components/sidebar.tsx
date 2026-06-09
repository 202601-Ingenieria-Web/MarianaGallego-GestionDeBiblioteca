"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BookOpen,
  Library,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Rol } from "@prisma/client";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { logoutAction } from "@/app/(dashboard)/actions";

type SidebarProps = {
  nombre: string;
  imagen?: string | null;
  rol: Rol;
};

// Cada enlace declara qué roles pueden verlo
const enlaces = [
  {
    href: "/transacciones",
    label: "Transacciones",
    icon: ArrowLeftRight,
    roles: ["ADMIN", "USER"] as Rol[],
  },
  {
    href: "/maestros",
    label: "Maestros",
    icon: Library,
    roles: ["ADMIN", "USER"] as Rol[],
  },
  {
    href: "/usuarios",
    label: "Usuarios",
    icon: Users,
    roles: ["ADMIN"] as Rol[],
  },
];

function SidebarContent({
  nombre,
  imagen,
  rol,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <BookOpen className="h-6 w-6 text-indigo-400" />
        <span className="font-bold text-white">Biblioteca</span>
      </div>

      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <UserAvatar nombre={nombre} imagen={imagen} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{nombre}</p>
            <p className="text-xs text-slate-400">{rol}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {enlaces
          .filter((enlace) => enlace.roles.includes(rol))
          .map((enlace) => {
            const Icono = enlace.icon;
            const activo = pathname.startsWith(enlace.href);

            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activo
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <Icono className="h-5 w-5 shrink-0" />
                {enlace.label}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({ nombre, imagen, rol }: SidebarProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      {/* Sidebar móvil: overlay deslizable. Desktop: sidebar fijo en el layout */}
      <button
        type="button"
        onClick={() => setMenuAbierto(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-slate-800 p-2 text-white shadow-lg lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {menuAbierto && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuAbierto(false)}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transition-transform lg:hidden",
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setMenuAbierto(false)}
          className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:text-white"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent
          nombre={nombre}
          imagen={imagen}
          rol={rol}
          onNavigate={() => setMenuAbierto(false)}
        />
      </aside>

      <aside className="hidden h-screen w-64 shrink-0 bg-slate-800 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent nombre={nombre} imagen={imagen} rol={rol} />
        </div>
      </aside>
    </>
  );
}
