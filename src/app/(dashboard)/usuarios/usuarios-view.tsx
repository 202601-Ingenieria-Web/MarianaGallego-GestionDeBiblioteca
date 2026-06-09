// Vista cliente: la edición de rol se hace fila por fila
"use client";

import { useCallback, useState, useTransition } from "react";
import { EditarUsuarioDialog } from "./editar-usuario-dialog";
import { UsuariosTabla } from "./usuarios-tabla";
import { obtenerUsuarios, UsuarioRow } from "./actions";

type UsuariosViewProps = {
  usuariosIniciales: UsuarioRow[];
};

export function UsuariosView({ usuariosIniciales }: UsuariosViewProps) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioRow | null>(
    null
  );
  const [cargando, startCarga] = useTransition();

  const recargarUsuarios = useCallback(() => {
    startCarga(async () => {
      const datos = await obtenerUsuarios();
      setUsuarios(datos);
    });
  }, []);

  return (
    <div className="space-y-6">
      <UsuariosTabla
        usuarios={usuarios}
        cargando={cargando}
        onEditar={setUsuarioEditando}
      />

      <EditarUsuarioDialog
        usuario={usuarioEditando}
        onCerrar={() => setUsuarioEditando(null)}
        onExito={recargarUsuarios}
      />
    </div>
  );
}
