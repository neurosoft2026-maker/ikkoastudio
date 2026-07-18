-- IkKOA Studio — schema
-- Run in Supabase Dashboard → SQL Editor

-- Categories (nombre)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_en text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Artworks (obras con ficha completa)
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,

  -- Core
  artwork_title text not null,
  artwork_title_en text,
  artist text not null default 'Gustavo Moreno',
  year text,
  series text,
  medium text,
  dimensions text,
  edition text,
  availability text,
  artwork_statement text,
  artists_reflection text,
  inspiration text,
  concept text,
  creative_process text,
  color_palette text,
  details text,
  signature text,
  certificate_of_authenticity text,
  framing text,
  condition text,
  shipping_information text,
  price numeric(12, 2),
  artwork_code text unique,

  -- Print edition (same artwork, more affordable format)
  print_available boolean not null default false,
  print_price numeric(12, 2),
  print_edition_size int,
  print_sold_count int not null default 0,
  print_medium text,
  print_dimensions text,

  collection_notes text,
  exhibition_history text,
  publications text,
  awards_recognition text,
  collector_information text,
  location text,
  keywords text[],
  inquiry text,

  -- Media
  image_url text not null,
  youtube_url text,
  slug text not null unique,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_category_id_idx on public.artworks (category_id);
create index if not exists artworks_slug_idx on public.artworks (slug);

-- Seed categories (nombre)
insert into public.categories (name, sort_order) values
  ('Celebrities', 1),
  ('Musicians', 2),
  ('Painters', 3),
  ('Actors', 4)
on conflict (name) do nothing;

-- Public read access
alter table public.categories enable row level security;
alter table public.artworks enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read artworks" on public.artworks;
create policy "Public can read artworks"
  on public.artworks for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can manage categories" on public.categories;
create policy "Authenticated can manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can manage artworks" on public.artworks;
create policy "Authenticated can manage artworks"
  on public.artworks for all
  to authenticated
  using (true)
  with check (true);

