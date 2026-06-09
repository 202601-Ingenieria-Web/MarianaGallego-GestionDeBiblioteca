import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestión Biblioteca",
  description: "Sistema de administración de inventario y movimientos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        {/* Toaster global para notificaciones de éxito/error en toda la app */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}