"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import { deleteArtwork } from "@/app/dashboard/actions";

export type ArtworkListItem = {
  id: string;
  artwork_title: string;
  artwork_code: string | null;
  artist: string | null;
  image_url: string;
  slug: string;
  categories: { name: string } | null;
};

type Props = {
  artworks: ArtworkListItem[];
};

export default function ArtworksList({ artworks }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artworks;

    return artworks.filter((artwork) => {
      const haystack = [
        artwork.artwork_title,
        artwork.artwork_code,
        artwork.artist,
        artwork.slug,
        artwork.categories?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [artworks, query]);

  return (
    <div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block w-full sm:max-w-md">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Buscar obras
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Título, código, artista o categoría…"
            className="w-full border border-line bg-white px-4 py-3 outline-none focus:border-ink"
            autoComplete="off"
          />
        </label>
        <p className="text-xs uppercase tracking-[0.14em] text-muted sm:pt-6">
          {filtered.length} of {artworks.length}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((artwork) => (
            <article key={artwork.id} className="border border-line bg-white">
              <div className="relative aspect-[3/4] bg-ink/5">
                <Image
                  src={artwork.image_url}
                  alt={artwork.artwork_title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                  {artwork.categories?.name || "Uncategorized"}
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-title)] text-xl font-semibold text-ink">
                  {artwork.artwork_title}
                </h2>
                {artwork.artwork_code && (
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                    {artwork.artwork_code}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/dashboard/artworks/${artwork.id}/edit`}
                    className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-ink"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/visual-stories/all/${artwork.slug}`}
                    target="_blank"
                    className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                  >
                    Ver
                  </Link>
                  <ConfirmDeleteButton
                    action={deleteArtwork}
                    id={artwork.id}
                    confirmMessage="¿Eliminar esta obra?"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-muted">
          {query.trim()
            ? `No hay obras que coincidan con “${query.trim()}”.`
            : "Aún no hay obras."}
        </p>
      )}
    </div>
  );
}
