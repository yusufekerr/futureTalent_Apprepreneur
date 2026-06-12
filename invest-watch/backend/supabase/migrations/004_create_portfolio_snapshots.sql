-- Migration 004: Create portfolio_snapshots table for tracking portfolio history over time.

create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_value numeric(18, 2) not null check (total_value >= 0),
  total_cost numeric(18, 2) not null check (total_cost >= 0),
  recorded_at timestamptz not null default timezone('utc', now())
);

-- Index for fast ordering and filtering per user
create index if not exists idx_portfolio_snapshots_user_recorded_at
on public.portfolio_snapshots(user_id, recorded_at desc);

-- Enable RLS
alter table public.portfolio_snapshots enable row level security;
alter table public.portfolio_snapshots force row level security;

-- Policies
create policy "snapshots_select_own"
on public.portfolio_snapshots
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "snapshots_insert_own"
on public.portfolio_snapshots
for insert
to authenticated
with check ((select auth.uid()) = user_id);
