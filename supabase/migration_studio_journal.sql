-- Studio Journal — videos verticales tipo Reel (ejecutar UNA sola vez)
-- Supabase Dashboard → SQL Editor → New query → pegar → Run
-- Usa este archivo si ya corriste migration_pending.sql antes de esta feature.

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
