import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  nombre: string;
  imagen?: string | null;
  size?: "sm" | "md";
};

function obtenerIniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({ nombre, imagen, size = "md" }: UserAvatarProps) {
  const dimensiones = size === "sm" ? "h-9 w-9" : "h-12 w-12";

  // Si no tiene foto muestra iniciales
  if (imagen) {
    return (
      <img
        src={imagen}
        alt={nombre}
        className={cn(dimensiones, "rounded-full object-cover ring-2 ring-white/20")}
      />
    );
  }

  return (
    <div
      className={cn(
        dimensiones,
        "flex items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white ring-2 ring-white/20"
      )}
    >
      {obtenerIniciales(nombre) || <User className="h-5 w-5" />}
    </div>
  );
}
