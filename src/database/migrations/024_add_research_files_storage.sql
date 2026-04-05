-- Migration: create research-files storage bucket and policies for image and PDF uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'research-files',
  'research-files',
  true,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read research-files'
  ) then
    create policy "Public read research-files"
    on storage.objects
    for select
    to public
    using (bucket_id = 'research-files');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated upload research-files'
  ) then
    create policy "Authenticated upload research-files"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'research-files'
      and lower(coalesce(storage.extension(name), '')) = any (array['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'])
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated update research-files'
  ) then
    create policy "Authenticated update research-files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'research-files')
    with check (
      bucket_id = 'research-files'
      and lower(coalesce(storage.extension(name), '')) = any (array['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'])
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated delete research-files'
  ) then
    create policy "Authenticated delete research-files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'research-files');
  end if;
end
$$;
