"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/dashboard/content-actions";
import { uploadFileToBucket } from "@/lib/storage-client";
import { getYouTubeVideoId } from "@/lib/youtube";
import type {
  LocalizedSiteContent,
  SiteContent,
} from "@/lib/site-content-types";
import type { Locale } from "@/lib/locale";

type FieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  textarea?: boolean;
  rows?: number;
  hint?: string;
};

function Field({
  name,
  label,
  defaultValue,
  textarea,
  rows,
  hint,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={rows || 4}
          defaultValue={defaultValue}
          className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-ink"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-ink"
        />
      )}
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </label>
  );
}

function LanguageFields({
  locale,
  content,
}: {
  locale: Locale;
  content: SiteContent;
}) {
  const prefix = (name: string) => `${locale}_${name}`;
  return (
    <div className="space-y-10">
      <section className="space-y-6 border border-line bg-white p-6 sm:p-8">
        <h3 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-muted">
          Sección principal
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            name={prefix("hero_eyebrow")}
            label="Texto superior"
            defaultValue={content.hero.eyebrow}
          />
          <Field
            name={prefix("hero_title")}
            label="Título"
            defaultValue={content.hero.title}
          />
          <div className="sm:col-span-2">
            <Field
              name={prefix("hero_subtitle")}
              label="Subtítulo"
              defaultValue={content.hero.subtitle}
              textarea
              rows={3}
            />
          </div>
          <Field
            name={prefix("hero_cta_primary")}
            label="Botón principal"
            defaultValue={content.hero.ctaPrimary}
          />
          <Field
            name={prefix("hero_cta_secondary")}
            label="Botón secundario"
            defaultValue={content.hero.ctaSecondary}
          />
        </div>
      </section>

      <section className="space-y-6 border border-line bg-white p-6 sm:p-8">
        <h3 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-muted">
          Expresiones
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            name={prefix("expressions_eyebrow")}
            label="Texto superior"
            defaultValue={content.expressions.eyebrow}
          />
          <Field
            name={prefix("expressions_title")}
            label="Título"
            defaultValue={content.expressions.title}
          />
          <div className="sm:col-span-2">
            <Field
              name={prefix("expressions_quote")}
              label="Cita"
              defaultValue={content.expressions.quote}
              textarea
            />
          </div>
          <Field
            name={prefix("expressions_attribution")}
            label="Firma"
            defaultValue={content.expressions.attribution}
          />
        </div>
      </section>

      <section className="space-y-6 border border-line bg-white p-6 sm:p-8">
        <h3 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-muted">
          Detrás del lienzo
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            name={prefix("behind_eyebrow")}
            label="Texto superior"
            defaultValue={content.behind.eyebrow}
          />
          <Field
            name={prefix("behind_title")}
            label="Título"
            defaultValue={content.behind.title}
          />
          <div className="sm:col-span-2">
            <Field
              name={prefix("behind_body")}
              label="Texto descriptivo"
              defaultValue={content.behind.body}
              textarea
              rows={5}
            />
          </div>
          <Field
            name={prefix("behind_medium")}
            label="Técnica"
            defaultValue={content.behind.medium}
          />
          <Field
            name={prefix("behind_approach")}
            label="Enfoque"
            defaultValue={content.behind.approach}
          />
          <Field
            name={prefix("behind_studio")}
            label="Estudio"
            defaultValue={content.behind.studio}
          />
        </div>
      </section>
    </div>
  );
}

export default function SiteContentForm({
  initial,
}: {
  initial: LocalizedSiteContent;
}) {
  const [language, setLanguage] = useState<Locale>("en");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setStatus(null);
    try {
      const videoUrl = String(formData.get("hero_video_url") || "").trim();
      if (!getYouTubeVideoId(videoUrl)) {
        setStatus(
          "La URL del video no es válida. Usa un enlace de YouTube como https://youtu.be/VIDEO_ID.",
        );
        return;
      }

      // La imagen se sube directamente a Supabase Storage para no enviarla
      // por la función de Vercel, cuyo cuerpo está limitado a 4.5 MB.
      const imageFile = formData.get("behind_image_file") as File | null;
      if (imageFile && imageFile.size > 0) {
        setStatus("Subiendo imagen…");
        const upload = await uploadFileToBucket(
          "site-media",
          imageFile,
          "behind-image",
        );
        if (upload.error || !upload.url) {
          setStatus(`No se pudo subir la imagen: ${upload.error}`);
          return;
        }
        formData.set("behind_image_url", upload.url);
      }
      formData.delete("behind_image_file");

      setStatus("Guardando…");
      const result = await updateSiteContent(formData);
      setStatus(
        result.error
          ? `No se pudo guardar: ${result.error}`
          : "Contenido guardado. La página de inicio fue actualizada.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={action} className="space-y-10">
      <section className="space-y-6 border border-line bg-white p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-muted">
          Recursos compartidos
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              name="hero_video_url"
              label="URL de YouTube para el video de fondo"
              defaultValue={initial.en.hero.videoUrl}
              hint="Pega una URL de YouTube. El video se mostrará sin sonido, sin controles y en reproducción automática."
            />
          </div>
          <Field
            name="behind_image_url"
            label="URL de la imagen del estudio"
            defaultValue={initial.en.behind.imageUrl}
          />
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Subir nueva imagen
            </span>
            <input
              type="file"
              name="behind_image_file"
              accept="image/*"
              className="w-full text-sm"
            />
          </label>
        </div>
      </section>

      <div className="flex items-center gap-2 border-b border-line pb-4">
        <span className="mr-2 text-sm text-muted">Editar idioma:</span>
        {(["en", "es"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            className={`border px-5 py-2 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] ${
              language === item
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink"
            }`}
          >
            {item === "en" ? "Inglés" : "Español"}
          </button>
        ))}
      </div>

      <div className={language === "en" ? "block" : "hidden"}>
        <LanguageFields locale="en" content={initial.en} />
      </div>
      <div className={language === "es" ? "block" : "hidden"}>
        <LanguageFields locale="es" content={initial.es} />
      </div>

      {status && <p className="text-sm text-ink">{status}</p>}
      <button
        type="submit"
        disabled={pending}
        className="h-12 bg-ink px-8 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-white disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar contenido"}
      </button>
    </form>
  );
}
