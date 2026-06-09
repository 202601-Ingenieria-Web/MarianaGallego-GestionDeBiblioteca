import { MovimientoRow } from "./actions";

type MovimientosTablaProps = {
  movimientos: MovimientoRow[];
  cargando?: boolean;
};

export function MovimientosTabla({
  movimientos,
  cargando,
}: MovimientosTablaProps) {
  if (cargando) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Cargando movimientos...
      </div>
    );
  }

  if (movimientos.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No hay movimientos registrados para este libro.
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
              <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
              <th className="px-4 py-3 font-semibold text-slate-700">
                Cantidad
              </th>
              <th className="px-4 py-3 font-semibold text-slate-700">Tipo</th>
              <th className="px-4 py-3 font-semibold text-slate-700">
                Ejecutado por
              </th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((movimiento) => (
              <tr
                key={movimiento.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-900">{movimiento.id}</td>
                <td className="px-4 py-3 text-slate-600">{movimiento.fecha}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {movimiento.cantidad}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      movimiento.tipo === "ENTRADA"
                        ? "inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700"
                        : "inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700"
                    }
                  >
                    {movimiento.tipo === "ENTRADA" ? "Entrada" : "Salida"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {movimiento.ejecutadoPor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
