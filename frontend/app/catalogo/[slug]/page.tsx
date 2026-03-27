import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch, resolveAssetUrl } from "@/lib/api";
import { Plant } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PlantDetailPage({ params }: Props) {
  const { slug } = await params;
  const plant = await apiFetch<Plant>(`/plants/slug/${slug}`).catch(() => null);

  if (!plant) {
    notFound();
  }

  return (
    <main className="shell py-12 md:py-16">
      <Link href="/catalogo" className="text-sm uppercase tracking-[0.25em] text-(--primary)">
        Volver al catalogo
      </Link>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card overflow-hidden">
          <div className="relative min-h-[380px]">
            <Image src={resolveAssetUrl(plant.imageUrl)} alt={plant.name} fill className="object-cover" priority />
          </div>
        </div>

        <article className="glass-card grid gap-5 p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-(--primary)">{plant.categoryName}</p>
            <h1 className="mt-3 text-5xl font-semibold">{plant.name}</h1>
            <p className="mt-3 text-lg text-(--muted)">{plant.shortDescription}</p>
          </div>

          <div className="grid gap-3 rounded-3xl bg-white/65 p-5 text-sm text-(--muted)">
            <p><span className="font-semibold text-(--foreground)">Nombre botanico:</span> {plant.botanicalName || "No especificado"}</p>
            <p><span className="font-semibold text-(--foreground)">Presentacion:</span> {plant.sizeLabel || "Tamaño estándar"}</p>
            <p><span className="font-semibold text-(--foreground)">Stock disponible:</span> {plant.stock} unidades</p>
            <p><span className="font-semibold text-(--foreground)">Precio referencial:</span> S/ {Number(plant.price).toFixed(2)}</p>
          </div>

          <p className="leading-8 text-(--muted)">{plant.description}</p>

          <div className="flex flex-wrap gap-3">
            {plant.featured && <span className="rounded-full bg-(--secondary) px-4 py-2 text-sm font-medium text-(--foreground)">Producto destacado</span>}
            <span className="rounded-full bg-(--accent) px-4 py-2 text-sm font-medium text-(--primary)">
              Disponible en catalogo administrable
            </span>
          </div>
        </article>
      </section>
    </main>
  );
}
