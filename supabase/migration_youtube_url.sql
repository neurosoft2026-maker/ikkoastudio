-- Add YouTube URL to artworks
-- Run in Supabase Dashboard → SQL Editor

alter table public.artworks
  add column if not exists youtube_url text;
