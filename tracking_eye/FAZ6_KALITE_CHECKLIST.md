# Faz 6 - Kalite Kontrol Checklist

Bu liste, MVP sonrasi kalite fazini sistemli sekilde tamamlamak icin hazirlandi.

## 1) Acceptance Criteria (PRD §8) Kontrolu

- [ ] **US-1 Varlik Ekleme**: Giris yapmis kullanici varlik eklediginde dashboard ve portfoy listesi guncelleniyor.
- [ ] **US-2 Portfoy Goruntuleme**: Dashboard'da toplam deger ve toplam kar/zarar dogru gosteriliyor.
- [ ] **US-3 Performans Takibi**: Dashboard veya portfoy ekraninda dagilim grafigi gorunuyor.

## 2) Auth Akisi (Smoke)

- [ ] Register: Gecerli e-posta/sifre ile kayit basarili.
- [ ] Login: Dogru bilgilerle giris basarili.
- [ ] Login hata: Hatali sifrede anlamli hata mesaji gosteriliyor.
- [ ] Logout: Oturum kapatildiginda auth ekranina donuluyor.
- [ ] Session persistence: Uygulama kapat-ac sonrasinda oturum korunuyor.

## 3) Asset CRUD Akisi (Smoke)

- [ ] Add Asset: Gecerli degerlerle varlik eklenebiliyor.
- [ ] Add validation: Bos ad, gecersiz/negatif fiyat, 0 adet engelleniyor.
- [ ] List: Yeni eklenen varlik portfoy listesinde gorunuyor.
- [ ] Update price: Varlik detayinda guncel fiyat basariyla guncelleniyor.
- [ ] Delete: Varlik basariyla siliniyor ve listeden kalkiyor.

## 4) Hesaplama Dogrulugu

- [ ] Toplam deger = `sum(quantity * current_price)`.
- [ ] Toplam maliyet = `sum(quantity * buy_price)`.
- [ ] Toplam kar/zarar = `toplam_deger - toplam_maliyet`.
- [ ] Getiri yuzdesi = maliyet 0 degilse `(pnl / maliyet) * 100`, degilse `0`.
- [ ] Dagilim oranlari toplamda yaklasik `%100`.

## 5) Platform Smoke

- [ ] Android debug build aciliyor, ana akislarda crash yok.
- [ ] iOS simulator build aciliyor, ana akislarda crash yok.
- [ ] Tab navigation ve ekran gecislerinde donma yok.

## 6) Backend/DB Kontrolu

- [ ] `assets` tablosu migration'lari hatasiz uygulanmis.
- [ ] RLS policy'leri sadece kendi kullanici verisini gosterecek sekilde calisiyor.
- [ ] `quantity > 0` ve `name` bos olamaz kurallari aktif.
- [ ] `updated_at` trigger'i update islemlerinde calisiyor.
