import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { obtenerMaestros } from "./actions";
import { MaestrosView } from "./maestros-view";

export default async function MaestrosPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const maestros = await obtenerMaestros();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Maestros</h1>
      <p className="mt-1 text-slate-600">
        Catálogo de libros y saldos del inventario.
      </p>
      <div className="mt-6">
        <MaestrosView maestrosIniciales={maestros} rol={session.user.rol} />
      </div>
    </div>
  );
}
