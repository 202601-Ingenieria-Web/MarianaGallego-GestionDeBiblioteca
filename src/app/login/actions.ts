"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      correo: formData.get("correo"),
      contrasena: formData.get("contrasena"),
      redirectTo: "/transacciones",
    });
  } catch (error) {
    // signIn lanza AuthError si las credenciales fallan
    if (error instanceof AuthError) {
      redirect("/login?error=credenciales");
    }
    // NEXT_REDIRECT se propaga cuando el login es exitoso
    throw error;
  }
}
