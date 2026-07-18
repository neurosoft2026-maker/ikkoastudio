import Image from "next/image";

export default function BehindCanvas() {
  return (
    <section
      id="behind-the-canvas"
      className="border-t border-line py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink/5 sm:aspect-[5/6]">
          <Image
            src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=80"
            alt="Artist studio with brushes and unfinished canvas"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="lg:py-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Behind the Canvas
          </p>
          <h2 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl">
            The studio ritual
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
            Morning light. Quiet music. Layers of pigment built slowly until
            the surface begins to breathe. The work is less about finishing a
            painting and more about listening to what the canvas asks for.
          </p>
          <ul className="mt-12 space-y-6 border-t border-line pt-10">
            {[
              { label: "Medium", value: "Oil, acrylic & ink on canvas" },
              { label: "Approach", value: "Gesture, silence, monochrome depth" },
              { label: "Studio", value: "Open by appointment" },
            ].map((item) => (
              <li
                key={item.label}
                className="grid grid-cols-[7rem_1fr] gap-4 text-sm sm:grid-cols-[9rem_1fr]"
              >
                <span className="uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </span>
                <span className="text-ink">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
