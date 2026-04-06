-- Migration: create learning-materials-files storage bucket and policies for PDF uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'learning-materials-files',
  'learning-materials-files',
  true,
  10485760,
  array['application/pdf']
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
      and policyname = 'Public read learning-materials-files'
  ) then
    create policy "Public read learning-materials-files"
    on storage.objects
    for select
    to public
    using (bucket_id = 'learning-materials-files');
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
      and policyname = 'Authenticated upload learning-materials-files'
  ) then
    create policy "Authenticated upload learning-materials-files"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'learning-materials-files'
      and lower(coalesce(storage.extension(name), '')) = 'pdf'
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
      and policyname = 'Authenticated update learning-materials-files'
  ) then
    create policy "Authenticated update learning-materials-files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'learning-materials-files')
    with check (
      bucket_id = 'learning-materials-files'
      and lower(coalesce(storage.extension(name), '')) = 'pdf'
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
      and policyname = 'Authenticated delete learning-materials-files'
  ) then
    create policy "Authenticated delete learning-materials-files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'learning-materials-files');
  end if;
end
$$;
