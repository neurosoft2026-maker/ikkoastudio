export type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    videoUrl: string;
  };
  expressions: {
    eyebrow: string;
    title: string;
    quote: string;
    attribution: string;
  };
  behind: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    medium: string;
    approach: string;
    studio: string;
  };
};

export type LocalizedSiteContent = {
  en: SiteContent;
  es: SiteContent;
};

export const DEFAULT_EN_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Painter & visual artist",
    title: "Hi, I'm Gustavo Moreno.",
    subtitle:
      "I transform iconic personalities into expressive works of art.",
    ctaPrimary: "Enter the work",
    ctaSecondary: "Say Hello",
    videoUrl: "/videos/painting.mp4",
  },
  expressions: {
    eyebrow: "Expressions",
    title: "Paint as language",
    quote:
      "Every brushstroke is a sentence. Every canvas, a conversation between what we feel and what we cannot say.",
    attribution: "— ikkoa",
  },
  behind: {
    eyebrow: "Behind the Canvas",
    title: "The studio ritual",
    body: "Morning light. Quiet music. Layers of pigment built slowly until the surface begins to breathe. The work is less about finishing a painting and more about listening to what the canvas asks for.",
    imageUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=80",
    medium: "Oil, acrylic & ink on canvas",
    approach: "Gesture, silence, monochrome depth",
    studio: "Open by appointment",
  },
};

export const DEFAULT_ES_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Pintor y artista visual",
    title: "Hola, soy Gustavo Moreno.",
    subtitle:
      "Transformo personalidades icónicas en obras de arte expresivas.",
    ctaPrimary: "Conoce mi obra",
    ctaSecondary: "Hablemos",
    videoUrl: "/videos/painting.mp4",
  },
  expressions: {
    eyebrow: "Expresiones",
    title: "La pintura como lenguaje",
    quote:
      "Cada pincelada es una frase. Cada lienzo, una conversación entre lo que sentimos y lo que no podemos decir.",
    attribution: "— ikkoa",
  },
  behind: {
    eyebrow: "Detrás del lienzo",
    title: "El ritual del estudio",
    body: "Luz de la mañana. Música tranquila. Capas de pigmento construidas lentamente hasta que la superficie comienza a respirar. La obra trata menos de terminar una pintura y más de escuchar lo que el lienzo pide.",
    imageUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=80",
    medium: "Óleo, acrílico y tinta sobre lienzo",
    approach: "Gesto, silencio y profundidad monocromática",
    studio: "Abierto con cita previa",
  },
};

export const DEFAULT_SITE_CONTENT: LocalizedSiteContent = {
  en: DEFAULT_EN_SITE_CONTENT,
  es: DEFAULT_ES_SITE_CONTENT,
};

export function mergeSiteContent(
  partial:
    | Partial<LocalizedSiteContent>
    | Partial<SiteContent>
    | null
    | undefined,
): LocalizedSiteContent {
  const isLocalized = Boolean(
    partial &&
      typeof partial === "object" &&
      ("en" in partial || "es" in partial),
  );
  const enPartial = isLocalized
    ? (partial as Partial<LocalizedSiteContent>).en
    : (partial as Partial<SiteContent> | null | undefined);
  const esPartial = isLocalized
    ? (partial as Partial<LocalizedSiteContent>).es
    : undefined;

  return {
    en: {
      hero: { ...DEFAULT_EN_SITE_CONTENT.hero, ...enPartial?.hero },
      expressions: {
        ...DEFAULT_EN_SITE_CONTENT.expressions,
        ...enPartial?.expressions,
      },
      behind: { ...DEFAULT_EN_SITE_CONTENT.behind, ...enPartial?.behind },
    },
    es: {
      hero: { ...DEFAULT_ES_SITE_CONTENT.hero, ...esPartial?.hero },
      expressions: {
        ...DEFAULT_ES_SITE_CONTENT.expressions,
        ...esPartial?.expressions,
      },
      behind: { ...DEFAULT_ES_SITE_CONTENT.behind, ...esPartial?.behind },
    },
  };
}
