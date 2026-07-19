import { createClient } from "@/lib/supabase/client";

/**
 * Sube un archivo a Supabase Storage directamente desde el navegador.
 * Evita el límite de 4.5 MB que Vercel impone a las peticiones del servidor.
 */
export async function uploadFileToBucket(
  bucket: string,
  file: File,
  prefix: string,
): Promise<{ url?: string; error?: string }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${prefix}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) {
    if (error.message.toLowerCase().includes("bucket")) {
      return {
        error: `No existe el bucket "${bucket}" en Supabase. Ejecuta las migraciones SQL pendientes (supabase/migration_pending.sql).`,
      };
    }
    return { error: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
