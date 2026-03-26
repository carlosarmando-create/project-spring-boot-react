"use client";

import { useEffect, useState } from "react";
import { getSession, hasRole } from "@/lib/auth";
import { AuthSession } from "@/lib/types";
import { useRouter } from "next/navigation";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

export default function CustomerDashboardPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.replace("/iniciar-sesion");
      return;
    }
    if (!hasRole(currentSession, "ROLE_CUSTOMER")) {
      router.replace("/");
      return;
    }
    setSession(currentSession);
  }, [router]);

  if (!session) {
    return (
      <main className="shell py-16">
        <div className="glass-card p-8">Cargando panel del cliente...</div>
      </main>
    );
  }

  return (
    <main className="shell py-12">
      <section className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Panel del cliente</p>
        <h1 className="mt-3 text-5xl font-semibold">Tu espacio para seguir compras y datos</h1>
      </section>
      <CustomerDashboard session={session} />
    </main>
  );
}
