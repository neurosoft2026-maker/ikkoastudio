import { getStudioJournalVideos } from "@/lib/studio-journal";
import { publicText, type Locale } from "@/lib/locale";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export default async function StudioJournal({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const copy = publicText[locale].journal;
  const videos = await getStudioJournalVideos();

  return (
    <section id="studio-journal" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
              Studio Journal
            </p>
            <h2 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base">
            {copy.description}
          </p>
        </div>
      </div>

      {videos.length === 0 ? (
        <p className="mx-auto max-w-7xl px-5 text-sm uppercase tracking-[0.18em] text-muted sm:px-8">
          {copy.comingSoon}
        </p>
      ) : (
        <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max gap-4 px-5 sm:gap-6 sm:px-8">
            {videos.map((video, index) => {
              const embedUrl = getYouTubeEmbedUrl(video.youtube_url);
              if (!embedUrl) return null;

              return (
                <article
                  key={video.id}
                  className="w-[62vw] max-w-[280px] shrink-0 sm:w-[240px]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden bg-ink/5">
                    <iframe
                      src={`${embedUrl}?rel=0&modestbranding=1&playsinline=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-title)] text-xl font-semibold text-ink sm:text-2xl">
                      {video.title}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
