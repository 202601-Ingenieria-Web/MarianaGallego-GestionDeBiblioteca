import Link from "next/link";
import { BookOpen } from "lucide-react";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600"
          >
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-slate-900">
              Gestión Biblioteca
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ingresa tus credenciales para acceder al sistema.
          </p>

          <div className="mt-6">
            <LoginForm error={error} />
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
