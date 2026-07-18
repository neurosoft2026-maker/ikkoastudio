-- Site content (editable homepage copy + media)
-- Run in Supabase Dashboard → SQL Editor

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

-- Public media bucket for hero video / section images
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
