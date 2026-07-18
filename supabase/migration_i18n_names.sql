-- Nombres en inglés para categorías y títulos en inglés para obras.
-- Ejecutar en el SQL Editor de Supabase.

alter table public.categories
  add column if not exists name_en text;

alter table public.artworks
  add column if not exists artwork_title_en text;
