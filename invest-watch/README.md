# InvestWatch

InvestWatch, yatirima yeni baslayan kullanicilarin portfoylerini mobilde kolayca takip etmesini hedefleyen bir MVP urunudur.

## Proje Durumu

- Urun: InvestWatch
- Surum: 1.0 (MVP)
- Platform: iOS / Android (cross-platform)
- Stack: Expo + TypeScript + Expo Router + Supabase
- Guncel faz: **Faz 9 – Dinamik Varlık Seçimi, Kısmi Satış & Yerelleştirme** ✅ (Tamamlandı)

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

### Faz 8 – Klasör Yapısı & Brief Uyumu ✅ (Tamamlandı)

- Tüm mobil arayüz kodları `/frontend` klasörü altına, Supabase veritabanı şemaları `/backend/supabase` altına taşındı.
- Projenin AI ajanları ve geliştiriciler için referans oluşturan `prodocs/` dokümantasyonu tamamlandı.

### Faz 9 – Dinamik Varlık Seçimi, Kısmi Satış & Yerelleştirme ✅ (Tamamlandı)

- Varlık ekleme ekranında manuel giriş yerine kategorilere özel dinamik seçim modalı geliştirildi.
- Türkiye özeline uyum sağlamak için ons bazlı `XAU` yerine `Gram Altın`, `Çeyrek Altın`, `Cumhuriyet Altını` ve `Gram Gümüş` varlıkları ile simülasyon desteği entegre edildi.
- Seçilen varlığın taban fiyatının form alanlarına (Alış/Güncel Fiyat) otomatik dolması (auto-fill) sağlandı.
- Varlık detay ekranına "Kısmi Satış Yap" (Sell Portion) kartı ve işlem loglama altyapısı eklendi.
- Eski veritabanı kayıtlarındaki `"ALTIN (XAU)"` ismini giriş yapıldığında otomatik olarak `"Gram Altın"` olarak güncelleyen veri düzeltme (self-healing) mekanizması entegre edildi.

## Veri Modeli (Ozet)

- **Kullanici:** Supabase Auth tarafindan `auth.users` icinde tutulur (email, sifre hash). Uygulama icin ayri `public.users` tablosu yoktur.
- **Varlik:** `public.assets` tablosunda tutulur; her satir `user_id` ile ilgili kullaniciya baglanir.

## Proje Yapısı

```
tracking_eye/
├── frontend/               # Arayüz Kodu (Expo Mobile App)
│   ├── app/                # Expo Router sayfaları (auth, tabs, asset detay)
│   ├── src/                # Bileşenler, contextler, tasarım tokenları ve servisler
│   ├── package.json        # Bağımlılıklar ve script tanımları
│   └── tsconfig.json       # TypeScript yapılandırması
├── backend/                # Arkayüz Kodu
│   └── supabase/           # Veritabanı şemaları, migration SQL dosyaları ve RLS politikaları
├── prodocs/                # Yapay Zeka Ajanları için Geliştirme Referans Dosyaları (Zorunlu)
│   ├── PRD.md              # Çözülen problem, hedef kullanıcı, temel özellikler
│   ├── Plan.md             # Kullanıcı hikayelerine bölünmüş teknik adımlar
│   ├── tech-stack.md       # Kullanılan teknolojiler ve gerekçeleri
│   ├── DesignSystem.md     # Renk paleti, tipografi ve bileşen kuralları
│   ├── Progress.md         # Geliştirme günlüğü ve alınan kararların kaydı
│   └── FAZ6_KALITE_CHECKLIST.md # Manuel kabul testleri listesi
├── .gitignore              # Gereksiz dosyaların repoya girmesini engeller
├── .env.example            # Kök dizinde yer alan örnek env şablonu
└── README.md               # Bu dosya (Uygulamayı tanıtan onepager)
```

## Kurulum

1. Frontend klasörüne geçin ve paketleri kurun:
   ```bash
   cd frontend
   npm install
   ```
2. Ortam değişkenlerini ayarlayın:
   - `frontend/` klasörü içerisindeki `.env.example` dosyasını `.env` olarak kopyalayın (veya kök dizindeki `.env.example`'dan yararlanın).
   - `EXPO_PUBLIC_SUPABASE_URL` ve `EXPO_PUBLIC_SUPABASE_ANON_KEY` değerlerini girin.
   - İsteğe bağlı olarak canlı AI analizleri almak için `EXPO_PUBLIC_GEMINI_API_KEY` değerini ekleyin.
3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run start
   ```

## Geliştirme Komutları

Aşağıdaki komutları **`frontend/`** dizininde çalıştırabilirsiniz:

```bash
npm run lint       # ESLint kontrolü
npm run typecheck  # TypeScript kontrolü
npm run test       # Vitest birim testleri
npm run format     # Prettier kod biçimlendirmesi
```

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) üzerinde yeni bir proje oluşturun.
2. Aşağıdaki migration dosyalarını **sırasıyla** SQL Editor'da çalıştırın:
   - `backend/supabase/migrations/001_init_tracking_eye.sql` — `assets` tablosu, RLS politikaları
   - `backend/supabase/migrations/002_add_updated_at_and_constraints.sql` — `updated_at` tetikleyicisi, `type` kontrolü
   - `backend/supabase/migrations/003_harden_assets_integrity_and_indexes.sql` — veri doğrulama ve birleşik indeksler
   - `backend/supabase/migrations/004_create_portfolio_snapshots.sql` — zaman serisi performans tablosu
   - `backend/supabase/migrations/005_create_price_alerts.sql` — kullanıcı tanımlı fiyat alarmları tablosu
3. `public.assets`, `public.portfolio_snapshots` ve `public.price_alerts` tablolarının oluştuğunu doğrulayın.
4. Supabase projenizin `URL` ve `anon key` değerlerini kopyalayarak `frontend/.env` dosyasına yapıştırın.

## Dokümanlar (prodocs/)

- `prodocs/PRD.md`: Projenin anayasası; çözülen problem ve temel gereksinimler.
- `prodocs/Plan.md`: Adım adım kullanıcı hikayeleri ve teknik planlama.
- `prodocs/tech-stack.md`: Kullanılan tüm servis ve kütüphanelerin gerekçelendirilmesi.
- `prodocs/DesignSystem.md`: Renk, spacing, radius ve görsel bütünlük kuralları.
- `prodocs/Progress.md`: Projenin geliştirilme aşamasındaki kararlar ve sürüm günlüğü.
- `prodocs/FAZ6_KALITE_CHECKLIST.md`: Kalite kontrol ve kabul testleri listesi.
