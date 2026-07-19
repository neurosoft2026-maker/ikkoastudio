import StudioJournalCreateForm from "@/components/dashboard/StudioJournalCreateForm";
import StudioJournalRow from "@/components/dashboard/StudioJournalRow";
import { createClient } from "@/lib/supabase/server";
import type { StudioJournalVideo } from "@/lib/types";

export default async function StudioJournalPage() {
  const supabase = await createClient();
  const { data: videos, error } = await supabase
    .from("studio_journal_videos")
    .select("*")
    .order("sort_order", { ascending: true });

  const missingTable =
    error &&
    (error.code === "PGRST205" ||
      error.message.includes("studio_journal_videos") ||
      error.message.includes("schema cache"));

  return (
    <div>
      <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
        Studio Journal
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Agrega videos de YouTube en formato vertical (tipo Reel/Short). Aparecen
        en la página de inicio, antes de Historias Visuales.
      </p>

      <StudioJournalCreateForm nextOrder={(videos?.length || 0) + 1} />

      {error && (
        <p className="mt-6 text-sm text-red-600">
          {missingTable
            ? "La tabla studio_journal_videos no existe todavía. Ejecuta supabase/migration_studio_journal.sql en el SQL Editor de Supabase."
            : `No se pudieron cargar los videos: ${error.message}`}
        </p>
      )}

      <ul className="mt-8 divide-y divide-line border border-line bg-white">
        {(videos || []).map((video) => (
          <StudioJournalRow
            key={video.id}
            video={video as StudioJournalVideo}
          />
        ))}
        {!videos?.length && !error && (
          <li className="px-5 py-8 text-sm text-muted">
            Aún no hay videos en Studio Journal.
          </li>
        )}
      </ul>
    </div>
  );
}
