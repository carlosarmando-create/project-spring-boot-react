import Link from "next/link";

export function Hero() {
  return (
    <section className="shell grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
      <div className="glass-card p-8 md:p-12">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Plantas para hogares con estilo</p>
        <h1 className="section-title mb-6 max-w-2xl font-semibold">
          Tu tienda online de plantas con una experiencia fresca, natural y profesional.
        </h1>
        <p className="mb-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
          Descubre especies de interior y exterior, accesorios decorativos y un panel administrativo para gestionar
          tu negocio de forma clara.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/catalogo" className="rounded-full bg-[var(--primary)] px-6 py-3 font-medium text-white">
            Ver catálogo
          </Link>
          <Link href="/iniciar-sesion" className="rounded-full border border-[var(--border)] px-6 py-3 font-medium">
            Acceder al sistema
          </Link>
        </div>
      </div>
      <div className="glass-card flex flex-col justify-between gap-6 overflow-hidden p-8">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#dceccf_0%,#f7d3c3_100%)] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Colección destacada</p>
          <div className="mt-6 grid gap-4">
            {[
              ["Monstera Deliciosa", "Follaje escultural para interiores amplios"],
              ["Calathea Medallion", "Hojas vibrantes para rincones acogedores"],
              ["Ficus Lyrata", "Presencia elegante para salas y recepciones"],
            ].map(([name, desc]) => (
              <article key={name} className="rounded-3xl bg-white/70 p-4">
                <h3 className="font-semibold">{name}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{desc}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["100%", "catálogo administrable"],
            ["JWT", "seguridad por roles"],
            ["CRUD", "dashboard completo"],
          ].map(([value, label]) => (
            <div key={value} className="rounded-3xl bg-white/70 p-4 text-center">
              <p className="text-2xl font-semibold text-[var(--primary)]">{value}</p>
              <p className="text-sm text-[var(--muted)]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
