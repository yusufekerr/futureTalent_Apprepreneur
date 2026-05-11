# TrackingEye

TrackingEye, yatirima yeni baslayan kullanicilarin portfoylerini mobilde kolayca takip etmesini hedefleyen bir MVP urunudur.

## Proje Durumu

- Urun: TrackingEye
- Surum: 1.0 (MVP)
- Platform: iOS / Android (cross-platform)
- Stack: Expo + TypeScript + Expo Router + Supabase

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

### Faz 3 – Varlik CRUD ✅

- Supabase uzerinden varlik ekleme, listeleme, silme, fiyat guncelleme
- `PortfolioContext` ile merkezi state yonetimi (`src/context/PortfolioContext.tsx`)
- DB row ↔ App model arasi `mapRow()` donusumu
- RLS ile kullaniciya ozel veri erisimi (sunucu tarafinda)

### Faz 4 – Dashboard ✅

- Toplam portfoy degeri ve kar/zarar metrikleri
- Varlik dagilim grafigi (animasyonlu bar chart — `AllocationBars`)
- Bos portfoy, yukleme ve hata durumlari
- Hizli erisim butonlari (Yeni Varlik, Analiz, Gecmis, Alarmlar)
- Kullanici bilgisi auth'tan alinarak header'da goruntuleme

### Faz 5 – Portfoy Detay ✅

- Tum varliklarin listelenmesi (satir bazli deger ve kar/zarar)
- Varlik detay ekrani (`app/asset/[id].tsx`)
- Guncel fiyat guncelleme ve varlik silme islemleri
- Dashboard ile tutarli hesaplama fonksiyonlari (`src/utils/portfolio.ts`)

### Faz 6 – Kalite ⏳ (Siradaki)

- PRD §8 kabul testleri
- Hesaplama birim testleri
- iOS/Android smoke test

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
│   ├── types/              # TypeScript tip tanimlari
│   └── utils/              # Portfoy hesaplama yardimcilari
├── supabase/migrations/    # Veritabani sema dosyasi
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

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) uzerinde yeni bir proje olustur.
2. `supabase/migrations/001_init_tracking_eye.sql` dosyasinin icerigini SQL Editor'da calistir.
3. `public.assets` tablosu ve kullaniciya ozel RLS policy'lerin olustugunu dogrula.
4. Proje ayarlarindan `URL` ve `anon key` degerlerini al, `.env` dosyasina yapistir.

## Dokumanlar

- `GELISTIRME_PLANI.md`: Fazlara ayrilmis uygulama plani ve ilerleme durumu
- `Yatirim-Takibi-MVP-PRD.md`: Ayrintili urun gereksinimleri ve acceptance criteria
