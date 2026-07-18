import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: categoriesCount }, { count: artworksCount }] =
    await Promise.all([
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("artworks").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
        Resumen
      </h1>
      <p className="mt-3 text-muted">
        Administra las categorías y las obras de tu colección.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/categories"
          className="border border-line bg-white p-6 transition-colors hover:border-ink"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Categorías
          </p>
          <p className="mt-3 font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
            {categoriesCount ?? 0}
          </p>
        </Link>
        <Link
          href="/dashboard/artworks"
          className="border border-line bg-white p-6 transition-colors hover:border-ink"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Obras
          </p>
          <p className="mt-3 font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
            {artworksCount ?? 0}
          </p>
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/dashboard/categories"
          className="inline-flex h-11 items-center bg-ink px-5 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white"
        >
          Administrar categorías
        </Link>
        <Link
          href="/dashboard/artworks/new"
          className="inline-flex h-11 items-center border border-ink px-5 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-ink"
        >
          Nueva obra
        </Link>
      </div>
    </div>
  );
}
