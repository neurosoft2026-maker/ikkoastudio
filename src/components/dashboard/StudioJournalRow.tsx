"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteStudioJournalVideo,
  updateStudioJournalVideo,
} from "@/app/dashboard/actions";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import type { StudioJournalVideo } from "@/lib/types";

type Props = {
  video: StudioJournalVideo;
};

export default function StudioJournalRow({ video }: Props) {
  const router = useRouter();
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
              const result = await updateStudioJournalVideo(formData);
              if (result?.error) {
                setError(result.error);
                return;
              }
              setEditing(false);
              router.refresh();
            });
          }}
        >
          <input type="hidden" name="id" value={video.id} />
          <label className="block flex-1">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Título
            </span>
            <input
              name="title"
              required
              defaultValue={video.title}
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
              defaultValue={video.youtube_url}
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
              defaultValue={video.sort_order}
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
      <div className="min-w-0">
        <p className="font-medium text-ink">{video.title}</p>
        <p className="truncate text-xs text-muted">{video.youtube_url}</p>
        <p className="mt-1 text-xs text-muted">Orden: {video.sort_order}</p>
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
          action={deleteStudioJournalVideo}
          id={video.id}
          confirmMessage="¿Eliminar este video?"
        />
      </div>
    </li>
  );
}
