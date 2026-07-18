import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  getArtworkBySlug,
  getCategoryByParam,
  getGalleryCategories,
} from "@/lib/gallery";
import {
  localizedTitle,
  publicText,
  translateCategory,
} from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import ArtworkPriceCard from "@/components/ArtworkPriceCard";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return { title: "Artwork — IkKOA" };
  return {
    title: `${artwork.artwork_title} — Visual Stories | IkKOA`,
    description:
      artwork.artwork_statement ||
      artwork.details ||
      "Artwork by IkKOA Studio",
  };
}

const FALLBACK_USD_COP_RATE = 4100;

async function getUsdToCopRate(): Promise<number> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return FALLBACK_USD_COP_RATE;
    const data = await response.json();
    const rate = data?.rates?.COP;
    return typeof rate === "number" && rate > 0
      ? rate
      : FALLBACK_USD_COP_RATE;
  } catch {
    return FALLBACK_USD_COP_RATE;
  }
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="flex flex-col border border-line bg-white p-6 sm:p-8">
      <h3 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.22em] text-muted">
        {title}
      </h3>
      <div className="mt-3 h-px w-8 bg-ink/30" />
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/80">
        {text}
      </p>
    </article>
  );
}

function SpecCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <article className="border border-line bg-white p-6 sm:p-8">
      <h3 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.22em] text-muted">
        {title}
      </h3>
      <div className="mt-3 h-px w-8 bg-ink/30" />
      <dl className="mt-4 divide-y divide-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[8rem_1fr] gap-3 py-3 text-sm first:pt-0 last:pb-0"
          >
            <dt className="text-[11px] uppercase leading-5 tracking-[0.14em] text-muted">
              {row.label}
            </dt>
            <dd className="text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const current = await getCategoryByParam(category);
  const artwork = await getArtworkBySlug(slug);

  if (!current || !artwork) notFound();

  if (
    current.id !== "all" &&
    artwork.category_id &&
    artwork.category_id !== current.id
  ) {
    notFound();
  }

  const categories = await getGalleryCategories();
  const locale = await getLocale();
  const copy = publicText[locale].detail;

  const specRows = [
    { label: "Artist", value: artwork.artist },
    { label: "Year", value: artwork.year },
    { label: "Series", value: artwork.series },
    { label: "Medium", value: artwork.medium },
    { label: "Dimensions", value: artwork.dimensions },
    { label: "Edition", value: artwork.edition },
    { label: "Location", value: artwork.location },
    { label: "Artwork Code", value: artwork.artwork_code },
  ].filter((row): row is { label: string; value: string } =>
    Boolean(row.value),
  );

  const provenanceRows = [
    { label: "Signature", value: artwork.signature },
    { label: "Certificate", value: artwork.certificate_of_authenticity },
    { label: "Framing", value: artwork.framing },
    { label: "Condition", value: artwork.condition },
  ].filter((row): row is { label: string; value: string } =>
    Boolean(row.value),
  );

  const storyCards = [
    { title: "Artist's Reflection", text: artwork.artists_reflection },
    { title: "Inspiration", text: artwork.inspiration },
    { title: "Concept", text: artwork.concept },
    { title: "Creative Process", text: artwork.creative_process },
    { title: "Color Palette", text: artwork.color_palette },
    { title: "Details", text: artwork.details },
  ].filter((card): card is { title: string; text: string } =>
    Boolean(card.text),
  );

  const collectorCards = [
    { title: "Shipping Information", text: artwork.shipping_information },
    { title: "Collection Notes", text: artwork.collection_notes },
    { title: "Collector Information", text: artwork.collector_information },
    { title: "Inquiry", text: artwork.inquiry },
  ].filter((card): card is { title: string; text: string } =>
    Boolean(card.text),
  );

  const recognitionCards = [
    { title: "Exhibition History", text: artwork.exhibition_history },
    { title: "Publications", text: artwork.publications },
    { title: "Awards & Recognition", text: artwork.awards_recognition },
  ].filter((card): card is { title: string; text: string } =>
    Boolean(card.text),
  );

  const usdToCop = await getUsdToCopRate();

  const keywords = artwork.keywords || [];
  const youtubeEmbed = getYouTubeEmbedUrl(artwork.youtube_url);

  return (
    <>
      <Header locale={locale} />
      <main className="pt-[8.5rem] sm:pt-[9.5rem] lg:pt-[12.5rem]">
        <section className="border-t border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Link
              href={`/visual-stories/${current.slug}`}
              className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              ← {copy.back} {translateCategory(current.name, locale, current.name_en)}
            </Link>

            <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
              {/* Image */}
              <div className="space-y-6 lg:sticky lg:top-40">
                <div className="relative aspect-square overflow-hidden bg-ink/5 sm:aspect-[4/5]">
                  <Image
                    src={artwork.image_url}
                    alt={artwork.artwork_title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized
                  />
                </div>

                {youtubeEmbed && (
                  <div className="border border-line bg-white">
                    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
                      <p className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.22em] text-muted">
                        {copy.watch}
                      </p>
                      <a
                        href={artwork.youtube_url || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-[family-name:var(--font-nav)] text-[10px] uppercase tracking-[0.16em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
                      >
                        {copy.youtube}
                      </a>
                    </div>
                    <div className="relative aspect-video overflow-hidden bg-ink">
                      <iframe
                        src={youtubeEmbed}
                        title={`${artwork.artwork_title} — video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Summary column */}
              <div className="space-y-8">
                <div>
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
                    {artwork.category_name
                      ? translateCategory(
                          artwork.category_name,
                          locale,
                          artwork.category_name_en,
                        )
                      : translateCategory(current.name, locale, current.name_en)}
                  </p>
                  <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl lg:text-6xl">
                    {localizedTitle(
                      artwork.artwork_title,
                      artwork.artwork_title_en,
                      locale,
                    )}
                  </h1>
                  {(artwork.artist || artwork.year) && (
                    <p className="mt-4 text-sm uppercase tracking-[0.16em] text-muted">
                      {[artwork.artist, artwork.year]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>

                {(artwork.artwork_statement || artwork.details) && (
                  <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                    {artwork.artwork_statement || artwork.details}
                  </p>
                )}

                {/* Price card */}
                <ArtworkPriceCard
                  locale={locale}
                  artworkTitle={artwork.artwork_title_en || artwork.artwork_title}
                  artworkCode={artwork.artwork_code}
                  availability={artwork.availability}
                  originalPrice={artwork.price}
                  printAvailable={Boolean(artwork.print_available)}
                  printPrice={artwork.print_price ?? null}
                  printEditionSize={artwork.print_edition_size ?? null}
                  printSoldCount={artwork.print_sold_count ?? 0}
                  printMedium={artwork.print_medium ?? null}
                  printDimensions={artwork.print_dimensions ?? null}
                  usdToCop={usdToCop}
                />

                {/* Key specs */}
                {specRows.length > 0 && (
                  <SpecCard title={copy.specifications} rows={specRows} />
                )}

                {provenanceRows.length > 0 && (
                  <SpecCard
                    title={copy.provenance}
                    rows={provenanceRows}
                  />
                )}
              </div>
            </div>

            {/* Story cards */}
            {storyCards.length > 0 && (
              <div className="mt-20 border-t border-line pt-14">
                <h2 className="font-[family-name:var(--font-title)] text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {copy.behind}
                </h2>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {storyCards.map((card) => (
                    <InfoCard
                      key={card.title}
                      title={card.title}
                      text={card.text}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Collector cards */}
            {collectorCards.length > 0 && (
              <div className="mt-16">
                <h2 className="font-[family-name:var(--font-title)] text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {copy.collectors}
                </h2>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {collectorCards.map((card) => (
                    <InfoCard
                      key={card.title}
                      title={card.title}
                      text={card.text}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recognition cards */}
            {recognitionCards.length > 0 && (
              <div className="mt-16">
                <h2 className="font-[family-name:var(--font-title)] text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {copy.recognition}
                </h2>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {recognitionCards.map((card) => (
                    <InfoCard
                      key={card.title}
                      title={card.title}
                      text={card.text}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="mt-16 border-t border-line pt-10">
                <p className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.22em] text-muted">
                  {copy.keywords}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="border border-line px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink/70"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category navigation */}
            <div className="mt-16 border-t border-line pt-10">
              <p className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.22em] text-muted">
                {copy.explore}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/visual-stories/all"
                  className="rounded-full border border-ink/25 bg-white px-5 py-2.5 font-[family-name:var(--font-nav)] text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white sm:text-sm"
                >
                  {publicText[locale].stories.all}
                </Link>
                {categories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/visual-stories/${item.slug}`}
                    className="rounded-full border border-ink/25 bg-white px-5 py-2.5 font-[family-name:var(--font-nav)] text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white sm:text-sm"
                  >
                    {translateCategory(item.name, locale, item.name_en)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
