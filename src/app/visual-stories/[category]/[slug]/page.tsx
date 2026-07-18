import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  artworks,
  artworkBelongsToCategory,
  categories,
  getArtworkBySlug,
  getCategoryLabel,
  isCategoryId,
} from "@/lib/artworks";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];

  for (const artwork of artworks) {
    params.push({ category: "all", slug: artwork.slug });
    for (const category of artwork.categories) {
      params.push({ category, slug: artwork.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);
  if (!artwork) return { title: "Artwork — IkKOA" };
  return {
    title: `${artwork.title} — Visual Stories | IkKOA`,
    description: artwork.description,
  };
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { category, slug } = await params;

  if (!isCategoryId(category)) notFound();

  const artwork = getArtworkBySlug(slug);
  if (!artwork || !artworkBelongsToCategory(artwork, category)) notFound();

  const categoryLabel = getCategoryLabel(category);

  return (
    <>
      <Header />
      <main className="pt-[8.5rem] sm:pt-[9.5rem] lg:pt-[12.5rem]">
        <section className="border-t border-line py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Link
              href={`/visual-stories/${category}`}
              className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              ← Back to {categoryLabel}
            </Link>

            <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
              <div className="relative aspect-square overflow-hidden bg-ink/5 sm:aspect-[4/5]">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="lg:py-6">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
                  {artwork.categories
                    .map((id) => getCategoryLabel(id))
                    .join(" · ")}
                </p>
                <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
                  {artwork.title}
                </h1>

                <div className="mt-8 h-px w-16 bg-ink" />

                <p className="mt-8 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                  {artwork.description}
                </p>

                <dl className="mt-12 space-y-5 border-t border-line pt-10">
                  {artwork.year && (
                    <div className="grid grid-cols-[7rem_1fr] gap-4 text-sm sm:grid-cols-[9rem_1fr]">
                      <dt className="uppercase tracking-[0.16em] text-muted">
                        Year
                      </dt>
                      <dd className="text-ink">{artwork.year}</dd>
                    </div>
                  )}
                  {artwork.medium && (
                    <div className="grid grid-cols-[7rem_1fr] gap-4 text-sm sm:grid-cols-[9rem_1fr]">
                      <dt className="uppercase tracking-[0.16em] text-muted">
                        Medium
                      </dt>
                      <dd className="text-ink">{artwork.medium}</dd>
                    </div>
                  )}
                  {artwork.dimensions && (
                    <div className="grid grid-cols-[7rem_1fr] gap-4 text-sm sm:grid-cols-[9rem_1fr]">
                      <dt className="uppercase tracking-[0.16em] text-muted">
                        Size
                      </dt>
                      <dd className="text-ink">{artwork.dimensions}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-12 flex flex-wrap gap-3">
                  {categories
                    .filter((item) =>
                      item.id === "all"
                        ? true
                        : artwork.categories.includes(item.id),
                    )
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={`/visual-stories/${item.id}`}
                        className="px-4 py-2.5 font-[family-name:var(--font-nav)] text-xs uppercase tracking-wide text-muted transition-colors hover:bg-ink hover:text-white sm:text-sm"
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>

                <a
                  href="/#say-hello"
                  className="mt-10 inline-flex h-12 items-center bg-ink px-7 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
                >
                  Inquire about this work
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
