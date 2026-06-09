"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type MaestroRow = {
  id: number;
  nombre: string;
  saldo: number;
  creadoPor: string;
};

export async function obtenerMaestros(): Promise<MaestroRow[]> {
  const libros = await prisma.libro.findMany({
    orderBy: { nombre: "asc" },
    include: {
      creadoPor: { select: { nombre: true } },
    },
  });

  return libros.map((libro) => ({
    id: libro.id,
    nombre: libro.nombre,
    saldo: libro.saldo,
    creadoPor: libro.creadoPor.nombre,
  }));
}

type CrearMaestroResult =
  | { success: true }
  | { success: false; error: string };

export async function crearMaestro(
  nombre: string,
  saldoInicial: number
): Promise<CrearMaestroResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  // Validación en servidor
  if (session.user.rol !== "ADMIN") {
    return { success: false, error: "Solo los administradores pueden crear maestros" };
  }

  const nombreLimpio = nombre.trim();

  if (!nombreLimpio) {
    return { success: false, error: "El nombre es obligatorio" };
  }

  if (!Number.isInteger(saldoInicial) || saldoInicial < 0) {
    return { success: false, error: "El saldo inicial debe ser un número entero mayor o igual a 0" };
  }

  try {
    await prisma.libro.create({
      data: {
        nombre: nombreLimpio,
        saldo: saldoInicial,
        creadoPorId: parseInt(session.user.id, 10),
      },
    });

    revalidatePath("/maestros");
    revalidatePath("/transacciones");
    return { success: true };
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al crear el maestro";
    return { success: false, error: mensaje };
  }
}
