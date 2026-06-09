"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Rol } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type UsuarioRow = {
  id: number;
  fechaCreacion: string;
  correo: string;
  rol: Rol;
};

function formatearFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Centraliza la verificación de rol ADMIN para todas las acciones de usuarios
async function verificarAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return { autorizado: false as const, error: "No autorizado" };
  }

  if (session.user.rol !== "ADMIN") {
    return {
      autorizado: false as const,
      error: "Solo los administradores pueden gestionar usuarios",
    };
  }

  return { autorizado: true as const, session };
}

export async function obtenerUsuarios(): Promise<UsuarioRow[]> {
  const verificacion = await verificarAdmin();
  if (!verificacion.autorizado) return [];

  const usuarios = await prisma.usuario.findMany({
    orderBy: { fechaCreacion: "desc" },
    select: {
      id: true,
      fechaCreacion: true,
      correo: true,
      rol: true,
    },
  });

  return usuarios.map((usuario) => ({
    id: usuario.id,
    fechaCreacion: formatearFecha(usuario.fechaCreacion),
    correo: usuario.correo,
    rol: usuario.rol,
  }));
}

type ActualizarRolResult =
  | { success: true }
  | { success: false; error: string };

export async function actualizarRolUsuario(
  usuarioId: number,
  rol: Rol
): Promise<ActualizarRolResult> {
  const verificacion = await verificarAdmin();
  if (!verificacion.autorizado) {
    return { success: false, error: verificacion.error };
  }

  if (rol !== "ADMIN" && rol !== "USER") {
    return { success: false, error: "Rol inválido" };
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      return { success: false, error: "Usuario no encontrado" };
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { rol },
    });

    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al actualizar el usuario";
    return { success: false, error: mensaje };
  }
}
