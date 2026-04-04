create table if not exists public."recognized-structure" (
  id integer generated always as identity primary key,
  org_name text not null,
  date_established date,
  adviser_name text,
  image_url text not null,
  image_path text not null,
  image_mime text,
  pdf_url text,
  pdf_path text,
  pdf_mime text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public."recognized-structure" enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'recognized-structure'
      and policyname = 'Public read recognized-structure'
  ) then
    create policy "Public read recognized-structure"
    on public."recognized-structure"
    for select
    using (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'recognized-structure'
      and policyname = 'Admin write recognized-structure'
  ) then
    create policy "Admin write recognized-structure"
    on public."recognized-structure"
    for all
    using (true)
    with check (true);
  end if;
end
$$;

create or replace function public.set_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_recognized_structure_updated_at'
  ) then
    create trigger set_recognized_structure_updated_at
    before update on public."recognized-structure"
    for each row
    execute function public.set_updated_at_column();
  end if;
end
$$;
