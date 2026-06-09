"use client";

import { Pencil } from "lucide-react";
import { UsuarioRow } from "./actions";

type UsuariosTablaProps = {
  usuarios: UsuarioRow[];
  cargando?: boolean;
  onEditar: (usuario: UsuarioRow) => void;
};

export function UsuariosTabla({
  usuarios,
  cargando,
  onEditar,
}: UsuariosTablaProps) {
  if (cargando) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Cargando usuarios...
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No hay usuarios registrados en el sistema.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
              <th className="px-4 py-3 font-semibold text-slate-700">
                Fecha de creación
              </th>
              <th className="px-4 py-3 font-semibold text-slate-700">Correo</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Rol</th>
              <th className="px-4 py-3 font-semibold text-slate-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-900">{usuario.id}</td>
                <td className="px-4 py-3 text-slate-600">
                  {usuario.fechaCreacion}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {usuario.correo}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      usuario.rol === "ADMIN"
                        ? "inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                        : "inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                    }
                  >
                    {usuario.rol}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onEditar(usuario)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar usuario
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
