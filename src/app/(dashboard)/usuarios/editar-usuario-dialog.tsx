"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Rol } from "@prisma/client";
import { toast } from "sonner";
import { actualizarRolUsuario, UsuarioRow } from "./actions";

type EditarUsuarioDialogProps = {
  usuario: UsuarioRow | null;
  onCerrar: () => void;
  onExito: () => void;
};

export function EditarUsuarioDialog({
  usuario,
  onCerrar,
  onExito,
}: EditarUsuarioDialogProps) {
  const [rol, setRol] = useState<Rol>("USER");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (usuario) {
      setRol(usuario.rol);
    }
  }, [usuario]);

  if (!usuario) return null;

  const usuarioActual = usuario;

  function handleCerrar() {
    if (pending) return;
    onCerrar();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const usuarioId = usuarioActual.id;

    startTransition(async () => {
      const resultado = await actualizarRolUsuario(usuarioId, rol);

      if (!resultado.success) {
        toast.error(resultado.error);
        return;
      }

      toast.success("Usuario actualizado exitosamente");
      onExito();
      onCerrar();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={handleCerrar}
        aria-label="Cerrar diálogo"
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={handleCerrar}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-900">Editar usuario</h2>
        <p className="mt-2 text-sm text-slate-600">
          Correo:{" "}
          <span className="font-medium text-slate-900">{usuarioActual.correo}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="rol" className="text-sm font-medium text-slate-700">
              Rol
            </label>
            <select
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value as Rol)}
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCerrar}
              disabled={pending}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-70"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
