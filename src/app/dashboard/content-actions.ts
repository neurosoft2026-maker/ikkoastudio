"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";
import {
  DEFAULT_SITE_CONTENT,
  type LocalizedSiteContent,
  type SiteContent,
} from "@/lib/site-content-types";
import type { Locale } from "@/lib/locale";

async function uploadSiteFile(file: File, folder: string) {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeName = `${folder}-${Date.now()}.${ext}`;
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("site-media")
    .upload(safeName, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (!error) {
    return supabase.storage.from("site-media").getPublicUrl(safeName).data
      .publicUrl;
  }

  const localDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(localDir, { recursive: true });
  await fs.writeFile(
    path.join(localDir, safeName),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/${folder}/${safeName}`;
}

function value(formData: FormData, key: string, fallback: string) {
  return String(formData.get(key) || "").trim() || fallback;
}

function localeContent(
  formData: FormData,
  locale: Locale,
  fallback: SiteContent,
  videoUrl: string,
  imageUrl: string,
): SiteContent {
  const key = (name: string) => `${locale}_${name}`;
  return {
    hero: {
      eyebrow: value(formData, key("hero_eyebrow"), fallback.hero.eyebrow),
      title: value(formData, key("hero_title"), fallback.hero.title),
      subtitle: value(formData, key("hero_subtitle"), fallback.hero.subtitle),
      ctaPrimary: value(
        formData,
        key("hero_cta_primary"),
        fallback.hero.ctaPrimary,
      ),
      ctaSecondary: value(
        formData,
        key("hero_cta_secondary"),
        fallback.hero.ctaSecondary,
      ),
      videoUrl,
    },
    expressions: {
      eyebrow: value(
        formData,
        key("expressions_eyebrow"),
        fallback.expressions.eyebrow,
      ),
      title: value(
        formData,
        key("expressions_title"),
        fallback.expressions.title,
      ),
      quote: value(
        formData,
        key("expressions_quote"),
        fallback.expressions.quote,
      ),
      attribution: value(
        formData,
        key("expressions_attribution"),
        fallback.expressions.attribution,
      ),
    },
    behind: {
      eyebrow: value(
        formData,
        key("behind_eyebrow"),
        fallback.behind.eyebrow,
      ),
      title: value(formData, key("behind_title"), fallback.behind.title),
      body: value(formData, key("behind_body"), fallback.behind.body),
      imageUrl,
      medium: value(formData, key("behind_medium"), fallback.behind.medium),
      approach: value(
        formData,
        key("behind_approach"),
        fallback.behind.approach,
      ),
      studio: value(formData, key("behind_studio"), fallback.behind.studio),
    },
  };
}

export async function updateSiteContent(formData: FormData) {
  const current = await getSiteContent();
  const videoUrl = value(
    formData,
    "hero_video_url",
    current.en.hero.videoUrl || DEFAULT_SITE_CONTENT.en.hero.videoUrl,
  );
  let imageUrl = value(
    formData,
    "behind_image_url",
    current.en.behind.imageUrl || DEFAULT_SITE_CONTENT.en.behind.imageUrl,
  );

  const imageFile = formData.get("behind_image_file") as File | null;
  if (imageFile?.size) {
    imageUrl =
      (await uploadSiteFile(imageFile, "behind-image")) || imageUrl;
  }

  const content: LocalizedSiteContent = {
    en: localeContent(formData, "en", current.en, videoUrl, imageUrl),
    es: localeContent(formData, "es", current.es, videoUrl, imageUrl),
  };
  const result = await saveSiteContent(content);

  revalidatePath("/");
  revalidatePath("/dashboard/content");
  return {
    success: !result.error,
    error: result.error,
    usedLocalFallback: Boolean(result.usedLocalFallback),
  };
}
