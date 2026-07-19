"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/types";
import { getYouTubeVideoId } from "@/lib/youtube";

export async function createCategory(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  const supabase = await createClient();
  const payload = {
    name,
    name_en: emptyToNull(formData.get("name_en")),
    sort_order: Number(formData.get("sort_order") || 0),
  };

  let { error } = await supabase.from("categories").insert(payload);
  if (isMissingColumnError(error, "name_en")) {
    const { name_en: _omit, ...rest } = payload;
    void _omit;
    ({ error } = await supabase.from("categories").insert(rest));
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/");
  revalidatePath("/visual-stories", "layout");
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!id) return { error: "Missing id" };
  if (!name) return { error: "El nombre es obligatorio" };

  const supabase = await createClient();
  const payload = {
    name,
    name_en: emptyToNull(formData.get("name_en")),
    sort_order: Number(formData.get("sort_order") || 0),
  };

  let { error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id);
  if (isMissingColumnError(error, "name_en")) {
    const { name_en: _omit, ...rest } = payload;
    void _omit;
    ({ error } = await supabase.from("categories").update(rest).eq("id", id));
  }

  if (error) return { error: error.message };

  revalidatePath("/dashboard/categories");
  revalidatePath("/");
  revalidatePath("/visual-stories", "layout");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);

  revalidatePath("/dashboard/categories");
  revalidatePath("/");
  revalidatePath("/visual-stories", "layout");
}

function parseKeywords(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createArtwork(formData: FormData) {
  const supabase = await createClient();
  const title = String(formData.get("artwork_title") || "").trim();
  if (!title) return { error: "El título de la obra es obligatorio" };

  const imageFile = formData.get("image") as File | null;
  let imageUrl = String(formData.get("image_url") || "").trim();

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${slugify(title)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("artworks")
      .upload(path, imageFile, { upsert: false });

    if (uploadError) return { error: uploadError.message };

    const { data } = supabase.storage.from("artworks").getPublicUrl(path);
    imageUrl = data.publicUrl;
  }

  if (!imageUrl) return { error: "La imagen es obligatoria (archivo o URL)" };

  const priceRaw = String(formData.get("price") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();

  const payload = {
    artwork_title: title,
    artwork_title_en: emptyToNull(formData.get("artwork_title_en")),
    artist: String(formData.get("artist") || "Gustavo Moreno").trim(),
    year: emptyToNull(formData.get("year")),
    series: emptyToNull(formData.get("series")),
    medium: emptyToNull(formData.get("medium")),
    dimensions: emptyToNull(formData.get("dimensions")),
    edition: emptyToNull(formData.get("edition")),
    availability: emptyToNull(formData.get("availability")),
    artwork_statement: emptyToNull(formData.get("artwork_statement")),
    artists_reflection: emptyToNull(formData.get("artists_reflection")),
    inspiration: emptyToNull(formData.get("inspiration")),
    concept: emptyToNull(formData.get("concept")),
    creative_process: emptyToNull(formData.get("creative_process")),
    color_palette: emptyToNull(formData.get("color_palette")),
    details: emptyToNull(formData.get("details")),
    signature: emptyToNull(formData.get("signature")),
    certificate_of_authenticity: emptyToNull(
      formData.get("certificate_of_authenticity"),
    ),
    framing: emptyToNull(formData.get("framing")),
    condition: emptyToNull(formData.get("condition")),
    shipping_information: emptyToNull(formData.get("shipping_information")),
    price: priceRaw ? Number(priceRaw) : null,
    artwork_code: emptyToNull(formData.get("artwork_code")),
    ...printFieldsFromForm(formData),
    collection_notes: emptyToNull(formData.get("collection_notes")),
    exhibition_history: emptyToNull(formData.get("exhibition_history")),
    publications: emptyToNull(formData.get("publications")),
    awards_recognition: emptyToNull(formData.get("awards_recognition")),
    collector_information: emptyToNull(formData.get("collector_information")),
    location: emptyToNull(formData.get("location")),
    keywords: parseKeywords(String(formData.get("keywords") || "")),
    inquiry: emptyToNull(formData.get("inquiry")),
    image_url: imageUrl,
    youtube_url: emptyToNull(formData.get("youtube_url")),
    slug: slugify(title),
    category_id: categoryId || null,
  };

  let { error } = await supabase.from("artworks").insert(payload);
  if (isMissingColumnError(error, "artwork_title_en")) {
    const { artwork_title_en: _omit, ...rest } = payload;
    void _omit;
    ({ error } = await supabase.from("artworks").insert(rest));
  }
  if (error) return { error: friendlyArtworkError(error) };

  revalidatePath("/dashboard/artworks");
  revalidatePath("/");
  revalidatePath("/visual-stories", "layout");
  redirect("/dashboard/artworks");
}

export async function updateArtwork(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Falta el identificador" };

  const supabase = await createClient();
  const title = String(formData.get("artwork_title") || "").trim();
  if (!title) return { error: "El título de la obra es obligatorio" };

  const imageFile = formData.get("image") as File | null;
  let imageUrl = String(formData.get("image_url") || "").trim();

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${slugify(title)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("artworks")
      .upload(path, imageFile, { upsert: false });

    if (uploadError) return { error: uploadError.message };

    const { data } = supabase.storage.from("artworks").getPublicUrl(path);
    imageUrl = data.publicUrl;
  }

  if (!imageUrl) return { error: "La imagen es obligatoria (archivo o URL)" };

  const priceRaw = String(formData.get("price") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();

  const payload = {
    artwork_title: title,
    artwork_title_en: emptyToNull(formData.get("artwork_title_en")),
    artist: String(formData.get("artist") || "Gustavo Moreno").trim(),
    year: emptyToNull(formData.get("year")),
    series: emptyToNull(formData.get("series")),
    medium: emptyToNull(formData.get("medium")),
    dimensions: emptyToNull(formData.get("dimensions")),
    edition: emptyToNull(formData.get("edition")),
    availability: emptyToNull(formData.get("availability")),
    artwork_statement: emptyToNull(formData.get("artwork_statement")),
    artists_reflection: emptyToNull(formData.get("artists_reflection")),
    inspiration: emptyToNull(formData.get("inspiration")),
    concept: emptyToNull(formData.get("concept")),
    creative_process: emptyToNull(formData.get("creative_process")),
    color_palette: emptyToNull(formData.get("color_palette")),
    details: emptyToNull(formData.get("details")),
    signature: emptyToNull(formData.get("signature")),
    certificate_of_authenticity: emptyToNull(
      formData.get("certificate_of_authenticity"),
    ),
    framing: emptyToNull(formData.get("framing")),
    condition: emptyToNull(formData.get("condition")),
    shipping_information: emptyToNull(formData.get("shipping_information")),
    price: priceRaw ? Number(priceRaw) : null,
    artwork_code: emptyToNull(formData.get("artwork_code")),
    ...printFieldsFromForm(formData),
    collection_notes: emptyToNull(formData.get("collection_notes")),
    exhibition_history: emptyToNull(formData.get("exhibition_history")),
    publications: emptyToNull(formData.get("publications")),
    awards_recognition: emptyToNull(formData.get("awards_recognition")),
    collector_information: emptyToNull(formData.get("collector_information")),
    location: emptyToNull(formData.get("location")),
    keywords: parseKeywords(String(formData.get("keywords") || "")),
    inquiry: emptyToNull(formData.get("inquiry")),
    image_url: imageUrl,
    youtube_url: emptyToNull(formData.get("youtube_url")),
    slug: String(formData.get("slug") || slugify(title)),
    category_id: categoryId || null,
    updated_at: new Date().toISOString(),
  };

  let { error } = await supabase
    .from("artworks")
    .update(payload)
    .eq("id", id);
  if (isMissingColumnError(error, "artwork_title_en")) {
    const { artwork_title_en: _omit, ...rest } = payload;
    void _omit;
    ({ error } = await supabase.from("artworks").update(rest).eq("id", id));
  }
  if (error) return { error: friendlyArtworkError(error) };

  revalidatePath("/dashboard/artworks");
  revalidatePath("/");
  revalidatePath("/visual-stories", "layout");
  redirect("/dashboard/artworks");
}

export async function deleteArtwork(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();

  const { data: artwork } = await supabase
    .from("artworks")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("artworks").delete().eq("id", id);

  // Best-effort cleanup of uploaded image in storage.
  if (artwork?.image_url) {
    try {
      const marker = "/storage/v1/object/public/artworks/";
      const index = artwork.image_url.indexOf(marker);
      if (index !== -1) {
        const path = decodeURIComponent(
          artwork.image_url.slice(index + marker.length),
        );
        await supabase.storage.from("artworks").remove([path]);
      }
    } catch {
      // Ignore storage cleanup errors.
    }
  }

  revalidatePath("/dashboard/artworks");
  revalidatePath("/");
  revalidatePath("/visual-stories", "layout");
  redirect("/dashboard/artworks");
}

type SupabaseError = { code?: string; message?: string } | null;

function isMissingColumnError(error: SupabaseError, column: string) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    Boolean(error.message && error.message.includes(column))
  );
}

function friendlyArtworkError(error: SupabaseError) {
  if (!error) return "No se pudo guardar la obra.";
  // Unique violation (duplicate slug or artwork_code).
  if (error.code === "23505") {
    if (error.message?.includes("slug")) {
      return "Ya existe una obra con un título muy parecido. Cambia ligeramente el título e inténtalo de nuevo.";
    }
    if (error.message?.includes("artwork_code")) {
      return "Ese código de obra ya existe. Genera uno nuevo e inténtalo de nuevo.";
    }
    return "Ese registro ya existe (valor duplicado).";
  }
  return error.message || "No se pudo guardar la obra.";
}

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text ? text : null;
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function printFieldsFromForm(formData: FormData) {
  const printAvailable =
    String(formData.get("print_available") || "") === "on" ||
    String(formData.get("print_available") || "") === "true";
  const editionSize = parseOptionalNumber(formData.get("print_edition_size"));
  const soldCount = parseOptionalNumber(formData.get("print_sold_count"));

  return {
    print_available: printAvailable,
    print_price: printAvailable
      ? parseOptionalNumber(formData.get("print_price"))
      : null,
    print_edition_size: printAvailable ? editionSize : null,
    print_sold_count: printAvailable
      ? Math.max(0, Math.floor(soldCount ?? 0))
      : 0,
    print_medium: printAvailable
      ? emptyToNull(formData.get("print_medium"))
      : null,
    print_dimensions: printAvailable
      ? emptyToNull(formData.get("print_dimensions"))
      : null,
  };
}

function parseStudioJournalPayload(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const youtubeUrl = String(formData.get("youtube_url") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);

  if (!title) return { error: "El título es obligatorio" };
  if (!getYouTubeVideoId(youtubeUrl)) {
    return {
      error:
        "La URL del video no es válida. Usa un enlace de YouTube (incluye Shorts).",
    };
  }

  return {
    payload: {
      title,
      youtube_url: youtubeUrl,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  };
}

function isMissingStudioJournalTable(message?: string, code?: string) {
  return (
    code === "PGRST205" ||
    Boolean(
      message &&
        (message.includes("studio_journal_videos") ||
          message.includes("schema cache") ||
          message.includes("Could not find the table")),
    )
  );
}

export async function createStudioJournalVideo(formData: FormData) {
  const parsed = parseStudioJournalPayload(formData);
  if ("error" in parsed && parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("studio_journal_videos")
    .insert(parsed.payload!);

  if (error) {
    if (isMissingStudioJournalTable(error.message, error.code)) {
      return {
        error:
          "La tabla studio_journal_videos no existe. Ejecuta supabase/migration_studio_journal.sql en el SQL Editor de Supabase.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/studio-journal");
  revalidatePath("/");
}

export async function updateStudioJournalVideo(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing id" };

  const parsed = parseStudioJournalPayload(formData);
  if ("error" in parsed && parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("studio_journal_videos")
    .update(parsed.payload!)
    .eq("id", id);

  if (error) {
    if (isMissingStudioJournalTable(error.message, error.code)) {
      return {
        error:
          "La tabla studio_journal_videos no existe. Ejecuta supabase/migration_studio_journal.sql en el SQL Editor de Supabase.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/studio-journal");
  revalidatePath("/");
}

export async function deleteStudioJournalVideo(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("studio_journal_videos").delete().eq("id", id);

  revalidatePath("/dashboard/studio-journal");
  revalidatePath("/");
}
