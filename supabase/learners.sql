-- Tsmicha: one row per signed-in parent (Google account): the child's profile and progress.
-- Run once in Supabase: SQL Editor → New query → paste → Run.
create table if not exists public.learners (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb,
  progress jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learners enable row level security;

-- Each account sees and changes only its own row.
drop policy if exists "own row: read" on public.learners;
drop policy if exists "own row: insert" on public.learners;
drop policy if exists "own row: update" on public.learners;
create policy "own row: read" on public.learners for select using (auth.uid() = user_id);
create policy "own row: insert" on public.learners for insert with check (auth.uid() = user_id);
create policy "own row: update" on public.learners for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
