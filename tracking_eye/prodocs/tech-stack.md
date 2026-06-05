# TrackingEye – Teknoloji Yığını (Tech Stack)

Bu doküman, TrackingEye projesinde tercih edilen teknolojileri, kütüphaneleri, servis seçimlerinin gerekçelerini ve geliştirme sürecinde yapay zekanın (AI) nasıl kullanıldığını açıklamaktadır.

---

## 1. Genel Teknoloji Seçimleri

TrackingEye, modern bir mobil yatırım takip uygulaması olarak tasarlanmıştır. Bu doğrultuda seçilen temel bileşenler şunlardır:

### 1.1 Frontend: Expo & React Native (TypeScript)
- **Gerekçe:** 
  - **Cross-Platform:** Tek bir kod tabanından hem iOS hem de Android uygulamaları üretmek amacıyla tercih edilmiştir.
  - **Expo Hızı:** Proje iskelesini kurma, paketleri yönetme ve cihaz testlerini (Expo Go) hızlıca yürütme avantajı sağlar.
  - **TypeScript:** Tip güvenliği (Type-safety) sağlayarak runtime hatalarını en aza indirir ve veri modellerini (Asset, User, Snapshot vb.) güvenli kılmaktadır.
  - **Expo Router:** Dosya tabanlı (File-based) rota yönetimini (Tabs ve Stack navigation) oldukça basitleştirerek mobil yönlendirme süreçlerini kolaylaştırır.

### 1.2 Backend (BaaS): Supabase
- **Gerekçe:**
  - **Hazır Veritabanı ve API:** SQL veritabanı (PostgreSQL) barındırır ve istemci tarafında doğrudan kullanılabilecek güvenli REST API'ler üretir.
  - **Supabase Auth:** Oturum yönetimi, kullanıcı kayıt ve giriş işlemlerini (Email/Şifre) efor sarf etmeden entegre etmemizi sağlar.
  - **Row Level Security (RLS):** Veritabanı seviyesinde güvenlik sunarak her kullanıcının sadece kendi portföy ve alarm verilerini görmesini garanti eder.

### 1.3 Yapay Zeka (AI/LLM) Entegrasyonu: Google Gemini API
- **Gerekçe:**
  - **Gemini 2.5 Flash:** Düşük gecikme süresi, yüksek token limiti ve zengin analiz kabiliyetleri nedeniyle çekirdek yapay zeka danışmanı olarak seçilmiştir.
  - **Neobank Tarzı Formatlama:** Gemini API'ye verilen sistem yönergeleri sayesinde finansal verileri markdown formatında, görsel uyarı kutularıyla (> [!NOTE], > [!WARNING]) süsleyerek premium bir sunum sağlar.
  - **Çevrimdışı Simülatör Desteği:** Kullanıcı API Key girmemiş olsa veya canlı bağlantıda hata yaşansa dahi, offline çalışan bir kural tabanlı motor devreye girerek kesintisiz bir deneyim sunar.

### 1.4 Test Altyapısı: Vitest
- **Gerekçe:**
  - Vitest, modern JavaScript/TypeScript projeleri için tasarlanmış, çok hızlı çalışan ve Jest API'leriyle tam uyumlu bir test kütüphanesidir. Matematiksel portföy hesaplama fonksiyonlarının doğruluğunu test etmek amacıyla kullanılmıştır.

---

## 2. Kütüphaneler ve Bağımlılıklar

Projenin `package.json` bağımlılıkları ve kullanım amaçları şunlardır:

| Kütüphane | Sürüm | Kullanım Amacı |
| :--- | :--- | :--- |
| `@supabase/supabase-js` | `^2.49.4` | Supabase veritabanı, auth ve RLS politikaları ile haberleşme istemcisi. |
| `@react-native-async-storage/async-storage` | `^2.1.2` | Supabase oturum bilgilerini ve Gemini API Key'ini cihazda kalıcı saklama. |
| `expo-linear-gradient` | `~14.1.5` | Neobank arayüzündeki premium geçişli arka planları oluşturma. |
| `expo-router` | `^5.0.5` | Dosya yapısına bağlı sayfa yönlendirmesi. |
| `vitest` | `^4.1.7` | Matematiksel birim (unit) testlerini çalıştırma. |

---

## 3. Geliştirme Sürecinde AI (Yapay Zeka) Kullanımı

TrackingEye geliştirilirken yapay zeka ajanlarından ve kod asistanlarından yoğun bir şekilde faydalanılmıştır. Alınan tasarım ve geliştirme kararlarında AI'ın rolleri şunlardır:

1. **Veritabanı Şemaları ve Güvenlik:** Supabase üzerindeki RLS (Row Level Security) politikalarının ve birleşik indexlerin oluşturulmasında AI asistanları kullanılmıştır.
2. **Offline/Online Hibrit Tasarım:** Gemini API bağlantısının kopması veya anahtarın girilmemesi durumunda kullanıcıyı hatayla karşılaştırmak yerine çalışan bir `offline-fallback` mekanizması kurgulanmasında AI mimari fikirleri uygulanmıştır.
3. **Birim Testleri Yazımı:** `portfolio.ts` içerisindeki kar/zarar hesaplama, yüzdelik hesaplama ve toplam değer fonksiyonları için Vitest senaryoları AI desteğiyle yazılmış ve %100 kapsayıcılık sağlanmıştır.
