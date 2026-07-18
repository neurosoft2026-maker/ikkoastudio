import CategoryRow from "@/components/dashboard/CategoryRow";
import { createCategory } from "../actions";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
        Categorías
      </h1>
      <p className="mt-3 text-muted">
        Crea, edita y elimina las categorías mostradas en Historias Visuales.
      </p>

      <form
        action={createCategory}
        className="mt-10 flex flex-col gap-4 border border-line bg-white p-6 sm:flex-row sm:items-end"
      >
        <label className="block flex-1">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Nombre (español)
          </span>
          <input
            name="name"
            required
            placeholder="p. ej. Pájaros"
            className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
          />
        </label>
        <label className="block flex-1">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Nombre (inglés)
          </span>
          <input
            name="name_en"
            placeholder="e.g. Birds"
            className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
          />
        </label>
        <label className="block w-full sm:w-32">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Orden
          </span>
          <input
            name="sort_order"
            type="number"
            defaultValue={(categories?.length || 0) + 1}
            className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
          />
        </label>
        <button
          type="submit"
          className="h-11 bg-ink px-6 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white"
        >
          Agregar
        </button>
      </form>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          No se pudieron cargar las categorías: {error.message}. Verifica la
          configuración de Supabase.
        </p>
      )}

      <ul className="mt-8 divide-y divide-line border border-line bg-white">
        {(categories || []).map((category) => (
          <CategoryRow key={category.id} category={category as Category} />
        ))}
        {!categories?.length && !error && (
          <li className="px-5 py-8 text-sm text-muted">Aún no hay categorías.</li>
        )}
      </ul>
    </div>
  );
}
