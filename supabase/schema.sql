create table if not exists public.cars (
  id text primary key,
  name text not null,
  type text not null check (type in ('TH', 'STH')),
  year smallint not null check (year between 1900 and 2100),
  series text not null,
  case_letter text not null check (case_letter ~ '^[A-Z]$'),
  image_key text not null,
  id_tips text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists cars_year_type_idx
  on public.cars (year, type);

create index if not exists cars_case_letter_idx
  on public.cars (case_letter);

alter table public.cars enable row level security;

drop policy if exists "Anyone can read cars" on public.cars;
create policy "Anyone can read cars"
  on public.cars
  for select
  to anon, authenticated
  using (true);
