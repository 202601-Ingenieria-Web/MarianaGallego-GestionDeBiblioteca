// Configuración completa de auth con acceso a BD
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        correo: { label: "Correo", type: "email" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const correo = credentials?.correo as string | undefined;
        const contrasena = credentials?.contrasena as string | undefined;

        if (!correo || !contrasena) {
          return null;
        }

        const usuario = await prisma.usuario.findUnique({
          where: { correo },
        });

        // Null indica credenciales inválidas
        if (!usuario) {
          return null;
        }

        const contrasenaValida = await bcrypt.compare(
          contrasena,
          usuario.hashContrasena
        );

        if (!contrasenaValida) {
          return null;
        }

        return {
          id: usuario.id.toString(),
          email: usuario.correo,
          nombre: usuario.nombre,
          imagen: usuario.imagen,
          rol: usuario.rol,
        };
      },
    }),
  ],
});
