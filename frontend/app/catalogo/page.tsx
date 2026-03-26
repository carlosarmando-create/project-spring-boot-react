import { CatalogGrid } from "@/components/catalog-grid";
import { apiFetch } from "@/lib/api";
import { Plant } from "@/lib/types";

export default async function CatalogPage() {
  const plants = await apiFetch<Plant[]>("/plants").catch(() => []);

  return (
    <main className="shell py-12 md:py-16">
      <section className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Catálogo</p>
        <h1 className="mt-3 text-5xl font-semibold">Plantas y accesorios con estética natural</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Esta vista pública ahora carga registros semilla con fotos reales guardadas en el proyecto y acceso a una
          ficha individual por planta para revisar mejor su descripción, stock y presentación.
        </p>
      </section>
      <CatalogGrid plants={plants} />
    </main>
  );
}
