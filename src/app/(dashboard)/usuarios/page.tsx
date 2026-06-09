import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { obtenerUsuarios } from "./actions";
import { UsuariosView } from "./usuarios-view";

export default async function UsuariosPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.rol !== "ADMIN") {
    redirect("/transacciones");
  }

  const usuarios = await obtenerUsuarios();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
      <p className="mt-1 text-slate-600">
        Administración de usuarios y roles del sistema.
      </p>
      <div className="mt-6">
        <UsuariosView usuariosIniciales={usuarios} />
      </div>
    </div>
  );
}
