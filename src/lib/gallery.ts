import { createClient } from "@/lib/supabase/server";
import type { Artwork, Category } from "@/lib/types";
import { slugify } from "@/lib/types";

export type GalleryCategory = Category & {
  slug: string;
};

export type GalleryArtwork = Artwork & {
  category_name?: string | null;
  category_name_en?: string | null;
};

export function categorySlug(name: string) {
  return slugify(name);
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("categories fetch:", error?.message);
    return [];
  }

  return data.map((category) => ({
    ...(category as Category),
    slug: categorySlug(category.name),
  }));
}

export async function getGalleryArtworks(
  categoryId?: string | null,
): Promise<GalleryArtwork[]> {
  const supabase = await createClient();

  const buildQuery = (select: string) => {
    let query = supabase
      .from("artworks")
      .select(select)
      .order("created_at", { ascending: false });
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    return query;
  };

  let { data, error } = await buildQuery("*, categories(name, name_en)");

  // Fallback while the name_en migration has not been applied yet.
  if (error) {
    ({ data, error } = await buildQuery("*, categories(name)"));
  }

  if (error || !data) {
    console.error("artworks fetch:", error?.message);
    return [];
  }

  type ArtworkRow = Artwork & {
    categories: { name: string; name_en?: string | null } | null;
  };

  return (data as unknown as ArtworkRow[]).map((row) => {
    const related = row.categories;
    return {
      ...row,
      category_name: related?.name ?? null,
      category_name_en: related?.name_en ?? null,
    };
  });
}

export async function getCategoryByParam(param: string) {
  if (param === "all") {
    return {
      id: "all",
      name: "All",
      slug: "all",
      sort_order: 0,
      created_at: "",
    } as GalleryCategory & { id: string };
  }

  const categories = await getGalleryCategories();
  return (
    categories.find((category) => category.slug === param) ||
    categories.find((category) => category.id === param) ||
    null
  );
}

export async function getArtworkBySlug(slug: string) {
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("artworks")
    .select("*, categories(name, name_en)")
    .eq("slug", slug)
    .maybeSingle();

  // Fallback while the name_en migration has not been applied yet.
  if (error) {
    ({ data, error } = await supabase
      .from("artworks")
      .select("*, categories(name)")
      .eq("slug", slug)
      .maybeSingle());
  }

  if (error || !data) return null;

  const related = data.categories as {
    name: string;
    name_en: string | null;
  } | null;
  return {
    ...(data as Artwork),
    category_name: related?.name ?? null,
    category_name_en: related?.name_en ?? null,
  } as GalleryArtwork;
}
