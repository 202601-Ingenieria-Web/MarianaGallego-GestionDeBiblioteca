import type { NextAuthConfig } from "next-auth";

type Rol = "ADMIN" | "USER";

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt", // Para no consultar la BD en cada request
  },
  callbacks: {
    // Persiste datos del usuario en el token al iniciar sesión
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.nombre = user.nombre;
        token.imagen = user.imagen;
      }
      return token;
    },
    // Expone los datos del token en la sesión accesible desde el servidor
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as Rol;
        session.user.nombre = token.nombre as string;
        session.user.imagen =
          (token.imagen as string | null | undefined) ?? null;
      }
      return session;
    },
  },
};
