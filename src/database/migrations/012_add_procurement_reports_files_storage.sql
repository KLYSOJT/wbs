-- Migration: create procurement-reports-files storage bucket and policies for PDF uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'procurement-reports-files',
  'procurement-reports-files',
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
      and policyname = 'Public read procurement-reports-files'
  ) then
    create policy "Public read procurement-reports-files"
    on storage.objects
    for select
    to public
    using (bucket_id = 'procurement-reports-files');
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
      and policyname = 'Authenticated upload procurement-reports-files'
  ) then
    create policy "Authenticated upload procurement-reports-files"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'procurement-reports-files'
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
      and policyname = 'Authenticated update procurement-reports-files'
  ) then
    create policy "Authenticated update procurement-reports-files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'procurement-reports-files')
    with check (
      bucket_id = 'procurement-reports-files'
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
      and policyname = 'Authenticated delete procurement-reports-files'
  ) then
    create policy "Authenticated delete procurement-reports-files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'procurement-reports-files');
  end if;
end
$$;
