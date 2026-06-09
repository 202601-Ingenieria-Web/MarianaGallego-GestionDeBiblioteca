"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Ingresando...
        </>
      ) : (
        "Iniciar sesión"
      )}
    </button>
  );
}

type LoginFormProps = {
  error?: string;
};

export function LoginForm({ error }: LoginFormProps) {
  return (
    <form action={loginAction} className="space-y-4">
      {error === "credenciales" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Credenciales inválidas. Intenta de nuevo.
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="correo" className="text-sm font-medium text-slate-700">
          Correo electrónico
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          placeholder="admin@biblioteca.com"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contrasena"
          className="text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
