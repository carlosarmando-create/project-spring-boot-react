import { CatalogGrid } from "@/components/catalog-grid";
import { apiFetch } from "@/lib/api";
import { Plant } from "@/lib/types";

export default async function CatalogPage() {
  const plants = await apiFetch<Plant[]>("/plants").catch(() => []);

  return (
    <main className="shell py-12 md:py-16">
      <section className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-(--primary)">Catálogo</p>
        <h1 className="mt-3 text-5xl font-semibold">Plantas y accesorios con estética natural</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-(--muted)">
          Explora una seleccion pensada para llenar de frescura tu hogar,
          oficina o negocio. En cada ficha encontraras informacion util para
          elegir la planta ideal segun tu estilo, espacio y necesidades.
        </p>
      </section>
      <CatalogGrid plants={plants} />
    </main>
  );
}
