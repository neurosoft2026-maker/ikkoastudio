import Link from "next/link";
import { notFound } from "next/navigation";
import ArtworkForm from "@/components/dashboard/ArtworkForm";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import { deleteArtwork } from "@/app/dashboard/actions";
import { createClient } from "@/lib/supabase/server";
import type { Artwork, Category } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArtworkPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: artwork }, { data: categories }] = await Promise.all([
    supabase.from("artworks").select("*").eq("id", id).single(),
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  if (!artwork) notFound();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/artworks"
            className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
          >
            ← Volver a las obras
          </Link>
          <h1 className="mt-6 font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
            Editar obra
          </h1>
          <p className="mt-2 text-sm text-muted">{artwork.artwork_title}</p>
        </div>
        <div className="flex items-center gap-4 sm:pt-10">
          <Link
            href={`/visual-stories/all/${artwork.slug}`}
            target="_blank"
            className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
          >
            Ver en el sitio
          </Link>
          <ConfirmDeleteButton
            action={deleteArtwork}
            id={artwork.id}
            confirmMessage="¿Eliminar esta obra permanentemente?"
          />
        </div>
      </div>
      <div className="mt-10 border border-line bg-white p-6 sm:p-8">
        <ArtworkForm
          categories={(categories || []) as Category[]}
          artwork={artwork as Artwork}
        />
      </div>
    </div>
  );
}
