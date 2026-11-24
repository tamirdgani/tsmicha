-- Shoresh: one progress row per learner. Run in Supabase → SQL editor.
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  done       text[]      not null default '{}',
  xp         integer     not null default 0,
  streak     integer     not null default 0,
  today_xp   integer     not null default 0,
  daily_goal integer     not null default 30,
  badges     text[]      not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "own progress: read"   on public.progress for select using (auth.uid() = user_id);
create policy "own progress: insert" on public.progress for insert with check (auth.uid() = user_id);
create policy "own progress: update" on public.progress for update using (auth.uid() = user_id);
