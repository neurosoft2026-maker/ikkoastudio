export default function Expressions() {
  return (
    <section
      id="expressions"
      className="grain relative overflow-hidden border-t border-line bg-ink text-surface"
    >
      <div className="relative z-[2] mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:items-center">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-surface/50">
            Expressions
          </p>
          <h2 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Paint as language
          </h2>
        </div>

        <blockquote className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-10 font-[family-name:var(--font-display)] text-[8rem] leading-none text-surface/10 sm:-top-14 sm:text-[10rem]"
          >
            “
          </span>
          <p className="relative font-[family-name:var(--font-display)] text-2xl leading-snug sm:text-4xl sm:leading-snug">
            Every brushstroke is a sentence. Every canvas, a conversation
            between what we feel and what we cannot say.
          </p>
          <footer className="mt-10 border-t border-surface/20 pt-6 text-[11px] uppercase tracking-[0.22em] text-surface/55">
            — ikkoa
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
