"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createStudioJournalVideo } from "@/app/dashboard/actions";

type Props = {
  nextOrder: number;
};

export default function StudioJournalCreateForm({ nextOrder }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-10 border border-line bg-white p-6">
      <form
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          const form = event.currentTarget;
          const formData = new FormData(form);
          startTransition(async () => {
            const result = await createStudioJournalVideo(formData);
            if (result?.error) {
              setError(result.error);
              return;
            }
            form.reset();
            router.refresh();
          });
        }}
      >
        <label className="block flex-1">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Título
          </span>
          <input
            name="title"
            required
            placeholder="p. ej. Proceso en el estudio"
            className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
          />
        </label>
        <label className="block flex-[1.4]">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            URL de YouTube
          </span>
          <input
            name="youtube_url"
            required
            placeholder="https://youtube.com/shorts/..."
            className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
          />
        </label>
        <label className="block w-full sm:w-28">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Orden
          </span>
          <input
            name="sort_order"
            type="number"
            defaultValue={nextOrder}
            className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="h-11 bg-ink px-6 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white disabled:opacity-50"
        >
          {pending ? "Agregando…" : "Agregar"}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
