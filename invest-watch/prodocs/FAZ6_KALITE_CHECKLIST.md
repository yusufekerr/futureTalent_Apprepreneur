# Faz 6 - Kalite Kontrol Checklist

Bu liste, MVP sonrasi kalite fazini sistemli sekilde tamamlamak icin hazirlandi.

**Otomatik testler:** `npm run test` — portfoy hesaplama birim testleri (`src/utils/portfolio.test.ts`).

## 0) Otomatik Testler

- [x] Vitest altyapisi kuruldu (`npm run test`)
- [x] Toplam deger, maliyet, PnL ve yuzde hesaplari test edildi
- [x] Dagilim orani ve siralama test edildi
- [x] Toplam deger 0 iken bos dagilim test edildi

## 1) Acceptance Criteria (PRD §8) Kontrolu

- [x] **US-1 Varlik Ekleme**: Giris yapmis kullanici varlik eklediginde dashboard ve portfoy listesi guncelleniyor.
- [x] **US-2 Portfoy Goruntuleme**: Dashboard'da toplam deger ve toplam kar/zarar dogru gosteriliyor.
- [x] **US-3 Performans Takibi**: Dashboard veya portfoy ekraninda dagilim grafigi gorunuyor.

## 2) Auth Akisi (Smoke)

- [x] Register: Gecerli e-posta/sifre ile kayit basarili.
- [x] Login: Dogru bilgilerle giris basarili.
- [x] Login hata: Hatali sifrede anlamli hata mesaji gosteriliyor.
- [x] Logout: Oturum kapatildiginda auth ekranina donuluyor.
- [x] Session persistence: Uygulama kapat-ac sonrasinda oturum korunuyor.

## 3) Asset CRUD Akisi (Smoke)

- [x] Add Asset: Gecerli degerlerle varlik eklenebiliyor.
- [x] Add validation: Bos ad, gecersiz/negatif fiyat, 0 adet engelleniyor.
- [x] List: Yeni eklenen varlik portfoy listesinde gorunuyor.
- [x] Update price: Varlik detayinda guncel fiyat basariyla guncelleniyor.
- [x] Delete: Varlik basariyla siliniyor ve listeden kalkiyor.

## 4) Hesaplama Dogrulugu (Manuel Dogrulama)

Otomatik testler bolum 0'da kapsandi; asagidaki maddeler gercek cihazda ornek veri ile teyit icindir.

- [x] Toplam deger = `sum(quantity * current_price)`.
- [x] Toplam maliyet = `sum(quantity * buy_price)`.
- [x] Toplam kar/zarar = `toplam_deger - toplam_maliyet`.
- [x] Getiri yuzdesi = maliyet 0 degilse `(pnl / maliyet) * 100`, degilse `0`.
- [x] Dagilim oranlari toplamda yaklasik `%100`.

## 5) Platform Smoke

- [x] Android debug build aciliyor, ana akislarda crash yok.
- [x] iOS simulator build aciliyor, ana akislarda crash yok.
- [x] Tab navigation ve ekran gecislerinde donma yok.

## 6) Backend/DB Kontrolu

Migration dosyalarini **sirasiyla** Supabase SQL Editor'da calistir:

1. `001_init_tracking_eye.sql`
2. `002_add_updated_at_and_constraints.sql`
3. `003_harden_assets_integrity_and_indexes.sql`

Kontrol maddeleri:

- [x] `public.assets` tablosu ve RLS policy'ler olustu.
- [x] RLS policy'leri sadece kendi kullanici verisini gosterecek sekilde calisiyor.
- [x] `quantity > 0` ve `name` bos olamaz kurallari aktif (003).
- [x] `type` degerleri yalnizca izin verilen enum degerlerini kabul ediyor (002).
- [x] `updated_at` trigger'i update islemlerinde calisiyor (002).
- [x] Baska bir kullanicinin varligina erisilemiyor (RLS smoke).

