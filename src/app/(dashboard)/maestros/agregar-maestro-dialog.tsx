"use client";

import { Loader2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { crearMaestro } from "./actions";

type AgregarMaestroDialogProps = {
  abierto: boolean;
  onCerrar: () => void;
  onExito: () => void;
};

export function AgregarMaestroDialog({
  abierto,
  onCerrar,
  onExito,
}: AgregarMaestroDialogProps) {
  const [nombre, setNombre] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [pending, startTransition] = useTransition();

  if (!abierto) return null;

  function handleCerrar() {
    if (pending) return;
    setNombre("");
    setSaldoInicial("");
    onCerrar();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const saldo = parseInt(saldoInicial, 10);

    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (!Number.isInteger(saldo) || saldo < 0) {
      toast.error("El saldo inicial debe ser un número entero mayor o igual a 0");
      return;
    }

    startTransition(async () => {
      const resultado = await crearMaestro(nombre, saldo);

      if (!resultado.success) {
        toast.error(resultado.error);
        return;
      }

      toast.success("Maestro creado exitosamente");
      setNombre("");
      setSaldoInicial("");
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

        <h2 className="text-lg font-bold text-slate-900">Agregar maestro</h2>
        <p className="mt-1 text-sm text-slate-600">
          Registra un nuevo libro en el inventario.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="nombre"
              className="text-sm font-medium text-slate-700"
            >
              Nombre del maestro
            </label>
            <input
              id="nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Ej: Don Quijote de la Mancha"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="saldoInicial"
              className="text-sm font-medium text-slate-700"
            >
              Saldo inicial
            </label>
            <input
              id="saldoInicial"
              type="number"
              min="0"
              required
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Ej: 10"
            />
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
                  Creando...
                </>
              ) : (
                "Crear maestro"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
