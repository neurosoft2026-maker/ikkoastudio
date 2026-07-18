import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  getCategoryByParam,
  getGalleryArtworks,
  getGalleryCategories,
} from "@/lib/gallery";
import {
  localizedTitle,
  publicText,
  translateCategory,
} from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

type PageProps = {
  params: Promise<{ category: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const current = await getCategoryByParam(category);
  if (!current) return { title: "Visual Stories — IkKOA" };
  return {
    title: `${current.name} — Visual Stories | IkKOA`,
    description: `Explore ${current.name.toLowerCase()} portraits by IkKOA Studio.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const current = await getCategoryByParam(category);
  if (!current) notFound();

  const categories = await getGalleryCategories();
  const locale = await getLocale();
  const copy = publicText[locale].stories;
  const works = await getGalleryArtworks(
    current.id === "all" ? null : current.id,
  );

  return (
    <>
      <Header locale={locale} />
      <main className="pt-[8.5rem] sm:pt-[9.5rem] lg:pt-[12.5rem]">
        <section className="border-t border-line py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Link
              href="/#visual-stories"
              className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              ← {copy.back}
            </Link>

            <div className="mt-8 mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
                  {copy.visualStories}
                </p>
                <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
                  {translateCategory(current.name, locale, current.name_en)}
                </h1>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                {works.length} {works.length === 1 ? copy.work : copy.works}{" "}
                {locale === "es" ? "en esta" : "in this"} {copy.collection}.
              </p>
            </div>

            <div className="-mx-5 mb-12 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mb-14 sm:px-0 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
                <Link
                  href="/visual-stories/all"
                  className={`shrink-0 rounded-full border px-5 py-2.5 font-[family-name:var(--font-nav)] text-sm font-medium uppercase tracking-[0.14em] transition-colors ${
                    current.slug === "all"
                      ? "border-ink bg-ink text-white"
                      : "border-ink/25 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white"
                  }`}
                >
                  {copy.all}
                </Link>
                {categories.map((item) => {
                  const isActive = item.slug === current.slug;
                  return (
                    <Link
                      key={item.id}
                      href={`/visual-stories/${item.slug}`}
                      className={`shrink-0 rounded-full border px-5 py-2.5 font-[family-name:var(--font-nav)] text-sm font-medium uppercase tracking-[0.14em] transition-colors ${
                        isActive
                          ? "border-ink bg-ink text-white"
                          : "border-ink/25 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white"
                      }`}
                    >
                      {translateCategory(item.name, locale, item.name_en)}
                    </Link>
                  );
                })}
              </div>
            </div>

            {works.length === 0 ? (
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                {copy.comingSoon}
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {works.map((work, index) => (
                  <Link
                    key={work.id}
                    href={`/visual-stories/${current.slug}/${work.slug}`}
                    className="group block"
                  >
                    <article>
                      <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
                        <Image
                          src={work.image_url}
                          alt={work.artwork_title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                            {String(index + 1).padStart(2, "0")}
                            {work.category_name
                              ? ` · ${translateCategory(work.category_name, locale, work.category_name_en)}`
                              : ""}
                          </p>
                          <h2 className="mt-1 font-[family-name:var(--font-title)] text-2xl font-semibold text-ink">
                            {localizedTitle(
                              work.artwork_title,
                              work.artwork_title_en,
                              locale,
                            )}
                          </h2>
                        </div>
                        {work.year && (
                          <span className="text-sm text-muted">{work.year}</span>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
