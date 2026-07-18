-- Print edition fields for artworks
-- Run in Supabase Dashboard → SQL Editor

alter table public.artworks
  add column if not exists print_available boolean not null default false,
  add column if not exists print_price numeric(12, 2),
  add column if not exists print_edition_size int,
  add column if not exists print_sold_count int not null default 0,
  add column if not exists print_medium text,
  add column if not exists print_dimensions text;
