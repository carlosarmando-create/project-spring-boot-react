"use client";

import { FormEvent, useState } from "react";
import { loginRequest } from "@/lib/api";
import { hasRole, saveSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

type LoginMode = "CLIENTE" | "ADMIN";

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("CLIENTE");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const session = await loginRequest(email, password);

      if (mode === "ADMIN" && !hasRole(session, "ROLE_ADMIN")) {
        throw new Error("Tu cuenta no tiene permisos de administrador.");
      }

      if (mode === "CLIENTE" && !hasRole(session, "ROLE_CUSTOMER")) {
        throw new Error("Tu cuenta no tiene permisos de cliente.");
      }

      saveSession(session);
      router.push(mode === "ADMIN" ? "/dashboard/admin" : "/dashboard/cliente");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell py-12 md:py-20">
      <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-(--primary)">Acceso al sistema</p>
          <h1 className="mt-3 text-4xl font-semibold">Ingresa como cliente o administrador</h1>
          <p className="mt-4 text-(--muted)">
            Por defecto el flujo es de cliente, pero si eliges administrador te llevaremos al dashboard de gestión.
          </p>
          <div className="mt-8 grid gap-4">
            <button
              onClick={() => setMode("CLIENTE")}
              className={`rounded-3xl px-5 py-4 text-left ${mode === "CLIENTE" ? "bg-(--accent)" : "bg-white/70"}`}
            >
              <p className="font-semibold">Cliente</p>
              <p className="text-sm text-(--muted)">Compra productos, revisa pedidos y explora el catálogo.</p>
            </button>
            <button
              onClick={() => setMode("ADMIN")}
              className={`rounded-3xl px-5 py-4 text-left ${mode === "ADMIN" ? "bg-(--secondary)" : "bg-white/70"}`}
            >
              <p className="font-semibold">Administrador</p>
              <p className="text-sm text-(--muted)">Gestiona productos, usuarios, categorías, pedidos y contactos.</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card grid gap-4 p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-(--primary)">Modo actual: {mode}</p>
          <input name="email" type="email" placeholder="Correo electrónico" className="rounded-2xl border border-(--border) bg-white px-4 py-3" required />
          <input name="password" type="password" placeholder="Contraseña" className="rounded-2xl border border-(--border) bg-white px-4 py-3" required />
          <button disabled={loading} className="rounded-full bg-(--primary) px-5 py-3 font-medium text-white disabled:opacity-70">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          {message && <p className="text-sm text-(--primary)">{message}</p>}
          <div className="rounded-3xl bg-white/70 p-4 text-sm text-(--muted)">
            <p className="font-medium text-(--foreground)">Usuario de prueba</p>
            <p>admin@plantstore.com</p>
            <p>Admin123*</p>
          </div>
        </form>
      </section>
    </main>
  );
}
