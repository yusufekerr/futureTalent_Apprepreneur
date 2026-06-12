-- Migration 005: Create price_alerts table for user-defined price alerts.

create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_name text not null,
  target_price numeric(18, 6) not null check (target_price >= 0),
  condition text not null check (condition in ('above', 'below')),
  is_triggered boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

-- Index for fast retrieval of active alerts per user
create index if not exists idx_price_alerts_user_active
on public.price_alerts(user_id, is_triggered);

-- Enable RLS
alter table public.price_alerts enable row level security;
alter table public.price_alerts force row level security;

-- Policies for CRUD
create policy "alerts_select_own"
on public.price_alerts
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "alerts_insert_own"
on public.price_alerts
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "alerts_update_own"
on public.price_alerts
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "alerts_delete_own"
on public.price_alerts
for delete
to authenticated
using ((select auth.uid()) = user_id);
