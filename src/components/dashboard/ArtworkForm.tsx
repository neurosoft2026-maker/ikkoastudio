"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { slugify, type Artwork, type Category } from "@/lib/types";
import { createArtwork, updateArtwork } from "@/app/dashboard/actions";

type Props = {
  categories: Category[];
  artwork?: Artwork;
};

const CURRENT_YEAR = String(new Date().getFullYear());

const OPTIONS = {
  year: [CURRENT_YEAR, "2025", "2024", "2023", "2022", "2021"],
  series: [
    "Icons",
    "Visual Stories",
    "Rock Legends",
    "Jazz Portraits",
    "Cultural Icons",
    "Studio Studies",
  ],
  medium: [
    "Oil on canvas",
    "Acrylic on canvas",
    "Mixed media on canvas",
    "Ink on canvas",
    "Oil & acrylic on canvas",
    "Digital print on canvas",
  ],
  dimensions: [
    "30 × 30 cm",
    "40 × 40 cm",
    "50 × 50 cm",
    "60 × 60 cm",
    "80 × 80 cm",
    "100 × 100 cm",
    "120 × 120 cm",
    "100 × 140 cm",
  ],
  edition: [
    "Original 1/1",
    "Limited edition 1/10",
    "Limited edition 1/25",
    "Limited edition 1/50",
    "Open edition",
    "Artist proof (AP)",
  ],
  availability: [
    "Available",
    "Reserved",
    "Sold",
    "On exhibition",
    "Not for sale",
    "Commission only",
  ],
  color_palette: [
    "Black & white",
    "Warm tones",
    "Cool tones",
    "Vibrant / multicolor",
    "Earth tones",
    "Monochrome with accent",
  ],
  signature: [
    "Signed front",
    "Signed back",
    "Signed front and back",
    "Unsigned",
  ],
  certificate_of_authenticity: [
    "Included — signed by the artist",
    "Included — digital certificate",
    "Available upon request",
    "Not included",
  ],
  framing: [
    "Unframed",
    "Stretched canvas",
    "Black frame",
    "White frame",
    "Natural wood frame",
    "Shadow box",
  ],
  condition: [
    "Excellent",
    "Very good",
    "Good",
    "New / studio fresh",
    "Restored",
  ],
  shipping_information: [
    "Ships from Miami, FL — worldwide",
    "Local pickup in Miami",
    "Ships within the United States",
    "Shipping arranged after purchase",
    "Buyer arranges shipping",
  ],
  location: ["Miami", "Miami Beach", "Wynwood, Miami", "Studio — Miami, FL"],
};

const OPTION_LABELS: Record<string, string> = {
  Icons: "Íconos",
  "Visual Stories": "Historias visuales",
  "Rock Legends": "Leyendas del rock",
  "Jazz Portraits": "Retratos de jazz",
  "Cultural Icons": "Íconos culturales",
  "Studio Studies": "Estudios de taller",
  "Oil on canvas": "Óleo sobre lienzo",
  "Acrylic on canvas": "Acrílico sobre lienzo",
  "Mixed media on canvas": "Técnica mixta sobre lienzo",
  "Ink on canvas": "Tinta sobre lienzo",
  "Oil & acrylic on canvas": "Óleo y acrílico sobre lienzo",
  "Digital print on canvas": "Impresión digital sobre lienzo",
  "Limited edition 1/10": "Edición limitada 1/10",
  "Limited edition 1/25": "Edición limitada 1/25",
  "Limited edition 1/50": "Edición limitada 1/50",
  "Open edition": "Edición abierta",
  "Artist proof (AP)": "Prueba de artista (AP)",
  Available: "Disponible",
  Reserved: "Reservada",
  Sold: "Vendida",
  "On exhibition": "En exposición",
  "Not for sale": "No está a la venta",
  "Commission only": "Solo por encargo",
  "Black & white": "Blanco y negro",
  "Warm tones": "Tonos cálidos",
  "Cool tones": "Tonos fríos",
  "Vibrant / multicolor": "Vibrante / multicolor",
  "Earth tones": "Tonos tierra",
  "Monochrome with accent": "Monocromático con acento",
  "Signed front": "Firmada al frente",
  "Signed back": "Firmada al reverso",
  "Signed front and back": "Firmada al frente y al reverso",
  Unsigned: "Sin firma",
  "Included — signed by the artist": "Incluido — firmado por el artista",
  "Included — digital certificate": "Incluido — certificado digital",
  "Available upon request": "Disponible bajo solicitud",
  "Not included": "No incluido",
  Unframed: "Sin marco",
  "Stretched canvas": "Lienzo tensado",
  "Black frame": "Marco negro",
  "White frame": "Marco blanco",
  "Natural wood frame": "Marco de madera natural",
  "Shadow box": "Marco tipo caja",
  Excellent: "Excelente",
  "Very good": "Muy bueno",
  Good: "Bueno",
  "New / studio fresh": "Nueva / recién salida del estudio",
  Restored: "Restaurada",
  "Ships from Miami, FL — worldwide": "Envío mundial desde Miami, FL",
  "Local pickup in Miami": "Recogida local en Miami",
  "Ships within the United States": "Envío dentro de Estados Unidos",
  "Shipping arranged after purchase": "Envío coordinado después de la compra",
  "Buyer arranges shipping": "El comprador coordina el envío",
  "Miami Beach": "Miami Beach",
  "Wynwood, Miami": "Wynwood, Miami",
  "Studio — Miami, FL": "Estudio — Miami, FL",
};

function generateArtworkCode() {
  const year = new Date().getFullYear();
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.floor(Math.random() * 90 + 10);
  return `IKK-MIA-${year}-${stamp}${random}`;
}

type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select";
  options?: string[];
  full?: boolean;
};

const SECTIONS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Datos principales",
    fields: [
      { name: "artwork_title", label: "Título de la obra", type: "text", full: true },
      {
        name: "artwork_title_en",
        label: "Título en inglés (se muestra cuando el sitio está en inglés)",
        type: "text",
        full: true,
      },
      { name: "artist", label: "Artista", type: "text" },
      { name: "year", label: "Año", type: "select", options: OPTIONS.year },
      { name: "series", label: "Serie", type: "select", options: OPTIONS.series },
      { name: "medium", label: "Técnica", type: "select", options: OPTIONS.medium },
      {
        name: "dimensions",
        label: "Dimensiones",
        type: "select",
        options: OPTIONS.dimensions,
      },
      { name: "edition", label: "Edición", type: "select", options: OPTIONS.edition },
      {
        name: "availability",
        label: "Disponibilidad",
        type: "select",
        options: OPTIONS.availability,
      },
      { name: "price", label: "Precio (USD)", type: "number" },
      {
        name: "location",
        label: "Ubicación",
        type: "select",
        options: OPTIONS.location,
      },
    ],
  },
  {
    title: "Presentación y autenticidad",
    fields: [
      {
        name: "signature",
        label: "Firma",
        type: "select",
        options: OPTIONS.signature,
      },
      {
        name: "certificate_of_authenticity",
        label: "Certificado de autenticidad",
        type: "select",
        options: OPTIONS.certificate_of_authenticity,
        full: true,
      },
      { name: "framing", label: "Enmarcado", type: "select", options: OPTIONS.framing },
      {
        name: "condition",
        label: "Estado de conservación",
        type: "select",
        options: OPTIONS.condition,
      },
      {
        name: "shipping_information",
        label: "Información de envío",
        type: "select",
        options: OPTIONS.shipping_information,
        full: true,
      },
      {
        name: "color_palette",
        label: "Paleta de color",
        type: "select",
        options: OPTIONS.color_palette,
      },
    ],
  },
  {
    title: "Historia y concepto",
    fields: [
      {
        name: "artwork_statement",
        label: "Descripción de la obra",
        type: "textarea",
        full: true,
      },
      {
        name: "artists_reflection",
        label: "Reflexión del artista",
        type: "textarea",
        full: true,
      },
      { name: "inspiration", label: "Inspiración", type: "textarea", full: true },
      { name: "concept", label: "Concepto", type: "textarea", full: true },
      {
        name: "creative_process",
        label: "Proceso creativo",
        type: "textarea",
        full: true,
      },
      { name: "details", label: "Detalles", type: "textarea", full: true },
    ],
  },
  {
    title: "Información para coleccionistas",
    fields: [
      {
        name: "collection_notes",
        label: "Notas de colección",
        type: "textarea",
        full: true,
      },
      {
        name: "exhibition_history",
        label: "Historial de exposiciones",
        type: "textarea",
        full: true,
      },
      {
        name: "publications",
        label: "Publicaciones",
        type: "textarea",
        full: true,
      },
      {
        name: "awards_recognition",
        label: "Premios y reconocimientos",
        type: "textarea",
        full: true,
      },
      {
        name: "collector_information",
        label: "Información para coleccionistas",
        type: "textarea",
        full: true,
      },
      {
        name: "keywords",
        label: "Palabras clave (separadas por comas)",
        type: "text",
        full: true,
      },
      { name: "inquiry", label: "Consulta", type: "textarea", full: true },
    ],
  },
];

const DEFAULTS: Record<string, string> = {
  artist: "Gustavo Moreno",
  year: CURRENT_YEAR,
  location: "Miami",
  availability: "Available",
  medium: "Mixed media on canvas",
  dimensions: "100 × 100 cm",
  edition: "Original 1/1",
  signature: "Signed front",
  certificate_of_authenticity: "Included — signed by the artist",
  framing: "Unframed",
  condition: "Excellent",
  shipping_information: "Ships from Miami, FL — worldwide",
  color_palette: "Vibrant / multicolor",
};

function SelectOrCustom({
  name,
  label,
  options,
  initial,
}: {
  name: string;
  label: string;
  options: string[];
  initial: string;
}) {
  const known = options.includes(initial);
  const [mode, setMode] = useState<"list" | "custom">(
    initial && !known ? "custom" : "list",
  );
  const [custom, setCustom] = useState(known ? "" : initial);
  const [selected, setSelected] = useState(known ? initial : options[0] || "");

  const value = mode === "custom" ? custom : selected;

  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <input type="hidden" name={name} value={value} />
      {mode === "list" ? (
        <select
          value={selected}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setMode("custom");
              return;
            }
            setSelected(e.target.value);
          }}
          className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-ink"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {OPTION_LABELS[option] || option}
            </option>
          ))}
          <option value="__custom__">Otro…</option>
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Escribe un valor personalizado"
            className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
          />
          <button
            type="button"
            onClick={() => {
              setMode("list");
              setSelected(options[0] || "");
            }}
            className="shrink-0 text-[11px] uppercase tracking-wide text-muted hover:text-ink"
          >
            Lista
          </button>
        </div>
      )}
    </label>
  );
}

export default function ArtworkForm({ categories, artwork }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [title, setTitle] = useState(artwork?.artwork_title || "");
  const [artworkCode, setArtworkCode] = useState(
    artwork?.artwork_code || generateArtworkCode(),
  );
  const [printAvailable, setPrintAvailable] = useState(
    Boolean(artwork?.print_available),
  );
  const isEdit = Boolean(artwork);

  const printTitle = useMemo(
    () => title.trim() || "Untitled artwork",
    [title],
  );

  async function action(formData: FormData) {
    setError(null);
    formData.set("artwork_code", artworkCode);
    const result = isEdit
      ? await updateArtwork(formData)
      : await createArtwork(formData);

    if (result?.error) setError(result.error);
  }

  function defaultValue(name: string) {
    if (!artwork) return DEFAULTS[name] || "";
    if (name === "keywords") return (artwork.keywords || []).join(", ");
    const value = artwork[name as keyof Artwork];
    return value == null ? "" : String(value);
  }

  async function printLabel() {
    setLabelError(null);

    if (!title.trim()) {
      setLabelError("Escribe primero el título de la obra y luego imprime la etiqueta.");
      return;
    }

    // Open the window synchronously on click so pop-up blockers allow it.
    const win = window.open("", "_blank", "width=460,height=620");

    const logoUrl = `${window.location.origin}/img/ikkoablanco.jpg`;
    const detailSlug = artwork?.slug || slugify(title);
    const artworkUrl = `${window.location.origin}/visual-stories/all/${detailSlug}`;

    let qrDataUrl = "";
    try {
      qrDataUrl = await QRCode.toDataURL(artworkUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: "#111111",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
    } catch {
      // Print without QR rather than failing entirely.
      qrDataUrl = "";
    }

    const labelHtml = `<!doctype html>
<html>
<head>
  <title>Artwork Label — ${artworkCode}</title>
  <style>
    @page { size: 100mm 65mm; margin: 5mm; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #111;
    }
    .label {
      border: 1.5px solid #111;
      padding: 14px 16px;
      width: 350px;
    }
    .layout {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 14px;
    }
    .info {
      min-width: 0;
      flex: 1;
    }
    .logo {
      display: block;
      height: 46px;
      width: auto;
      margin-bottom: 12px;
      object-fit: contain;
    }
    .code {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin: 0 0 8px;
    }
    .title {
      font-size: 13px;
      margin: 0 0 4px;
    }
    .meta {
      font-size: 11px;
      color: #555;
      margin: 0;
    }
    .hint {
      margin-top: 12px;
      font-size: 10px;
      color: #777;
    }
    .qr-wrap {
      flex: 0 0 94px;
      text-align: center;
    }
    .qr {
      display: block;
      width: 94px;
      height: 94px;
    }
    .scan {
      margin: 4px 0 0;
      font-size: 8px;
      line-height: 1.2;
      color: #555;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
  </style>
</head>
<body>
  <div class="label">
    <div class="layout">
      <div class="info">
        <img class="logo printable-image" src="${logoUrl}" alt="IkKOA Studio" />
        <p class="code">${artworkCode}</p>
        <p class="title">${printTitle}</p>
        <p class="meta">Gustavo Moreno · Miami</p>
      </div>
      ${
        qrDataUrl
          ? `<div class="qr-wrap">
        <img class="qr printable-image" src="${qrDataUrl}" alt="QR code for artwork page" />
        <p class="scan">Scan to view artwork</p>
      </div>`
          : ""
      }
    </div>
    <p class="hint">Cut and affix to the reverse of the artwork.</p>
  </div>
  <script>
    const images = [...document.querySelectorAll('.printable-image')];
    Promise.all(images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });
    })).then(() => window.print());
  </script>
</body>
</html>`;

    if (win) {
      win.document.open();
      win.document.write(labelHtml);
      win.document.close();
      win.focus();
      return;
    }

    // Pop-up blocked: print the label inside a hidden iframe instead.
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) {
      iframe.remove();
      setLabelError(
        "The browser blocked the pop-up. Allow pop-ups for this site and try again.",
      );
      return;
    }
    doc.open();
    doc.write(labelHtml);
    doc.close();
    window.setTimeout(() => iframe.remove(), 60000);
  }

  return (
    <form action={action} className="space-y-10">
      {isEdit && <input type="hidden" name="id" value={artwork!.id} />}
      {isEdit && <input type="hidden" name="slug" value={artwork!.slug} />}

      <section className="space-y-6">
        <h2 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-muted">
          Categoría, imagen y video
        </h2>
        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            Categoría
          </span>
          <select
            name="category_id"
            defaultValue={artwork?.category_id || ""}
            className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-ink"
          >
            <option value="">Sin categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Archivo de imagen
            </span>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              O URL de la imagen
            </span>
            <input
              name="image_url"
              defaultValue={artwork?.image_url || ""}
              placeholder="https://... or /arts/file.png"
              className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              YouTube video URL
            </span>
            <input
              name="youtube_url"
              type="url"
              defaultValue={artwork?.youtube_url || ""}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
            />
            <p className="mt-2 text-xs text-muted">
              Opcional. Pega un enlace de YouTube para mostrar el video en la
              página de la obra.
            </p>
          </label>
        </div>
      </section>

      <section className="space-y-4 border border-line bg-background/60 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Código de la obra
            </span>
            <input
              name="artwork_code"
              value={artworkCode}
              onChange={(e) => setArtworkCode(e.target.value.toUpperCase())}
              className="w-full border-b border-ink/25 bg-transparent py-3 font-[family-name:var(--font-nav)] tracking-wide outline-none focus:border-ink"
            />
            <p className="mt-2 text-xs text-muted">
              Se genera automáticamente para el estudio de Miami. Puedes
              editarlo o imprimir una etiqueta para adherirla a la obra.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setArtworkCode(generateArtworkCode())}
              className="h-11 border border-ink px-4 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-ink"
            >
              Generar
            </button>
            <button
              type="button"
              onClick={printLabel}
              className="h-11 bg-ink px-4 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white"
            >
              Imprimir etiqueta
            </button>
          </div>
        </div>
        {labelError && (
          <p className="text-sm text-red-600" role="alert">
            {labelError}
          </p>
        )}
      </section>

      <section className="space-y-6 border border-line bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-muted">
              Edición impresa
            </h2>
            <p className="mt-2 text-sm text-muted">
              Activa esta opción si también ofreces impresiones numeradas de
              esta obra (por ejemplo 1/100, 2/100…).
            </p>
          </div>
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              name="print_available"
              checked={printAvailable}
              onChange={(e) => setPrintAvailable(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            <span className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-ink">
              Ofrecer impresión
            </span>
          </label>
        </div>

        {printAvailable && (
          <div className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                Precio de la impresión (USD)
              </span>
              <input
                name="print_price"
                type="number"
                step="0.01"
                defaultValue={
                  artwork?.print_price != null ? String(artwork.print_price) : ""
                }
                placeholder="180"
                className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                Tamaño de la serie
              </span>
              <input
                name="print_edition_size"
                type="number"
                min="1"
                defaultValue={
                  artwork?.print_edition_size != null
                    ? String(artwork.print_edition_size)
                    : "100"
                }
                placeholder="100"
                className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
              />
              <p className="mt-2 text-xs text-muted">
                Ejemplo: 100 → se muestra como 1/100, 2/100, etc.
              </p>
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                Impresos vendidos
              </span>
              <input
                name="print_sold_count"
                type="number"
                min="0"
                defaultValue={String(artwork?.print_sold_count ?? 0)}
                className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
              />
              <p className="mt-2 text-xs text-muted">
                El siguiente disponible será vendidos + 1.
              </p>
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                Técnica / formato del impreso
              </span>
              <input
                name="print_medium"
                defaultValue={
                  artwork?.print_medium ||
                  "Giclée limited edition, signed and numbered"
                }
                className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                Dimensiones del impreso
              </span>
              <input
                name="print_dimensions"
                defaultValue={artwork?.print_dimensions || ""}
                placeholder="Ej. 40 × 40 cm"
                className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
              />
            </label>
          </div>
        )}
      </section>

      {SECTIONS.map((section) => (
        <section key={section.title} className="space-y-6">
          <h2 className="border-b border-line pb-3 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-muted">
            {section.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {section.fields.map((field) => {
              const initial = defaultValue(field.name);

              if (field.name === "artwork_title") {
                return (
                  <label
                    key={field.name}
                    className={`block ${field.full ? "sm:col-span-2" : ""}`}
                  >
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                      {field.label}
                    </span>
                    <input
                      name={field.name}
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
                    />
                  </label>
                );
              }

              if (field.type === "select" && field.options) {
                return (
                  <div
                    key={field.name}
                    className={field.full ? "sm:col-span-2" : ""}
                  >
                    <SelectOrCustom
                      name={field.name}
                      label={field.label}
                      options={field.options}
                      initial={initial}
                    />
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <label
                    key={field.name}
                    className={`block ${field.full ? "sm:col-span-2" : ""}`}
                  >
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                      {field.label}
                    </span>
                    <textarea
                      name={field.name}
                      rows={4}
                      defaultValue={initial}
                      className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-ink"
                    />
                  </label>
                );
              }

              return (
                <label
                  key={field.name}
                  className={`block ${field.full ? "sm:col-span-2" : ""}`}
                >
                  <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
                    {field.label}
                  </span>
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    step={field.type === "number" ? "0.01" : undefined}
                    defaultValue={initial}
                    className="w-full border-b border-ink/25 bg-transparent py-3 outline-none focus:border-ink"
                  />
                </label>
              );
            })}
          </div>
        </section>
      ))}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex h-12 items-center bg-ink px-8 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-white"
      >
        {isEdit ? "Guardar cambios" : "Crear obra"}
      </button>
    </form>
  );
}
