import Link from "next/link";
import ArtworkForm from "@/components/dashboard/ArtworkForm";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export default async function NewArtworkPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <Link
        href="/dashboard/artworks"
        className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
      >
        ← Volver a las obras
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
        Nueva obra
      </h1>
      <div className="mt-10 border border-line bg-white p-6 sm:p-8">
        <ArtworkForm categories={(categories || []) as Category[]} />
      </div>
    </div>
  );
}
