import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        nombre={session.user.nombre}
        imagen={session.user.imagen}
        rol={session.user.rol}
      />
      <main className="flex-1 lg:ml-0">
        {/* pt-16 en móvil deja espacio para el botón del menú hamburguesa */}
        <div className="min-h-screen p-6 pt-16 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
