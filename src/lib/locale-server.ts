import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/locale";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("ikkoa_locale")?.value;
  return value === "es" ? "es" : "en";
}
