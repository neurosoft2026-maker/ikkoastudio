import ArtworksList, {
  type ArtworkListItem,
} from "@/components/dashboard/ArtworksList";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ArtworksPage() {
  const supabase = await createClient();
  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("id, artwork_title, artwork_code, artist, image_url, slug, categories(name)")
    .order("created_at", { ascending: false });

  const items: ArtworkListItem[] = (artworks || []).map((artwork) => {
    const related = artwork.categories as
      | { name: string }
      | { name: string }[]
      | null;
    const category = Array.isArray(related) ? related[0] || null : related;

    return {
      id: artwork.id,
      artwork_title: artwork.artwork_title,
      artwork_code: artwork.artwork_code,
      artist: artwork.artist,
      image_url: artwork.image_url,
      slug: artwork.slug,
      categories: category,
    };
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
            Obras
          </h1>
          <p className="mt-3 text-muted">
            Crea, edita y elimina las obras de tu colección.
          </p>
        </div>
        <Link
          href="/dashboard/artworks/new"
          className="inline-flex h-11 items-center bg-ink px-5 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white"
        >
          Nueva obra
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          No se pudieron cargar las obras: {error.message}
        </p>
      )}

      {!error && <ArtworksList artworks={items} />}
    </div>
  );
}
