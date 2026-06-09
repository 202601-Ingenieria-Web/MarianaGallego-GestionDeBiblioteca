// Componente cliente: maneja estado interactivo
"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { AgregarMovimientoDialog } from "./agregar-movimiento-dialog";
import { MovimientosTabla } from "./movimientos-tabla";
import { SaldosGrafica } from "./saldos-grafica";
import {
  LibroOption,
  MovimientoRow,
  SaldoDiario,
  obtenerLibros,
  obtenerMovimientos,
  obtenerSaldosDiarios,
} from "./actions";

export function TransaccionesView({
  librosIniciales,
}: {
  librosIniciales: LibroOption[];
}) {
  const [libros, setLibros] = useState(librosIniciales);
  const [libroSeleccionadoId, setLibroSeleccionadoId] = useState<number | null>(
    librosIniciales[0]?.id ?? null
  );
  const [movimientos, setMovimientos] = useState<MovimientoRow[]>([]);
  const [saldosDiarios, setSaldosDiarios] = useState<SaldoDiario[]>([]);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cargandoDatos, startCarga] = useTransition();

  const libroSeleccionado = libros.find((l) => l.id === libroSeleccionadoId);

  const cargarDatos = useCallback(() => {
    if (!libroSeleccionadoId) return;

    // Recarga al mismo tiempo tabla, gráfica y saldos del dropdown tras cada cambio
    startCarga(async () => {
      const [movs, saldos, librosActualizados] = await Promise.all([
        obtenerMovimientos(libroSeleccionadoId),
        obtenerSaldosDiarios(libroSeleccionadoId),
        obtenerLibros(),
      ]);
      setMovimientos(movs);
      setSaldosDiarios(saldos);
      setLibros(librosActualizados);
    });
  }, [libroSeleccionadoId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  function handleExitoMovimiento() {
    cargarDatos();
  }

  if (libros.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-slate-600">
          No hay libros registrados. Un administrador debe crear maestros
          primero.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <label
            htmlFor="libro"
            className="text-sm font-medium text-slate-700"
          >
            Seleccionar libro (maestro)
          </label>
          <select
            id="libro"
            value={libroSeleccionadoId ?? ""}
            onChange={(e) => setLibroSeleccionadoId(Number(e.target.value))}
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {libros.map((libro) => (
              <option key={libro.id} value={libro.id}>
                {libro.nombre} (saldo: {libro.saldo})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setDialogoAbierto(true)}
          disabled={!libroSeleccionado}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Agregar movimiento
        </button>
      </div>

      {libroSeleccionado && (
        <p className="text-sm text-slate-500">
          Saldo actual:{" "}
          <span className="font-semibold text-slate-900">
            {libroSeleccionado.saldo} unidades
          </span>
        </p>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Movimientos
        </h2>
        <MovimientosTabla movimientos={movimientos} cargando={cargandoDatos} />
      </div>

      <SaldosGrafica
        datos={saldosDiarios}
        cargando={cargandoDatos}
        libroNombre={libroSeleccionado?.nombre ?? ""}
      />

      {libroSeleccionado && (
        <AgregarMovimientoDialog
          abierto={dialogoAbierto}
          libroId={libroSeleccionado.id}
          libroNombre={libroSeleccionado.nombre}
          onCerrar={() => setDialogoAbierto(false)}
          onExito={handleExitoMovimiento}
        />
      )}
    </div>
  );
}
