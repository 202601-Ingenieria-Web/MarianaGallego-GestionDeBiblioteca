import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

// Rutas que necesitan sesión activa
const rutasProtegidas = ["/transacciones", "/maestros", "/usuarios"];
// Rutas con restricción por rol
const rutasSoloAdmin = ["/usuarios"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const estaAutenticado = !!req.auth;

  const esRutaProtegida = rutasProtegidas.some((ruta) =>
    pathname.startsWith(ruta)
  );

  if (esRutaProtegida && !estaAutenticado) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const esRutaSoloAdmin = rutasSoloAdmin.some((ruta) =>
    pathname.startsWith(ruta)
  );

  if (esRutaSoloAdmin && req.auth?.user?.rol !== "ADMIN") {
    return NextResponse.redirect(new URL("/transacciones", req.url));
  }

  if (estaAutenticado && pathname === "/login") {
    return NextResponse.redirect(new URL("/transacciones", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
