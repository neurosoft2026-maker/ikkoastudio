"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/locale";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  function changeLocale(next: Locale) {
    document.cookie = `ikkoa_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div
      className="flex items-center border border-white/35"
      aria-label={locale === "es" ? "Seleccionar idioma" : "Select language"}
    >
      {(["en", "es"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => changeLocale(item)}
          aria-pressed={locale === item}
          className={`px-2 py-1 font-[family-name:var(--font-nav)] text-[9px] uppercase tracking-[0.12em] transition-colors ${
            locale === item
              ? "bg-white text-ink"
              : "text-white hover:bg-white/15"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
