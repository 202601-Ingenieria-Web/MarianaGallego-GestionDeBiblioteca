"use client";

import { Plus } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { Rol } from "@prisma/client";
import { AgregarMaestroDialog } from "./agregar-maestro-dialog";
import { MaestrosTabla } from "./maestros-tabla";
import { MaestroRow, obtenerMaestros } from "./actions";

type MaestrosViewProps = {
  maestrosIniciales: MaestroRow[];
  rol: Rol;
};

export function MaestrosView({ maestrosIniciales, rol }: MaestrosViewProps) {
  const [maestros, setMaestros] = useState(maestrosIniciales);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cargando, startCarga] = useTransition();

  // El botón "Agregar" solo se le muestra a administradores
  const esAdmin = rol === "ADMIN";

  const recargarMaestros = useCallback(() => {
    startCarga(async () => {
      const datos = await obtenerMaestros();
      setMaestros(datos);
    });
  }, []);

  return (
    <div className="space-y-6">
      {esAdmin && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setDialogoAbierto(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      )}

      <MaestrosTabla maestros={maestros} cargando={cargando} />

      {esAdmin && (
        <AgregarMaestroDialog
          abierto={dialogoAbierto}
          onCerrar={() => setDialogoAbierto(false)}
          onExito={recargarMaestros}
        />
      )}
    </div>
  );
}
