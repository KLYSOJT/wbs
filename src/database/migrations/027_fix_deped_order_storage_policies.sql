-- Migration: repair deped-order-files storage bucket and upload policies
-- Fixes Storage RLS failures such as "new row violates row-level security policy".

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'deped-order-files',
  'deped-order-files',
  true,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read deped-order-files" on storage.objects;
drop policy if exists "Authenticated upload deped-order-files" on storage.objects;
drop policy if exists "Authenticated update deped-order-files" on storage.objects;
drop policy if exists "Authenticated delete deped-order-files" on storage.objects;

create policy "Public read deped-order-files"
on storage.objects
for select
to public
using (bucket_id = 'deped-order-files');

create policy "Authenticated upload deped-order-files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'deped-order-files'
  and lower(right(name, 4)) = '.pdf'
);

create policy "Authenticated update deped-order-files"
on storage.objects
for update
to authenticated
using (bucket_id = 'deped-order-files')
with check (
  bucket_id = 'deped-order-files'
  and lower(right(name, 4)) = '.pdf'
);

create policy "Authenticated delete deped-order-files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'deped-order-files');
