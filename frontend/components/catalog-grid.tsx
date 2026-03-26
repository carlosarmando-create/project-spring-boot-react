import Image from "next/image";
import Link from "next/link";
import { resolveAssetUrl } from "@/lib/api";
import { Plant } from "@/lib/types";

type Props = {
  plants: Plant[];
};

export function CatalogGrid({ plants }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {plants.map((plant) => (
        <article key={plant.id} className="glass-card overflow-hidden">
          <div className="relative h-64">
            <Image src={resolveAssetUrl(plant.imageUrl)} alt={plant.name} fill className="object-cover" />
          </div>
          <div className="grid gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
                {plant.categoryName}
              </span>
              <span className="text-lg font-semibold text-[var(--primary)]">S/ {Number(plant.price).toFixed(2)}</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">{plant.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{plant.botanicalName || "Especie ornamental"}</p>
            </div>
            <p className="text-sm leading-7 text-[var(--muted)]">{plant.shortDescription}</p>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              <span className="rounded-full bg-white/70 px-3 py-2">Stock {plant.stock}</span>
              <span className="rounded-full bg-white/70 px-3 py-2">{plant.sizeLabel || "Tamaño estándar"}</span>
              {plant.featured && <span className="rounded-full bg-[var(--secondary)] px-3 py-2 text-[var(--foreground)]">Destacada</span>}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/60 pt-4 text-sm text-[var(--muted)]">
              <span>Stock: {plant.stock}</span>
              <Link href={`/catalogo/${plant.slug}`} className="rounded-full border border-[var(--primary)] px-4 py-2 font-medium text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white">
                Ver detalle
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
