import type { SiteContent } from "@/lib/site-content-types";

type Props = {
  content: SiteContent["hero"];
};

export default function Hero({ content }: Props) {
  return (
    <section
      id="home"
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0 animate-reveal">
        <video
          key={content.videoUrl}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src={content.videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/45 via-transparent to-transparent" />
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 sm:pb-24 sm:pt-48 lg:pt-52">
        <p className="animate-fade-up delay-1 mb-5 inline-block bg-ink px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-white">
          {content.eyebrow}
        </p>

        <h1 className="animate-fade-up delay-2 max-w-3xl font-[family-name:var(--font-title)] font-semibold text-[clamp(2.75rem,8vw,5.5rem)] leading-[1] tracking-tight text-ink">
          {content.title}
        </h1>

        <div className="animate-draw delay-3 mt-8 h-px w-24 bg-ink" />

        <p className="animate-fade-up delay-3 mt-8 max-w-md text-base leading-relaxed text-ink/75 sm:text-lg">
          {content.subtitle}
        </p>

        <div className="animate-fade-up delay-4 mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#visual-stories"
            className="inline-flex h-12 items-center bg-ink px-7 text-[11px] font-medium uppercase tracking-[0.2em] text-surface transition-opacity hover:opacity-80"
          >
            {content.ctaPrimary}
          </a>
          <a
            href="#say-hello"
            className="inline-flex h-12 items-center border border-ink px-7 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-surface"
          >
            {content.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
