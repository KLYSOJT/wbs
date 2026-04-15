alter table public."recognized-structure"
  alter column date_established type integer
  using case
    when date_established is null then null
    else extract(year from date_established)::integer
  end;
