insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'anv-files',
  'anv-files',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
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
      and policyname = 'Public read anv-files'
  ) then
    create policy "Public read anv-files"
    on storage.objects
    for select
    to public
    using (bucket_id = 'anv-files');
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
      and policyname = 'Authenticated upload anv-files'
  ) then
    create policy "Authenticated upload anv-files"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'anv-files'
      and (
        lower(name) like '%.jpg'
        or lower(name) like '%.jpeg'
        or lower(name) like '%.png'
        or lower(name) like '%.webp'
        or lower(name) like '%.gif'
        or lower(name) like '%.mp4'
        or lower(name) like '%.webm'
        or lower(name) like '%.ogg'
        or lower(name) like '%.mov'
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
      and policyname = 'Authenticated update anv-files'
  ) then
    create policy "Authenticated update anv-files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'anv-files')
    with check (
      bucket_id = 'anv-files'
      and (
        lower(name) like '%.jpg'
        or lower(name) like '%.jpeg'
        or lower(name) like '%.png'
        or lower(name) like '%.webp'
        or lower(name) like '%.gif'
        or lower(name) like '%.mp4'
        or lower(name) like '%.webm'
        or lower(name) like '%.ogg'
        or lower(name) like '%.mov'
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
      and policyname = 'Authenticated delete anv-files'
  ) then
    create policy "Authenticated delete anv-files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'anv-files');
  end if;
end
$$;
