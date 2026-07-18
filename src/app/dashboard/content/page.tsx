import SiteContentForm from "@/components/dashboard/SiteContentForm";
import { getSiteContent } from "@/lib/site-content";

export default async function SiteContentPage() {
  const content = await getSiteContent();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-title)] text-4xl font-semibold text-ink">
        Contenido del sitio
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Edita en inglés y español los textos y recursos de las secciones
        principal, Expresiones y Detrás del lienzo.
      </p>
      <div className="mt-10">
        <SiteContentForm initial={content} />
      </div>
    </div>
  );
}
