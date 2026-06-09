import { obtenerLibros } from "./actions";
import { TransaccionesView } from "./transacciones-view";

export default async function TransaccionesPage() {
  const libros = await obtenerLibros();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Transacciones</h1>
      <p className="mt-1 text-slate-600">
        Gestión de movimientos de inventario por libro.
      </p>
      <div className="mt-6">
        <TransaccionesView librosIniciales={libros} />
      </div>
    </div>
  );
}
