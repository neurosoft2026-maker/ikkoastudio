import { createClient } from "@/lib/supabase/server";
import type { StudioJournalVideo } from "@/lib/types";

export async function getStudioJournalVideos(): Promise<StudioJournalVideo[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("studio_journal_videos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) {
      if (
        error &&
        !error.message.includes("studio_journal_videos") &&
        error.code !== "PGRST205"
      ) {
        console.error("studio_journal_videos fetch:", error.message);
      }
      return [];
    }

    return data as StudioJournalVideo[];
  } catch {
    return [];
  }
}
