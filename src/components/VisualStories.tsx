import Image from "next/image";
import Link from "next/link";
import {
  getGalleryArtworks,
  getGalleryCategories,
} from "@/lib/gallery";
import {
  localizedTitle,
  publicText,
  translateCategory,
  type Locale,
} from "@/lib/locale";

export default async function VisualStories({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const copy = publicText[locale].stories;
  const [categories, artworks] = await Promise.all([
    getGalleryCategories(),
    getGalleryArtworks(),
  ]);

  return (
    <section id="visual-stories" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
              Visual Stories
            </p>
            <h2 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base">
            {copy.description}
          </p>
        </div>

        <div className="-mx-5 mb-12 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div
            className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap"
            aria-label="Art categories"
          >
            <Link
              href="/visual-stories/all"
              className="shrink-0 rounded-full border border-ink/25 bg-white px-5 py-2.5 font-[family-name:var(--font-nav)] text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              {copy.all}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/visual-stories/${category.slug}`}
                className="shrink-0 rounded-full border border-ink/25 bg-white px-5 py-2.5 font-[family-name:var(--font-nav)] text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                {translateCategory(category.name, locale, category.name_en)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {artworks.length === 0 ? (
        <p className="mx-auto max-w-7xl px-5 text-sm uppercase tracking-[0.18em] text-muted sm:px-8">
          {copy.comingSoon}
        </p>
      ) : (
        <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max gap-4 px-5 sm:gap-6 sm:px-8">
            {artworks.map((story, index) => {
              const categoryHref = story.category_id
                ? categories.find((c) => c.id === story.category_id)?.slug ||
                  "all"
                : "all";

              return (
                <Link
                  key={story.id}
                  href={`/visual-stories/${categoryHref}/${story.slug}`}
                  className="group w-[78vw] max-w-[420px] shrink-0 sm:w-[380px]"
                >
                  <article>
                    <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
                      <Image
                        src={story.image_url}
                        alt={story.artwork_title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 78vw, 380px"
                        unoptimized
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                          {String(index + 1).padStart(2, "0")}
                          {story.category_name
                            ? ` · ${translateCategory(story.category_name, locale, story.category_name_en)}`
                            : ""}
                        </p>
                        <h3 className="mt-1 font-[family-name:var(--font-title)] text-2xl font-semibold text-ink">
                          {localizedTitle(
                            story.artwork_title,
                            story.artwork_title_en,
                            locale,
                          )}
                        </h3>
                      </div>
                      {story.year && (
                        <span className="text-sm text-muted">{story.year}</span>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
