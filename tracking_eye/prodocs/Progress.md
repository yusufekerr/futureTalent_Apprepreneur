# TrackingEye – Geliştirme Günlüğü (Progress Log)

Bu dokümanda, TrackingEye projesinin başlangıcından teslim aşamasına kadar olan geliştirme serüveni, tamamlanan fazlar, alınan kritik kararlar ve çözülen teknik problemler kayıt altında tutulmaktadır.

---

## 1. Tamamlanan Geliştirme Fazları

### Faz 1 – Proje İskelesi & Temel Yapı
- **Yapılanlar:** Expo + TypeScript + Expo Router entegrasyonu tamamlandı. Kod kalitesi için ESLint ve Prettier ayarlandı.
- **Supabase Entegrasyonu:** `src/lib/supabase.ts` üzerinden istemci oluşturuldu. Supabase SQL migration (`001_init_tracking_eye.sql`) yazıldı.
- **Karar:** Veritabanındaki `assets` tablosunda verilerin kullanıcıya özel kalması için RLS (Row Level Security) politikaları en baştan aktif edildi.

### Faz 2 – Supabase Auth & Kimlik Doğrulama
- **Yapılanlar:** `AuthContext.tsx` oluşturuldu. `signInWithPassword`, `signUp`, `signOut` fonksiyonları yazıldı. Cihazda kalıcı oturum için `AsyncStorage` kullanıldı.
- **Yönlendirme (Routing):** Giriş yapmayan kullanıcılar otomatik `/login` ekranına, giriş yapanlar ise `/dashboard` ekranına yönlendirildi.
- **Hata Yönetimi:** Supabase tarafından dönen İngilizce hata kodları, kullanıcı deneyimini iyileştirmek için `src/utils/errors.ts` dosyasında Türkçe hata mesajlarına dönüştürüldü.

### Faz 3 – Varlık (Asset) Yönetimi & CRUD
- **Yapılanlar:** Portföye varlık ekleme, listeleme, silme ve anlık fiyat güncelleme işlevleri yazıldı. Merkezi durum yönetimi `PortfolioContext.tsx` ile sağlandı.
- **Güvenlik:** Veritabanı sorgularının RLS politikalarına takılmaması için tüm kayıtlara `user_id` kolonu Supabase Auth'tan okunarak güvenli bir şekilde eklendi.

### Faz 4 – Dashboard & Arayüz Cilalama
- **Yapılanlar:** Toplam portföy değeri, yatırılan maliyet, toplam net kar/zarar ve yüzde getiri metrikleri dinamik hesaplanacak şekilde dashboard ekranına eklendi.
- **Görselleştirme:** Portföy varlık dağılımını gösteren, ağır kütüphanelere bağımlı olmayan minimalist `AllocationBars` bileşeni geliştirildi.

### Faz 5 – Portföy ve Varlık Detay Ekranları
- **Yapılanlar:** Kullanıcının varlıklarını tek tek inceleyebileceği `app/asset/[id].tsx` detay ekranı yapıldı. Fiyat güncelleme ve varlık silme işlemleri bu ekrana bağlandı.

### Faz 6 – Kalite Kontrolü & Testler (Vitest)
- **Yapılanlar:** Portföy değerlerini hesaplayan kritik fonksiyonların doğruluğunu garanti altına almak için `src/utils/portfolio.test.ts` testi Vitest ile yazıldı.
- **Detay:** Sıfır varlık durumu, negatif kâr/zarar ve küsuratlı adet durumları birim testlerle sınandı. `FAZ6_KALITE_CHECKLIST.md` manuel test listesi oluşturuldu.

### Faz 7 – MVP Sonrası Gelişmiş Özellikler
- **Fiyat Otomasyonu:** CoinGecko API entegrasyonu yapıldı. API limitlerine takılmamak adına bir simülasyon motoru yedek olarak eklendi.
- **Alarm Bildirimleri:** `supabase/migrations/005_create_price_alerts.sql` ile fiyat alarmları tablosu eklendi. Belirlenen hedefe ulaşıldığında dashboard'da uyarı tetiklenmesi sağlandı.
- **Performans Grafiği (Zaman Serisi):** Portföy geçmişini izlemek için `portfolio_snapshots` tablosu (`004_create_portfolio_snapshots.sql`) eklenerek zaman serisi grafiği (`HistoryChart`) entegre edildi.

### Faz 8 – Klasör Yapısı & Brief Uyumu (Şu anki Faz)
- **Yapılanlar:** Brief gereksinimlerine göre klasör yapısı kökten düzenlendi. Tüm mobil arayüz kodları `/frontend` altına, Supabase backend sql kodları ise `/backend/supabase` altına taşındı.
- **Dökümantasyon:** `tech-stack.md`, `DesignSystem.md` ve `Progress.md` zorunlu dökümanları oluşturularak `/prodocs` altına yerleştirildi. Eski isimli dökümanlar brief standartlarına göre yeniden adlandırıldı (`PRD.md` ve `Plan.md`).

---

## 2. Alınan Kritik Teknik Kararlar ve Çözümleri

### Sorun: Canlı Gemini API Kota ve Bağlantı Hataları
- **Karar:** Canlı yapay zeka bağlantısında hata olması durumunda uygulamanın kilitlenmesini engellemek için `src/services/ai.ts` dosyasında bir "Offline Fallback" yapısı geliştirilmiştir.
- **Çözüm:** Kullanıcı internete bağlı değilse veya API Key girmemişse, portföy dağılımına bakarak yerelde çalışan kural motoru (`generateOfflineResponse`) çalışır ve risk uyarısı üretir.

### Sorun: Windows Üzerinde Çok Derin Klasörlerin Taşınması (node_modules)
- **Karar:** Klasör yapısını taşırken `node_modules` içerisindeki çok derin dosya yolları Windows dosya sistemi sınırı (MAX_PATH) ve IDE kilitleri nedeniyle hata verdi.
- **Çözüm:** Eski `node_modules` tamamen kaldırılarak temizlendi. Klasör taşıma işlemi sorunsuz yapıldıktan sonra `/frontend` klasörü altında temiz bir `npm install` tetiklenecek şekilde plan güncellendi.
