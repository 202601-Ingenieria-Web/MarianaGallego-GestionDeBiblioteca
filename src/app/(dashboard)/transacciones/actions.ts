"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TipoMovimiento } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type LibroOption = {
  id: number;
  nombre: string;
  saldo: number;
};

export type MovimientoRow = {
  id: number;
  fecha: string;
  cantidad: number;
  tipo: TipoMovimiento;
  ejecutadoPor: string;
};

export type SaldoDiario = {
  fecha: string;
  saldo: number;
};

function formatearFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatearFechaCorta(fecha: Date) {
  return fecha.toISOString().split("T")[0];
}

export async function obtenerLibros(): Promise<LibroOption[]> {
  const libros = await prisma.libro.findMany({
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, saldo: true },
  });
  return libros;
}

export async function obtenerMovimientos(
  libroId: number
): Promise<MovimientoRow[]> {
  const movimientos = await prisma.movimiento.findMany({
    where: { libroId },
    orderBy: { fechaCreacion: "desc" },
    include: {
      ejecutadoPor: { select: { nombre: true } },
    },
  });

  return movimientos.map((m) => ({
    id: m.id,
    fecha: formatearFecha(m.fechaCreacion),
    cantidad: m.cantidad,
    tipo: m.tipo,
    ejecutadoPor: m.ejecutadoPor.nombre,
  }));
}

// Calcula el saldo acumulado al cierre de cada día para la gráfica.
// El saldo inicial se deduce restando el total de movimientos al saldo actual del libro.
export async function obtenerSaldosDiarios(
  libroId: number
): Promise<SaldoDiario[]> {
  const libro = await prisma.libro.findUnique({
    where: { id: libroId },
  });

  if (!libro) return [];

  const movimientos = await prisma.movimiento.findMany({
    where: { libroId },
    orderBy: { fechaCreacion: "asc" },
  });

  let netoMovimientos = 0;
  for (const m of movimientos) {
    netoMovimientos += m.tipo === "ENTRADA" ? m.cantidad : -m.cantidad;
  }

  // Cubre libros creados con saldo inicial sin movimiento asociado
  const saldoInicial = libro.saldo - netoMovimientos;
  const diasConDatos = new Set<string>();
  diasConDatos.add(formatearFechaCorta(libro.fechaCreacion));

  for (const m of movimientos) {
    diasConDatos.add(formatearFechaCorta(m.fechaCreacion));
  }

  const diasOrdenados = Array.from(diasConDatos).sort();
  const puntos: SaldoDiario[] = [];
  let saldoAcumulado = saldoInicial;
  let indiceMovimiento = 0;

  for (const dia of diasOrdenados) {
    while (indiceMovimiento < movimientos.length) {
      const movimiento = movimientos[indiceMovimiento];
      const diaMovimiento = formatearFechaCorta(movimiento.fechaCreacion);

      if (diaMovimiento !== dia) break;

      saldoAcumulado +=
        movimiento.tipo === "ENTRADA"
          ? movimiento.cantidad
          : -movimiento.cantidad;
      indiceMovimiento++;
    }

    puntos.push({
      fecha: new Date(dia + "T12:00:00").toLocaleDateString("es-CO", {
        month: "short",
        day: "numeric",
      }),
      saldo: saldoAcumulado,
    });
  }

  return puntos;
}

type CrearMovimientoResult =
  | { success: true }
  | { success: false; error: string };

export async function crearMovimiento(
  libroId: number,
  tipo: TipoMovimiento,
  cantidad: number
): Promise<CrearMovimientoResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return { success: false, error: "La cantidad debe ser un número positivo" };
  }

  try {
    // Transacción atómica: movimiento y actualización de saldo deben ocurrir al mismo tiempo
    await prisma.$transaction(async (tx) => {
      const libro = await tx.libro.findUnique({ where: { id: libroId } });

      if (!libro) {
        throw new Error("Libro no encontrado");
      }

      if (tipo === "SALIDA" && libro.saldo < cantidad) {
        throw new Error("Saldo insuficiente para realizar la salida");
      }

      await tx.movimiento.create({
        data: {
          tipo,
          cantidad,
          libroId,
          ejecutadoPorId: parseInt(session.user.id, 10),
        },
      });

      await tx.libro.update({
        where: { id: libroId },
        data: {
          saldo:
            tipo === "ENTRADA"
              ? { increment: cantidad }
              : { decrement: cantidad },
        },
      });
    });

    revalidatePath("/transacciones");
    revalidatePath("/maestros");
    return { success: true };
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al crear el movimiento";
    return { success: false, error: mensaje };
  }
}
