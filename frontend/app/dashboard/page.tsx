"use client";

import { useEffect } from "react";
import { getSession, hasRole } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/iniciar-sesion");
      return;
    }

    if (hasRole(session, "ROLE_ADMIN")) {
      router.replace("/dashboard/admin");
      return;
    }

    router.replace("/dashboard/cliente");
  }, [router]);

  return (
    <main className="shell py-16">
      <div className="glass-card p-8">Redirigiendo a tu panel...</div>
    </main>
  );
}
