import { Leaf, ShieldCheck, ShoppingBag, Upload } from "lucide-react";

const items = [
  { icon: Leaf, title: "Catálogo especializado", description: "Productos organizados por categorías para que el cliente encuentre rápido lo que busca." },
  { icon: Upload, title: "Carga local de imágenes", description: "El administrador puede registrar productos con fotografías reales desde su equipo." },
  { icon: ShieldCheck, title: "Seguridad con JWT", description: "Autenticación moderna y control de permisos para cliente, administrador o ambos roles." },
  { icon: ShoppingBag, title: "Gestión de ventas", description: "Pedidos, mensajes de contacto y usuarios en un solo dashboard administrativo." },
];

export function Features() {
  return (
    <section className="shell py-8 md:py-16">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Qué incluye</p>
        <h2 className="mt-3 text-4xl font-semibold">Una plataforma lista para vender plantas online</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map(({ icon: Icon, title, description }) => (
          <article key={title} className="glass-card p-6">
            <div className="mb-5 inline-flex rounded-2xl bg-[var(--accent)] p-3 text-[var(--primary)]">
              <Icon />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
