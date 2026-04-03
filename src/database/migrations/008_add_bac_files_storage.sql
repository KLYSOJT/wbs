-- Migration: create bac-files storage bucket and policies for PDF uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bac-files',
  'bac-files',
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
      and policyname = 'Public read bac-files'
  ) then
    create policy "Public read bac-files"
    on storage.objects
    for select
    to public
    using (bucket_id = 'bac-files');
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
      and policyname = 'Authenticated upload bac-files'
  ) then
    create policy "Authenticated upload bac-files"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'bac-files'
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
      and policyname = 'Authenticated update bac-files'
  ) then
    create policy "Authenticated update bac-files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'bac-files')
    with check (
      bucket_id = 'bac-files'
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
      and policyname = 'Authenticated delete bac-files'
  ) then
    create policy "Authenticated delete bac-files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'bac-files');
  end if;
end
$$;
