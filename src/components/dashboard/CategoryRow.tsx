"use client";

import { useState, useTransition } from "react";
import { deleteCategory, updateCategory } from "@/app/dashboard/actions";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import type { Category } from "@/lib/types";

type Props = {
  category: Category;
};

export default function CategoryRow({ category }: Props) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="bg-background/40 px-5 py-5">
        <form
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await updateCategory(formData);
              if (result?.error) {
                setError(result.error);
                return;
              }
              setEditing(false);
            });
          }}
        >
          <input type="hidden" name="id" value={category.id} />
          <label className="block flex-1">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Nombre (español)
            </span>
            <input
              name="name"
              required
              defaultValue={category.name}
              className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
            />
          </label>
          <label className="block flex-1">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Nombre (inglés)
            </span>
            <input
              name="name_en"
              defaultValue={category.name_en || ""}
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
              defaultValue={category.sort_order}
              className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="h-11 bg-ink px-5 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white disabled:opacity-50"
            >
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className="h-11 border border-line px-5 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-ink">
          {category.name}
          {category.name_en && (
            <span className="ml-2 text-sm font-normal text-muted">
              / EN: {category.name_en}
            </span>
          )}
        </p>
        <p className="text-xs text-muted">Orden: {category.sort_order}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-ink"
        >
          Editar
        </button>
        <ConfirmDeleteButton
          action={deleteCategory}
          id={category.id}
          confirmMessage="¿Eliminar esta categoría?"
        />
      </div>
    </li>
  );
}
