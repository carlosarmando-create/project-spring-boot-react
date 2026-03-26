import Link from "next/link";

export function Cta() {
  return (
    <section className="shell py-8 md:py-16">
      <div className="glass-card overflow-hidden p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Experiencia dual</p>
            <h2 className="mt-3 text-4xl font-semibold">Clientes al frente, administración detrás, todo en el mismo sistema.</h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              La página principal está pensada para compradores, pero el sistema permite que una misma cuenta tenga rol
              de cliente y administrador sin duplicar usuarios.
            </p>
          </div>
          <div className="rounded-[30px] bg-[var(--accent)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Accesos rápidos</p>
            <div className="mt-5 flex flex-col gap-4">
              <Link href="/iniciar-sesion" className="rounded-full bg-[var(--primary)] px-5 py-3 text-center font-medium text-white">
                Entrar al panel
              </Link>
              <Link href="/catalogo" className="rounded-full border border-[var(--primary)] px-5 py-3 text-center font-medium text-[var(--primary)]">
                Explorar productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
