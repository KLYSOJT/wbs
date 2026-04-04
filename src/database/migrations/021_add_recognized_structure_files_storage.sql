insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recognized-structure-files',
  'recognized-structure-files',
  true,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
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
      and policyname = 'Public read recognized-structure-files'
  ) then
    create policy "Public read recognized-structure-files"
    on storage.objects
    for select
    to public
    using (bucket_id = 'recognized-structure-files');
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
      and policyname = 'Authenticated upload recognized-structure-files'
  ) then
    create policy "Authenticated upload recognized-structure-files"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'recognized-structure-files'
      and (
        lower(name) like '%.pdf'
        or lower(name) like '%.png'
        or lower(name) like '%.jpg'
        or lower(name) like '%.jpeg'
        or lower(name) like '%.webp'
        or lower(name) like '%.gif'
      )
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
      and policyname = 'Authenticated update recognized-structure-files'
  ) then
    create policy "Authenticated update recognized-structure-files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'recognized-structure-files')
    with check (
      bucket_id = 'recognized-structure-files'
      and (
        lower(name) like '%.pdf'
        or lower(name) like '%.png'
        or lower(name) like '%.jpg'
        or lower(name) like '%.jpeg'
        or lower(name) like '%.webp'
        or lower(name) like '%.gif'
      )
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
      and policyname = 'Authenticated delete recognized-structure-files'
  ) then
    create policy "Authenticated delete recognized-structure-files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'recognized-structure-files');
  end if;
end
$$;
