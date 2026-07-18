export type CategoryId =
  | "all"
  | "celebrities"
  | "musicians"
  | "painters"
  | "actors";

export type ArtworkCategory = Exclude<CategoryId, "all">;

export type Artwork = {
  slug: string;
  title: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  description: string;
  image: string;
  categories: ArtworkCategory[];
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "celebrities", label: "Celebrities" },
  { id: "musicians", label: "Musicians" },
  { id: "painters", label: "Painters" },
  { id: "actors", label: "Actors" },
];

export const artworks: Artwork[] = [
  {
    slug: "jimi-hendrix",
    title: "Jimi Hendrix",
    year: "2024",
    medium: "Mixed media on canvas",
    dimensions: "100 × 100 cm",
    description:
      "An expressive portrait of Jimi Hendrix, capturing the electric energy of his performance through bold color, gesture, and texture.",
    categories: ["celebrities", "musicians"],
    image: "/arts/HIJY.png",
  },
  {
    slug: "gustavo-cerati",
    title: "Gustavo Cerati",
    year: "2024",
    medium: "Mixed media on canvas",
    dimensions: "100 × 100 cm",
    description:
      "A vibrant tribute to Gustavo Cerati — rock icon and poetic voice — painted with layered strokes that echo rhythm and emotion.",
    categories: ["celebrities", "musicians"],
    image: "/arts/cerati.png",
  },
  {
    slug: "kurt-cobain",
    title: "Kurt Cobain",
    year: "2025",
    medium: "Mixed media on canvas",
    dimensions: "100 × 100 cm",
    description:
      "A contemplative portrait of Kurt Cobain, balancing intensity and silence through expressive color and raw brushwork.",
    categories: ["celebrities", "musicians"],
    image: "/arts/kurt.png",
  },
];

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export function getCategoryLabel(id: CategoryId) {
  return categories.find((category) => category.id === id)?.label ?? id;
}

export function getArtworksByCategory(category: CategoryId) {
  if (category === "all") return artworks;
  return artworks.filter((artwork) => artwork.categories.includes(category));
}

export function getArtworkBySlug(slug: string) {
  return artworks.find((artwork) => artwork.slug === slug);
}

export function artworkBelongsToCategory(
  artwork: Artwork,
  category: CategoryId,
) {
  if (category === "all") return true;
  return artwork.categories.includes(category);
}
