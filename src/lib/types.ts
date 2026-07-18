export type Category = {
  id: string;
  name: string;
  name_en?: string | null;
  sort_order: number;
  created_at: string;
};

export type Artwork = {
  id: string;
  category_id: string | null;
  artwork_title: string;
  artwork_title_en?: string | null;
  artist: string;
  year: string | null;
  series: string | null;
  medium: string | null;
  dimensions: string | null;
  edition: string | null;
  availability: string | null;
  artwork_statement: string | null;
  artists_reflection: string | null;
  inspiration: string | null;
  concept: string | null;
  creative_process: string | null;
  color_palette: string | null;
  details: string | null;
  signature: string | null;
  certificate_of_authenticity: string | null;
  framing: string | null;
  condition: string | null;
  shipping_information: string | null;
  price: number | null;
  artwork_code: string | null;
  print_available?: boolean | null;
  print_price?: number | null;
  print_edition_size?: number | null;
  print_sold_count?: number | null;
  print_medium?: string | null;
  print_dimensions?: string | null;
  collection_notes: string | null;
  exhibition_history: string | null;
  publications: string | null;
  awards_recognition: string | null;
  collector_information: string | null;
  location: string | null;
  keywords: string[] | null;
  inquiry: string | null;
  image_url: string;
  youtube_url: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
