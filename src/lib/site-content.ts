import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type LocalizedSiteContent,
} from "@/lib/site-content-types";

const localContentPath = path.join(process.cwd(), "data", "site-content.json");

async function readLocalContent(): Promise<LocalizedSiteContent> {
  try {
    const raw = await fs.readFile(localContentPath, "utf8");
    return mergeSiteContent(
      JSON.parse(raw) as Partial<LocalizedSiteContent>,
    );
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

async function writeLocalContent(content: LocalizedSiteContent) {
  await fs.mkdir(path.dirname(localContentPath), { recursive: true });
  await fs.writeFile(localContentPath, JSON.stringify(content, null, 2), "utf8");
}

function isMissingTableError(message?: string) {
  if (!message) return false;
  return (
    message.includes("site_content") ||
    message.includes("schema cache") ||
    message.includes("Could not find the table")
  );
}

export async function getSiteContent(): Promise<LocalizedSiteContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data?.content) {
      const content = mergeSiteContent(
        data.content as Partial<LocalizedSiteContent>,
      );
      await writeLocalContent(content);
      return content;
    }

    if (error && !isMissingTableError(error.message) && error.code !== "PGRST205") {
      console.error("site_content read error:", error.message);
    }
  } catch {
    // fall through to local
  }

  return readLocalContent();
}

export async function saveSiteContent(
  content: LocalizedSiteContent,
): Promise<{
  success?: true;
  error?: string;
  usedLocalFallback?: true;
}> {
  const merged = mergeSiteContent(content);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("site_content").upsert({
      id: 1,
      content: merged,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      await writeLocalContent(merged);
      return { success: true };
    }

    if (!isMissingTableError(error.message) && error.code !== "PGRST205") {
      await writeLocalContent(merged);
      return { error: error.message, usedLocalFallback: true };
    }
  } catch {
    // fall through to local
  }

  await writeLocalContent(merged);
  return { success: true, usedLocalFallback: true };
}
