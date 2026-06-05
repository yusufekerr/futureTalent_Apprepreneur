-- Database hardening for assets table:
-- - Enforce non-empty asset names
-- - Align quantity rule with app-side validation (> 0)
-- - Add composite index for common "my assets newest first" access pattern
-- - Force RLS for additional defense-in-depth

alter table public.assets
  drop constraint if exists assets_quantity_check;

alter table public.assets
  add constraint assets_quantity_check check (quantity > 0);

alter table public.assets
  drop constraint if exists assets_name_not_empty_check;

alter table public.assets
  add constraint assets_name_not_empty_check check (char_length(btrim(name)) > 0);

create index if not exists idx_assets_user_created_at
on public.assets(user_id, created_at desc);

alter table public.assets force row level security;
