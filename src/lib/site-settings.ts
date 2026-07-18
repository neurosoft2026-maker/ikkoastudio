import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";

const localSettingsPath = path.join(process.cwd(), "data", "site-settings.json");

type LocalSettings = {
  home_enabled: boolean;
};

async function readLocalSettings(): Promise<LocalSettings> {
  try {
    const raw = await fs.readFile(localSettingsPath, "utf8");
    return JSON.parse(raw) as LocalSettings;
  } catch {
    return { home_enabled: true };
  }
}

async function writeLocalSettings(settings: LocalSettings) {
  await fs.mkdir(path.dirname(localSettingsPath), { recursive: true });
  await fs.writeFile(localSettingsPath, JSON.stringify(settings, null, 2), "utf8");
}

function isMissingTableError(message?: string) {
  if (!message) return false;
  return (
    message.includes("site_settings") ||
    message.includes("schema cache") ||
    message.includes("Could not find the table")
  );
}

export async function getHomeEnabled() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("home_enabled")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data) {
      return Boolean(data.home_enabled);
    }

    // Table missing or empty → local fallback
    if (error && !isMissingTableError(error.message) && error.code !== "PGRST205") {
      console.error("site_settings read error:", error.message);
    }

    const local = await readLocalSettings();
    return Boolean(local.home_enabled);
  } catch {
    const local = await readLocalSettings();
    return Boolean(local.home_enabled);
  }
}

export async function saveHomeEnabled(enabled: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      home_enabled: enabled,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      // Keep local mirror in sync when Supabase works
      await writeLocalSettings({ home_enabled: enabled });
      return { success: true as const };
    }

    if (!isMissingTableError(error.message) && error.code !== "PGRST205") {
      return { error: error.message };
    }
  } catch {
    // fall through to local
  }

  await writeLocalSettings({ home_enabled: enabled });
  return { success: true as const, usedLocalFallback: true as const };
}
