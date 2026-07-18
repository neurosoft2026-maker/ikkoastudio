-- Extra policies for dashboard (authenticated admin)
-- Run after schema.sql in Supabase SQL Editor

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

-- Storage bucket for artwork images
insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do nothing;

drop policy if exists "Public can view artwork images" on storage.objects;
create policy "Public can view artwork images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'artworks');

drop policy if exists "Authenticated can upload artwork images" on storage.objects;
create policy "Authenticated can upload artwork images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'artworks');

drop policy if exists "Authenticated can update artwork images" on storage.objects;
create policy "Authenticated can update artwork images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'artworks')
  with check (bucket_id = 'artworks');

drop policy if exists "Authenticated can delete artwork images" on storage.objects;
create policy "Authenticated can delete artwork images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'artworks');
