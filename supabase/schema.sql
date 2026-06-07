-- HABITAT — Supabase schema
-- Run this once in the Supabase SQL editor for your project.
-- The app upserts a single row per user into habitat_profiles.

create table if not exists habitat_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security: users can only read/write their own row.
alter table habitat_profiles enable row level security;

create policy "read own" on habitat_profiles
  for select using (auth.uid() = user_id);

create policy "upsert own" on habitat_profiles
  for insert with check (auth.uid() = user_id);

create policy "update own" on habitat_profiles
  for update using (auth.uid() = user_id);

-- Optional: leaderboard view (only if you want a real cross-user leaderboard later)
-- create or replace view habitat_leaderboard as
--   select user_id, (data->>'xp')::int as xp, data->'user'->>'name' as name
--   from habitat_profiles
--   order by xp desc;
