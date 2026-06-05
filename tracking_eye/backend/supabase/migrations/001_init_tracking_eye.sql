-- TrackingEye MVP: initial schema for Phase 1
-- Run in Supabase SQL Editor or via Supabase CLI migration flow.

create extension if not exists "pgcrypto";

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  quantity numeric(18, 6) not null check (quantity >= 0),
  buy_price numeric(18, 6) not null check (buy_price >= 0),
  current_price numeric(18, 6) not null check (current_price >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_assets_user_id on public.assets(user_id);
create index if not exists idx_assets_created_at on public.assets(created_at desc);

alter table public.assets enable row level security;

create policy "assets_select_own"
on public.assets
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "assets_insert_own"
on public.assets
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "assets_update_own"
on public.assets
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "assets_delete_own"
on public.assets
for delete
to authenticated
using ((select auth.uid()) = user_id);
