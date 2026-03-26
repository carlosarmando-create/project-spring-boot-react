"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, getSession } from "@/lib/auth";
import { AuthSession } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  function handleLogout() {
    clearSession();
    setSession(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="shell pt-4">
        <div className="glass-card flex items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-[0.18em] text-[var(--primary)] uppercase">
            Verdelia
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
            <Link href="/">Inicio</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
            {session && <Link href="/dashboard">Mi panel</Link>}
          </nav>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="hidden text-sm text-[var(--muted)] md:inline">{session.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/iniciar-sesion"
                className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
