import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  categories,
  getArtworksByCategory,
  getCategoryLabel,
  isCategoryId,
} from "@/lib/artworks";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  if (!isCategoryId(category)) return { title: "Visual Stories — IkKOA" };
  return {
    title: `${getCategoryLabel(category)} — Visual Stories | IkKOA`,
    description: `Explore ${getCategoryLabel(category).toLowerCase()} portraits by IkKOA Studio.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isCategoryId(category)) notFound();

  const works = getArtworksByCategory(category);
  const label = getCategoryLabel(category);

  return (
    <>
      <Header />
      <main className="pt-[8.5rem] sm:pt-[9.5rem] lg:pt-[12.5rem]">
        <section className="border-t border-line py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Link
              href="/#visual-stories"
              className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              ← Back to Visual Stories
            </Link>

            <div className="mt-8 mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
                  Visual Stories
                </p>
                <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
                  {label}
                </h1>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                {works.length} {works.length === 1 ? "work" : "works"} in this
                collection.
              </p>
            </div>

            <div className="-mx-5 mb-12 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mb-14 sm:px-0 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
                {categories.map((item) => {
                  const isActive = item.id === category;
                  return (
                    <Link
                      key={item.id}
                      href={`/visual-stories/${item.id}`}
                      className={`shrink-0 px-4 py-2.5 font-[family-name:var(--font-nav)] text-sm uppercase tracking-wide transition-colors ${
                        isActive
                          ? "bg-ink text-white"
                          : "text-muted hover:bg-ink hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {works.length === 0 ? (
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                Próximamente
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {works.map((work, index) => (
                  <Link
                    key={work.slug}
                    href={`/visual-stories/${category}/${work.slug}`}
                    className="group block"
                  >
                    <article>
                      <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
                        <Image
                          src={work.image}
                          alt={work.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                            {String(index + 1).padStart(2, "0")} ·{" "}
                            {work.categories
                              .map((id) => getCategoryLabel(id))
                              .join(" · ")}
                          </p>
                          <h2 className="mt-1 font-[family-name:var(--font-title)] text-2xl font-semibold text-ink">
                            {work.title}
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
      <Footer />
    </>
  );
}
