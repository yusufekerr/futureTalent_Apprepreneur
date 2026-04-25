# TrackingEye

TrackingEye, yatirima yeni baslayan kullanicilarin portfoylerini mobilde kolayca takip etmesini hedefleyen bir MVP urunudur.

## Proje Durumu

Bu klasor artik sadece dokumantasyon degil, ayni zamanda MVP'nin temel mobil kod iskeletini de icerir.

- Urun: TrackingEye
- Surum: 1.0 (MVP)
- Platform: iOS / Android (cross-platform)
- Stack: Expo + TypeScript + Expo Router + Supabase

## Tamamlanan 1. Asama (Gelistirme Plani Faz-1)

Asagidaki maddeler kodlanip projeye eklendi:

- Proje iskeleti (Expo + TypeScript + Router)
- Lint ve format ayarlari (ESLint + Prettier)
- Ortam degiskeni duzeni (`.env.example`)
- Supabase baglanti istemcisi (`src/lib/supabase.ts`)
- BaaS veritabani semasi + RLS policy migration dosyasi (`supabase/migrations/001_init_tracking_eye.sql`)

## Kurulum

1. Bu klasorde paketleri kur:
   - `npm install`
2. Ortam degiskenlerini ayarla:
   - `.env.example` dosyasini `.env` olarak kopyala.
   - `EXPO_PUBLIC_SUPABASE_URL` ve `EXPO_PUBLIC_SUPABASE_ANON_KEY` degerlerini gir.
3. Gelistirme sunucusunu baslat:
   - `npm run start`

## Supabase Kurulumu

1. Supabase projesi olustur.
2. `supabase/migrations/001_init_tracking_eye.sql` dosyasini SQL Editor'de calistir.
3. `public.assets` tablosu ve kullaniciya ozel RLS policy'lerin olustugunu dogrula.

## Dokumanlar

- `GELISTIRME_PLANI.md`: Fazlara ayrilmis uygulama plani
- `Yatirim-Takibi-MVP-PRD.md`: Ayrintili urun gereksinimleri ve acceptance criteria

