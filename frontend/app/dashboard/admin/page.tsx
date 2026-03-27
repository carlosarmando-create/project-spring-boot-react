"use client";

import { useEffect, useState } from "react";
import { getSession, hasRole } from "@/lib/auth";
import { AuthSession } from "@/lib/types";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function AdminDashboardPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.replace("/iniciar-sesion");
      return;
    }
    if (!hasRole(currentSession, "ROLE_ADMIN")) {
      router.replace("/dashboard/cliente");
      return;
    }
    setSession(currentSession);
  }, [router]);

  if (!session) {
    return (
      <main className="shell py-16">
        <div className="glass-card p-8">Cargando panel administrativo...</div>
      </main>
    );
  }

  return (
    <main className="shell py-12">
      <section className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-(--primary)">Area de gestion</p>
        <h1 className="mt-3 text-5xl font-semibold">Organiza la experiencia de compra de tus clientes</h1>
        <p className="mt-4 max-w-3xl text-lg text-(--muted)">
          Manten el catalogo actualizado, revisa pedidos y responde consultas
          desde un solo lugar.
        </p>
      </section>
      <AdminDashboard session={session} />
    </main>
  );
}
