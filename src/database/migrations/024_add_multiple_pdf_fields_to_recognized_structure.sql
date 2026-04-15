alter table public."recognized-structure"
  add column if not exists pdf_urls text[] not null default '{}'::text[],
  add column if not exists pdf_paths text[] not null default '{}'::text[],
  add column if not exists pdf_mimes text[] not null default '{}'::text[],
  add column if not exists pdf_names text[] not null default '{}'::text[];

update public."recognized-structure"
set
  pdf_urls = case
    when coalesce(array_length(pdf_urls, 1), 0) = 0 and pdf_url is not null then array[pdf_url]
    else coalesce(pdf_urls, '{}'::text[])
  end,
  pdf_paths = case
    when coalesce(array_length(pdf_paths, 1), 0) = 0 and pdf_path is not null then array[pdf_path]
    else coalesce(pdf_paths, '{}'::text[])
  end,
  pdf_mimes = case
    when coalesce(array_length(pdf_mimes, 1), 0) = 0 and pdf_mime is not null then array[pdf_mime]
    else coalesce(pdf_mimes, '{}'::text[])
  end,
  pdf_names = case
    when coalesce(array_length(pdf_names, 1), 0) = 0 and pdf_path is not null then array[regexp_replace(split_part(pdf_path, '/', array_length(string_to_array(pdf_path, '/'), 1)), '^[^-]+-', '')]
    when coalesce(array_length(pdf_names, 1), 0) = 0 and pdf_url is not null then array['PDF 1']
    else coalesce(pdf_names, '{}'::text[])
  end;
