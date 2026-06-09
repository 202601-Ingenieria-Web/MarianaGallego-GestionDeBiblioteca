import { MaestroRow } from "./actions";

type MaestrosTablaProps = {
  maestros: MaestroRow[];
  cargando?: boolean;
};

export function MaestrosTabla({ maestros, cargando }: MaestrosTablaProps) {
  if (cargando) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Cargando maestros...
      </div>
    );
  }

  if (maestros.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No hay maestros registrados en el sistema.
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
              <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Saldo</th>
              <th className="px-4 py-3 font-semibold text-slate-700">
                Creado por
              </th>
            </tr>
          </thead>
          <tbody>
            {maestros.map((maestro) => (
              <tr
                key={maestro.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-900">{maestro.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {maestro.nombre}
                </td>
                <td className="px-4 py-3 text-slate-900">{maestro.saldo}</td>
                <td className="px-4 py-3 text-slate-600">{maestro.creadoPor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
