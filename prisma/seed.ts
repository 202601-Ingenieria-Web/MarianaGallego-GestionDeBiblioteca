import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

// Datos iniciales para desarrollo y pruebas
async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  const admin = await prisma.usuario.upsert({
    where: { correo: "admin@biblioteca.com" },
    update: {},
    create: {
      correo: "admin@biblioteca.com",
      hashContrasena: adminHash,
      nombre: "Administrador",
      rol: "ADMIN",
    },
  });

  const user = await prisma.usuario.upsert({
    where: { correo: "user@biblioteca.com" },
    update: {},
    create: {
      correo: "user@biblioteca.com",
      hashContrasena: userHash,
      nombre: "Usuario Regular",
      rol: "USER",
    },
  });

  // Busca por nombre para no duplicar libros
  async function obtenerOCrearLibro(
    nombre: string,
    saldo: number,
    creadoPorId: number
  ) {
    const existente = await prisma.libro.findFirst({ where: { nombre } });
    if (existente) return existente;
    return prisma.libro.create({ data: { nombre, saldo, creadoPorId } });
  }

  const libros = await Promise.all([
    obtenerOCrearLibro("Cien años de soledad", 10, admin.id),
    obtenerOCrearLibro("El amor en los tiempos del cólera", 5, admin.id),
    obtenerOCrearLibro("La hojarasca", 8, admin.id),
  ]);

  // Movimientos con fechas pasadas para probar la gráfica
  const movimientosExistentes = await prisma.movimiento.count();
  if (movimientosExistentes === 0) {
    const haceDosDias = new Date();
    haceDosDias.setDate(haceDosDias.getDate() - 2);

    const haceUnDia = new Date();
    haceUnDia.setDate(haceUnDia.getDate() - 1);

    await prisma.movimiento.createMany({
      data: [
        {
          tipo: "ENTRADA",
          cantidad: 10,
          libroId: libros[0].id,
          ejecutadoPorId: admin.id,
          fechaCreacion: haceDosDias,
        },
        {
          tipo: "SALIDA",
          cantidad: 2,
          libroId: libros[0].id,
          ejecutadoPorId: user.id,
          fechaCreacion: haceUnDia,
        },
        {
          tipo: "ENTRADA",
          cantidad: 5,
          libroId: libros[1].id,
          ejecutadoPorId: admin.id,
          fechaCreacion: haceDosDias,
        },
        {
          tipo: "ENTRADA",
          cantidad: 8,
          libroId: libros[2].id,
          ejecutadoPorId: admin.id,
          fechaCreacion: haceUnDia,
        },
      ],
    });
  }

  console.log("Seed completado:");
  console.log("  ADMIN: admin@biblioteca.com / admin123");
  console.log("  USER:  user@biblioteca.com / user123");
}

main()
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
