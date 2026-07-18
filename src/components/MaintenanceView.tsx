export default function MaintenanceView() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f7f7f5] px-6">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="mx-auto mb-10 flex h-40 w-40 items-center justify-center">
          <svg
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full text-ink"
            aria-hidden
          >
            {/* Soft circle backdrop */}
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
            {/* Canvas */}
            <rect
              x="48"
              y="42"
              width="64"
              height="76"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            {/* Gentle brush strokes */}
            <path
              d="M62 68c10 4 18-2 28 2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.55"
            />
            <path
              d="M60 84c14 6 22-1 34 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.4"
            />
            {/* Heart mark — empathy */}
            <path
              d="M80 108c-1.2-1-8-6.2-8-11.2 0-3 2.2-5 5-5 1.6 0 2.6.7 3 1.4.4-.7 1.4-1.4 3-1.4 2.8 0 5 2 5 5 0 5-6.8 10.2-8 11.2z"
              fill="currentColor"
              opacity="0.9"
            />
            {/* Small sparkles */}
            <circle cx="118" cy="48" r="1.5" fill="currentColor" opacity="0.35" />
            <circle cx="42" cy="56" r="1.2" fill="currentColor" opacity="0.3" />
          </svg>
        </div>

        <p className="mb-4 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.28em] text-muted">
          IkKOA Studio
        </p>
        <h1 className="font-[family-name:var(--font-title)] text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          We&apos;re updating the site
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
          Thanks for your understanding while we refresh the experience. We&apos;ll
          be back soon with something special.
        </p>
      </div>
    </main>
  );
}
