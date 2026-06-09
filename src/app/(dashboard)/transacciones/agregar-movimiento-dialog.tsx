"use client";

import { Loader2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { TipoMovimiento } from "@prisma/client";
import { toast } from "sonner";
import { crearMovimiento } from "./actions";

type AgregarMovimientoDialogProps = {
  abierto: boolean;
  libroId: number;
  libroNombre: string;
  onCerrar: () => void;
  onExito: () => void;
};

export function AgregarMovimientoDialog({
  abierto,
  libroId,
  libroNombre,
  onCerrar,
  onExito,
}: AgregarMovimientoDialogProps) {
  const [tipo, setTipo] = useState<TipoMovimiento>("ENTRADA");
  const [cantidad, setCantidad] = useState("");
  const [pending, startTransition] = useTransition();

  if (!abierto) return null;

  function handleCerrar() {
    if (pending) return;
    setTipo("ENTRADA");
    setCantidad("");
    onCerrar();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cantidadNum = parseInt(cantidad, 10);

    if (!Number.isInteger(cantidadNum) || cantidadNum <= 0) {
      toast.error("Ingresa una cantidad válida mayor a 0");
      return;
    }

    startTransition(async () => {
      const resultado = await crearMovimiento(libroId, tipo, cantidadNum);

      if (!resultado.success) {
        toast.error(resultado.error);
        return;
      }

      toast.success("Movimiento creado exitosamente");
      setTipo("ENTRADA");
      setCantidad("");
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

        <h2 className="text-lg font-bold text-slate-900">
          Agregar movimiento
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Libro: <span className="font-medium">{libroNombre}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="tipo" className="text-sm font-medium text-slate-700">
              Tipo de movimiento
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoMovimiento)}
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SALIDA">Salida</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="cantidad"
              className="text-sm font-medium text-slate-700"
            >
              Cantidad
            </label>
            <input
              id="cantidad"
              type="number"
              min="1"
              required
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Ej: 5"
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
                "Crear movimiento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
