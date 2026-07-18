"use client";

import { useMemo, useState } from "react";
import { whatsappUrl } from "@/lib/contacts";
import type { Locale } from "@/lib/locale";
import { publicText } from "@/lib/locale";

type Props = {
  locale: Locale;
  artworkTitle: string;
  artworkCode: string | null;
  availability: string | null;
  originalPrice: number | null;
  printAvailable: boolean;
  printPrice: number | null;
  printEditionSize: number | null;
  printSoldCount: number;
  printMedium: string | null;
  printDimensions: string | null;
  usdToCop: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

function formatCop(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ArtworkPriceCard({
  locale,
  artworkTitle,
  artworkCode,
  availability,
  originalPrice,
  printAvailable,
  printPrice,
  printEditionSize,
  printSoldCount,
  printMedium,
  printDimensions,
  usdToCop,
}: Props) {
  const copy = publicText[locale].detail;
  const [format, setFormat] = useState<"original" | "print">("original");

  const nextNumber =
    printEditionSize != null
      ? Math.min(printSoldCount + 1, printEditionSize)
      : null;
  const remaining =
    printEditionSize != null
      ? Math.max(printEditionSize - printSoldCount, 0)
      : null;
  const printSoldOut = printAvailable && remaining === 0;

  const selectedPrice =
    format === "print" && printAvailable ? printPrice : originalPrice;
  const selectedCop =
    selectedPrice != null ? Math.round(selectedPrice * usdToCop) : null;

  const inquireLabel = useMemo(() => {
    if (format === "print" && printAvailable) return copy.inquirePrint;
    if (printAvailable) return copy.inquireOriginal;
    return copy.inquireWhatsApp;
  }, [copy, format, printAvailable]);

  // The WhatsApp message is always in English, regardless of site language.
  const inquireHref = useMemo(() => {
    const ref = artworkCode ? ` (Ref. ${artworkCode})` : "";
    const isPrint = format === "print" && printAvailable;

    if (isPrint) {
      const edition =
        nextNumber != null && printEditionSize != null
          ? ` ${nextNumber}/${printEditionSize}`
          : "";
      return whatsappUrl(
        `Hi IkKOA Studio, I'm interested in the PRINT EDITION${edition} of "${artworkTitle}"${ref}. How can I purchase it?`,
      );
    }

    return whatsappUrl(
      `Hi IkKOA Studio, I'm interested in the ORIGINAL of "${artworkTitle}"${ref}. Is it available?`,
    );
  }, [
    artworkCode,
    artworkTitle,
    format,
    nextNumber,
    printAvailable,
    printEditionSize,
  ]);

  const isAvailable =
    (availability || "").toLowerCase().includes("available") ||
    (availability || "").toLowerCase().includes("sale") ||
    (availability || "").toLowerCase().includes("disponible");

  return (
    <div className="bg-ink px-7 py-8 text-white sm:px-9 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.28em] text-white/60">
          {copy.price}
        </p>
        {availability && format === "original" && (
          <span
            className={`inline-flex items-center gap-2 border px-3 py-1 font-[family-name:var(--font-nav)] text-[10px] uppercase tracking-[0.18em] ${
              isAvailable
                ? "border-white/40 text-white"
                : "border-white/25 text-white/60"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAvailable ? "bg-white" : "bg-white/40"
              }`}
            />
            {availability}
          </span>
        )}
        {format === "print" && printAvailable && (
          <span className="inline-flex items-center gap-2 border border-white/40 px-3 py-1 font-[family-name:var(--font-nav)] text-[10px] uppercase tracking-[0.18em] text-white">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                printSoldOut ? "bg-white/40" : "bg-white"
              }`}
            />
            {printSoldOut
              ? copy.soldOut
              : remaining != null
                ? `${remaining} ${copy.remaining}`
                : copy.printEdition}
          </span>
        )}
      </div>

      {printAvailable && (
        <div className="mt-6">
          <p className="mb-3 font-[family-name:var(--font-nav)] text-[10px] uppercase tracking-[0.18em] text-white/50">
            {copy.chooseFormat}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormat("original")}
              className={`border px-4 py-3 text-left transition-colors ${
                format === "original"
                  ? "border-white bg-white text-ink"
                  : "border-white/30 text-white hover:border-white/60"
              }`}
            >
              <span className="block font-[family-name:var(--font-nav)] text-[10px] uppercase tracking-[0.16em]">
                {copy.original}
              </span>
              <span className="mt-1 block text-sm font-medium">
                {originalPrice != null
                  ? formatPrice(originalPrice)
                  : copy.onRequest}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFormat("print")}
              className={`border px-4 py-3 text-left transition-colors ${
                format === "print"
                  ? "border-white bg-white text-ink"
                  : "border-white/30 text-white hover:border-white/60"
              }`}
            >
              <span className="block font-[family-name:var(--font-nav)] text-[10px] uppercase tracking-[0.16em]">
                {copy.printEdition}
              </span>
              <span className="mt-1 block text-sm font-medium">
                {printPrice != null ? formatPrice(printPrice) : copy.onRequest}
              </span>
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 font-[family-name:var(--font-title)] text-5xl font-semibold leading-none tracking-tight sm:text-6xl">
        {selectedPrice != null ? formatPrice(selectedPrice) : copy.onRequest}
        {selectedPrice != null && (
          <span className="ml-2 align-baseline text-lg font-normal uppercase tracking-[0.12em] text-white/60">
            USD
          </span>
        )}
      </p>
      {selectedCop != null && (
        <p className="mt-3 text-xl font-medium tracking-tight text-white/80 sm:text-2xl">
          {formatCop(selectedCop)}
          <span className="ml-2 align-baseline text-xs font-normal uppercase tracking-[0.12em] text-white/50">
            COP
          </span>
        </p>
      )}

      {format === "print" && printAvailable && (
        <div className="mt-5 space-y-1 text-sm text-white/70">
          {nextNumber != null && printEditionSize != null && !printSoldOut && (
            <p>
              {copy.nextEdition}:{" "}
              <span className="text-white">
                {nextNumber}/{printEditionSize}
              </span>
            </p>
          )}
          {printMedium && <p>{printMedium}</p>}
          {printDimensions && <p>{printDimensions}</p>}
        </div>
      )}

      {artworkCode && (
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/50">
          Ref. {artworkCode}
        </p>
      )}

      <a
        href={inquireHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex h-12 w-full items-center justify-center bg-white px-7 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-85 sm:w-auto"
      >
        {inquireLabel}
      </a>
    </div>
  );
}
