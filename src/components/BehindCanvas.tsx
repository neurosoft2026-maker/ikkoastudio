import Image from "next/image";
import { publicText, type Locale } from "@/lib/locale";
import type { SiteContent } from "@/lib/site-content-types";

type Props = {
  content: SiteContent["behind"];
  locale?: Locale;
};

export default function BehindCanvas({ content, locale = "en" }: Props) {
  const labels = publicText[locale].behindLabels;
  const details = [
    { label: labels.medium, value: content.medium },
    { label: labels.approach, value: content.approach },
    { label: labels.studio, value: content.studio },
  ];

  return (
    <section
      id="behind-the-canvas"
      className="border-t border-white/10 bg-ink py-24 text-white sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden bg-white/5 sm:aspect-[5/6]">
          <Image
            src={content.imageUrl}
            alt="Artist studio with brushes and unfinished canvas"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-white/15"
          />
        </div>

        <div className="lg:py-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
            {content.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-8 max-w-md whitespace-pre-line text-base leading-relaxed text-white/70">
            {content.body}
          </p>
          <ul className="mt-12 space-y-6 border-t border-white/20 pt-10">
            {details.map((item) => (
              <li
                key={item.label}
                className="grid grid-cols-[7rem_1fr] gap-4 text-sm sm:grid-cols-[9rem_1fr]"
              >
                <span className="uppercase tracking-[0.16em] text-white/50">
                  {item.label}
                </span>
                <span className="text-white">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
