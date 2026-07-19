export type Locale = "en" | "es";

export const publicText = {
  en: {
    nav: {
      home: "Home",
      journal: "Studio Journal",
      stories: "Visual Stories",
      expressions: "Expressions",
      behind: "Behind the Canvas",
      hello: "Say Hello",
      login: "Login",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    journal: {
      title: "Studio notes",
      description:
        "Vertical glimpses from the studio — process, texture, and the quiet rhythm of making.",
      comingSoon: "Coming soon",
    },
    stories: {
      title: "Celebrities",
      description:
        "Portraits of musicians, painters, actors, and emblematic figures — told through pigment and form.",
      all: "All",
      comingSoon: "Coming soon",
      visualStories: "Visual Stories",
      back: "Back to Visual Stories",
      collection: "collection",
      work: "work",
      works: "works",
    },
    behindLabels: {
      medium: "Medium",
      approach: "Approach",
      studio: "Studio",
    },
    contact: {
      eyebrow: "Say Hello",
      title: "Let's talk",
      online: "Online · replies directly",
      question: "Hi. How would you like to get in touch?",
      social: "Social media",
      chooseAnother: "Choose another option",
      emailMessage:
        "Perfect. Write whenever you like — I read every message with care.",
      emailAction: "Open email",
      whatsappMessage:
        "Great. Let's talk on WhatsApp — reply whenever it works for you.",
      whatsappAction: "Open WhatsApp",
      socialMessage:
        "Love that. Follow or message me on Instagram — that's where we share the process.",
      socialAction: "Open Instagram",
    },
    footer: "All rights reserved",
    detail: {
      back: "Back to",
      watch: "Watch the artwork",
      youtube: "Open on YouTube",
      price: "Price",
      onRequest: "On request",
      inquire: "Inquire about this work",
      inquireOriginal: "WhatsApp — Original",
      inquirePrint: "WhatsApp — Print edition",
      inquireWhatsApp: "WhatsApp — Inquire",
      chooseFormat: "Choose format",
      original: "Original",
      printEdition: "Print edition",
      nextEdition: "Next available",
      remaining: "remaining",
      soldOut: "Sold out",
      specifications: "Artwork Specifications",
      provenance: "Provenance & Condition",
      behind: "Behind the artwork",
      collectors: "For collectors",
      recognition: "Recognition",
      keywords: "Keywords",
      explore: "Explore more",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      journal: "Studio Journal",
      stories: "Historias Visuales",
      expressions: "Expresiones",
      behind: "Detrás del Lienzo",
      hello: "Hablemos",
      login: "Ingresar",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    journal: {
      title: "Notas del estudio",
      description:
        "Instantáneas verticales del estudio: proceso, textura y el ritmo callado de crear.",
      comingSoon: "Próximamente",
    },
    stories: {
      title: "Celebridades",
      description:
        "Retratos de músicos, pintores, actores y figuras emblemáticas, narrados a través del pigmento y la forma.",
      all: "Todos",
      comingSoon: "Próximamente",
      visualStories: "Historias Visuales",
      back: "Volver a Historias Visuales",
      collection: "colección",
      work: "obra",
      works: "obras",
    },
    behindLabels: {
      medium: "Técnica",
      approach: "Enfoque",
      studio: "Estudio",
    },
    contact: {
      eyebrow: "Hablemos",
      title: "Conversemos",
      online: "En línea · responde directamente",
      question: "Hola. ¿Cómo te gustaría comunicarte conmigo?",
      social: "Redes sociales",
      chooseAnother: "Elegir otra opción",
      emailMessage:
        "Perfecto. Escríbeme cuando quieras; leo cada mensaje con atención.",
      emailAction: "Abrir correo",
      whatsappMessage:
        "Excelente. Hablemos por WhatsApp; responde cuando te resulte cómodo.",
      whatsappAction: "Abrir WhatsApp",
      socialMessage:
        "Sígueme o escríbeme por Instagram; allí comparto el proceso creativo.",
      socialAction: "Abrir Instagram",
    },
    footer: "Todos los derechos reservados",
    detail: {
      back: "Volver a",
      watch: "Ver la obra",
      youtube: "Abrir en YouTube",
      price: "Precio",
      onRequest: "Consultar precio",
      inquire: "Consultar sobre esta obra",
      inquireOriginal: "WhatsApp — Original",
      inquirePrint: "WhatsApp — Impresión",
      inquireWhatsApp: "WhatsApp — Consultar",
      chooseFormat: "Elige el formato",
      original: "Original",
      printEdition: "Edición impresa",
      nextEdition: "Siguiente disponible",
      remaining: "disponibles",
      soldOut: "Agotada",
      specifications: "Especificaciones de la obra",
      provenance: "Procedencia y estado",
      behind: "Detrás de la obra",
      collectors: "Para coleccionistas",
      recognition: "Reconocimientos",
      keywords: "Palabras clave",
      explore: "Explorar más",
    },
  },
} as const;

const categoryTranslationsEs: Record<string, string> = {
  all: "Todos",
  celebrities: "Celebridades",
  musicians: "Músicos",
  painters: "Pintores",
  actors: "Actores",
  birds: "Pájaros",
  pajaros: "Pájaros",
};

const categoryTranslationsEn: Record<string, string> = {
  todos: "All",
  celebridades: "Celebrities",
  musicos: "Musicians",
  músicos: "Musicians",
  pintores: "Painters",
  actores: "Actors",
  pajaros: "Birds",
  pájaros: "Birds",
};

export function translateCategory(
  name: string,
  locale: Locale,
  nameEn?: string | null,
) {
  const key = name.toLowerCase();
  if (locale === "en") {
    return nameEn || categoryTranslationsEn[key] || name;
  }
  return categoryTranslationsEs[key] || name;
}

export function localizedTitle(
  title: string,
  titleEn: string | null | undefined,
  locale: Locale,
) {
  if (locale === "en") return titleEn || title;
  return title;
}
