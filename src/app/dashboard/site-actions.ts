"use server";

import { revalidatePath } from "next/cache";
import { saveHomeEnabled } from "@/lib/site-settings";

export async function setHomeEnabled(enabled: boolean) {
  const result = await saveHomeEnabled(enabled);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/");
  revalidatePath("/visual-stories", "layout");
  revalidatePath("/dashboard");
  return { success: true };
}
