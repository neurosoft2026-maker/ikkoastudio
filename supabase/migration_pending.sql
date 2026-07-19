-- IkKOA Studio — migraciones pendientes (ejecutar UNA sola vez)
-- Supabase Dashboard → SQL Editor → New query → pegar todo → Run
--
-- Incluye:
-- 1) Columnas de nombre/título en inglés (categorías y obras)
-- 2) Tabla site_content + bucket site-media (textos, video e imagen del home)
-- 3) Tabla studio_journal_videos (videos verticales tipo Reel)

-- ============================================================
-- 1. Nombres en inglés
-- ============================================================

alter table public.categories
  add column if not exists name_en text;

alter table public.artworks
  add column if not exists artwork_title_en text;

-- ============================================================
-- 2. Contenido editable del sitio (home)
-- ============================================================

create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can manage site content" on public.site_content;
create policy "Authenticated can manage site content"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

-- Bucket público para video del hero e imagen de Behind the Canvas
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view site media" on storage.objects;
create policy "Public can view site media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "Authenticated can upload site media" on storage.objects;
create policy "Authenticated can upload site media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media');

drop policy if exists "Authenticated can update site media" on storage.objects;
create policy "Authenticated can update site media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media')
  with check (bucket_id = 'site-media');

drop policy if exists "Authenticated can delete site media" on storage.objects;
create policy "Authenticated can delete site media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media');

-- ============================================================
-- 3. Studio Journal (videos verticales de YouTube)
-- ============================================================

create table if not exists public.studio_journal_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.studio_journal_videos enable row level security;

drop policy if exists "Public can read studio journal videos" on public.studio_journal_videos;
create policy "Public can read studio journal videos"
  on public.studio_journal_videos for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can manage studio journal videos" on public.studio_journal_videos;
create policy "Authenticated can manage studio journal videos"
  on public.studio_journal_videos for all
  to authenticated
  using (true)
  with check (true);
