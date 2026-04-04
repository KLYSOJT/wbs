-- Migration: create redcross-files storage bucket and policies for PDF uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'redcross-files',
  'redcross-files',
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
      and policyname = 'Public read redcross-files'
  ) then
    create policy "Public read redcross-files"
    on storage.objects
    for select
    to public
    using (bucket_id = 'redcross-files');
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
      and policyname = 'Authenticated upload redcross-files'
  ) then
    create policy "Authenticated upload redcross-files"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'redcross-files'
      and lower(right(name, 4)) = '.pdf'
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
      and policyname = 'Authenticated update redcross-files'
  ) then
    create policy "Authenticated update redcross-files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'redcross-files')
    with check (
      bucket_id = 'redcross-files'
      and lower(right(name, 4)) = '.pdf'
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
      and policyname = 'Authenticated delete redcross-files'
  ) then
    create policy "Authenticated delete redcross-files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'redcross-files');
  end if;
end
$$;
