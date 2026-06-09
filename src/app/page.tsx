import Link from "next/link";
import {
  ArrowLeftRight,
  BookOpen,
  Library,
  Shield,
} from "lucide-react";

const caracteristicas = [
  {
    icon: ArrowLeftRight,
    titulo: "Transacciones",
    descripcion:
      "Registra entradas y salidas de inventario con seguimiento en tiempo real.",
  },
  {
    icon: Library,
    titulo: "Maestros",
    descripcion:
      "Administra el catálogo de libros y consulta los saldos disponibles.",
  },
  {
    icon: Shield,
    titulo: "Roles y permisos",
    descripcion:
      "Control de acceso diferenciado para administradores y usuarios.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-indigo-600" />
            <span className="text-lg font-bold text-slate-900">
              Gestión Biblioteca
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Administra tu biblioteca con facilidad
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Sistema web de administración para gestionar inventario, movimientos
            y usuarios. Diseñado para bibliotecarios y administradores.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Comenzar ahora
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
          {caracteristicas.map((item) => {
            const Icono = item.icon;
            return (
              <div
                key={item.titulo}
                className="rounded-xl border border-slate-200 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-3">
                  <Icono className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {item.titulo}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {item.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        Proyecto 2 — Ingeniería Web · Mariana Gallego · Universidad de Antioquia
      </footer>
    </main>
  );
}
