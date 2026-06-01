# TrackingEye

TrackingEye, yatirima yeni baslayan kullanicilarin portfoylerini mobilde kolayca takip etmesini hedefleyen bir MVP urunudur.

## Proje Durumu

- Urun: TrackingEye
- Surum: 1.0 (MVP)
- Platform: iOS / Android (cross-platform)
- Stack: Expo + TypeScript + Expo Router + Supabase
- Guncel faz: **Faz 7 – MVP Sonrası ve Kalite Kontrolü** ✅ (Tamamlandı)

## Tamamlanan Asamalar

### Faz 1 – Proje Iskelesi ✅

- Expo + TypeScript + Expo Router ile proje yapilandirildi
- Lint ve format ayarlari (ESLint + Prettier)
- Ortam degiskeni duzeni (`.env` / `.env.example`)
- Supabase baglanti istemcisi (`src/lib/supabase.ts`)
- Veritabani semasi + RLS policy migration dosyasi (`supabase/migrations/001_init_tracking_eye.sql`)

### Faz 2 – Kimlik Dogrulama ✅

- Supabase Auth entegrasyonu (`src/context/AuthContext.tsx`)
- `signInWithPassword`, `signUp`, `signOut` fonksiyonlari
- Oturum kaliciligi (`AsyncStorage` ile `persistSession`)
- Korumali rota yonlendirmesi (`app/index.tsx`)
- Login ve Register ekranlarinda form validasyonu, hata mesajlari, loading state
- Sifre alanlari icin `secureTextEntry` destegi
- Turkce auth hata mesajlari (`src/utils/errors.ts`)

### Faz 3 – Varlik CRUD ✅

- Supabase uzerinden varlik ekleme, listeleme, silme, fiyat guncelleme
- `PortfolioContext` ile merkezi state yonetimi (`src/context/PortfolioContext.tsx`)
- DB row ↔ App model arasi `mapRow()` donusumu
- RLS ile kullaniciya ozel veri erisimi (sunucu tarafinda)
- Form tarafinda sayisal input dogrulama (`src/utils/number.ts`)

### Faz 4 – Dashboard ✅

- Toplam portfoy degeri ve kar/zarar metrikleri
- Varlik dagilim grafigi (animasyonlu bar chart — `AllocationBars`)
- Bos portfoy, yukleme ve hata durumlari
- Hizli erisim butonlari (Yeni Varlik; Analiz/Gecmis/Alarmlar MVP sonrasi)
- Kullanici bilgiisi auth'tan alinarak header'da goruntuleme

### Faz 5 – Portfoy Detay ✅

- Tum varliklarin listelenmesi (satir bazli deger ve kar/zarar)
- Varlik detay ekrani (`app/asset/[id].tsx`)
- Guncel fiyat guncelleme ve varlik silme islemleri
- Dashboard ile tutarli hesaplama fonksiyonlari (`src/utils/portfolio.ts`)
- Portfoy listesinde yukleme ve hata durumlari

### Faz 6 – Kalite ✅ (Tamamlandı)

- ✅ Portfoy hesaplama birim testleri (`src/utils/portfolio.test.ts`, Vitest)
- ✅ Manuel kalite checklist (`FAZ6_KALITE_CHECKLIST.md`)
- ✅ PRD §8 kabul testleri (manuel)
- ✅ iOS/Android smoke test

### Faz 7 – MVP Sonrası ✅ (Tamamlandı)

- Otomatik fiyat verisi / market data (CoinGecko API ve simülasyon entegrasyonu)
- Fiyat alarmı ve bildirimler (Supabase tetikleyicisi ve Alerts ekranı)
- Zaman içinde performans grafiği (US-5 - Tarihsel portföy anlık görüntüsü)

## Veri Modeli (Ozet)

- **Kullanici:** Supabase Auth tarafindan `auth.users` icinde tutulur (email, sifre hash). Uygulama icin ayri `public.users` tablosu yoktur.
- **Varlik:** `public.assets` tablosunda tutulur; her satir `user_id` ile ilgili kullaniciya baglanir.

## Proje Yapisi

```
tracking_eye/
├── app/                    # Expo Router sayfalari
│   ├── (auth)/             # Login, Register ekranlari
│   ├── (tabs)/             # Dashboard, Add Asset, Portfolio
│   ├── asset/              # Varlik detay ekrani [id].tsx
│   ├── _layout.tsx         # Root layout (AuthProvider > PortfolioProvider)
│   └── index.tsx           # Giris yonlendirmesi
├── src/
│   ├── components/ui/      # Yeniden kullanilabilir UI bilesenleri
│   ├── config/             # Ortam degiskenleri
│   ├── context/            # AuthContext, PortfolioContext
│   ├── design/             # Tasarim tokenlari (renkler, spacing, tipografi)
│   ├── lib/                # Supabase istemcisi
│   ├── types/              # TypeScript tip tanimlari (database.types.ts dahil)
│   └── utils/              # Portfoy hesaplama, hata ve sayi yardimcilari
├── supabase/migrations/    # Veritabani migration dosyalari (001–003)
├── FAZ6_KALITE_CHECKLIST.md
└── package.json
```

## Kurulum

1. Paketleri kur:
   ```bash
   npm install
   ```
2. Ortam degiskenlerini ayarla:
   - `.env.example` dosyasini `.env` olarak kopyala.
   - `EXPO_PUBLIC_SUPABASE_URL` ve `EXPO_PUBLIC_SUPABASE_ANON_KEY` degerlerini gir.
3. Gelistirme sunucusunu baslat:
   ```bash
   npm run start
   ```

## Gelistirme Komutlari

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript kontrolu
npm run test       # Vitest birim testleri
npm run format     # Prettier
```

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) uzerinde yeni bir proje olustur (veya duraklatilmis projeyi uyandir).
2. Asagidaki migration dosyalarini **sirasiyla** SQL Editor'da calistir:
   - `supabase/migrations/001_init_tracking_eye.sql` — `assets` tablosu, RLS policy'ler
   - `supabase/migrations/002_add_updated_at_and_constraints.sql` — `updated_at` trigger, `type` check
   - `supabase/migrations/003_harden_assets_integrity_and_indexes.sql` — `quantity > 0`, bos `name` engeli, birlesik index, force RLS
3. `public.assets` tablosu ve kullaniciya ozel RLS policy'lerin olustugunu dogrula.
4. Proje ayarlarindan `URL` ve `anon key` degerlerini al, `.env` dosyasina yapistir.

## Dokumanlar

- `GELISTIRME_PLANI.md`: Fazlara ayrilmis uygulama plani ve ilerleme durumu
- `Yatirim-Takibi-MVP-PRD.md`: Ayrintili urun gereksinimleri ve acceptance criteria
- `FAZ6_KALITE_CHECKLIST.md`: Manuel kabul, smoke ve DB dogrulama listesi
