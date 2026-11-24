-- Shoresh: onboarding answers, one row per learner.
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text        not null,
  age        text        not null check (age in ('14-15','16-18','19-24','25-30')),
  goal       text        not null check (goal in ('save','understand','invest','job','curious')),
  situation  text[]      not null default '{}',
  minutes    smallint    not null check (minutes in (5,10,20,30)),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "own profile: read"   on public.profiles for select using (auth.uid() = user_id);
create policy "own profile: insert" on public.profiles for insert with check (auth.uid() = user_id);
create policy "own profile: update" on public.profiles for update using (auth.uid() = user_id);
