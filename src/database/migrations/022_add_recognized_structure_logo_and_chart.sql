alter table public."recognized-structure"
  add column if not exists logo_url text,
  add column if not exists logo_path text,
  add column if not exists logo_mime text,
  add column if not exists chart_url text,
  add column if not exists chart_path text,
  add column if not exists chart_mime text;

update public."recognized-structure"
set
  chart_url = coalesce(chart_url, image_url),
  chart_path = coalesce(chart_path, image_path),
  chart_mime = coalesce(chart_mime, image_mime)
where chart_url is null or chart_path is null or chart_mime is null;
