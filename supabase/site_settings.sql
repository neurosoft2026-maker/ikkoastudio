-- Site settings (home on/off)
-- Run in Supabase SQL Editor

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  home_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, home_enabled)
values (1, true)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Authenticated can update site settings"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);
