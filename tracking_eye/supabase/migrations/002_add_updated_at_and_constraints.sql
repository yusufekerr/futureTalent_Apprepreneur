-- 1. moddatetime eklentisini aktif et (updated_at trigger'ı için gereklidir)
create extension if not exists "moddatetime" schema "extensions";

-- 2. updated_at sütununu ekle
alter table public.assets
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

-- 3. update işlemlerinde updated_at sütununu otomatik güncelleyen trigger'ı oluştur
create trigger handle_updated_at
  before update on public.assets
  for each row
  execute procedure moddatetime(updated_at);

-- 4. type sütununa CHECK kısıtlaması ekle (Sadece izin verilen tipler)
alter table public.assets
  add constraint assets_type_check check (type in ('Hisse', 'Kripto', 'Emtia', 'Fon', 'Döviz'));
