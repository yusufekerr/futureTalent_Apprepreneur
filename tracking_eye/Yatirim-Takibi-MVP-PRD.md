# TrackingEye – Product Requirements Document (PRD)

## 1) Doküman Bilgileri
- **Ürün Adı:** TrackingEye  
- **Versiyon:** 1.0 (MVP)  
- **Aşama:** Faz 1 – MVP  
- **Platform:** Mobile (iOS / Android, cross-platform)  
- **Durum:** Draft  

## 2) Problem Tanımı
Yatırıma yeni başlayan kullanıcılar, yatırımlarını düzenli takip etmekte ve alışkanlık geliştirmekte zorlanmaktadır. Kullanıcılar; varlıklarını tek bir yerde kaydetmek, toplam birikimlerini görmek, kâr/zarar durumunu izlemek ve portföy dağılımını anlamak istemektedir.

## 3) Ürün Vizyonu ve Amacı
TrackingEye, özellikle genç ve yeni başlayan yatırımcılara yatırım alışkanlığı kazandırmayı hedefler. Ürün, kullanıcıların yatırımlarını tek ekrandan takip etmesini sağlayarak birikim farkındalığını artırır ve karar alma süreçlerini kolaylaştırır.

## 4) Hedef Kullanıcı Profili
- Yatırıma yeni başlayan bireysel yatırımcılar
- Portföyünü düzenli takip etmek isteyen kullanıcılar
- Mobilde hızlı ve basit bir deneyim arayan genç kullanıcı segmenti

## 5) Ürün Hedefleri (MVP)
1. Kullanıcının portföyüne varlık ekleyebilmesi
2. Toplam portföy değerini görebilmesi
3. Kâr/zarar bilgisinin otomatik hesaplanması
4. Varlık dağılımının görselleştirilmesi
5. Tüm kritik bilgilerin basit bir dashboard üzerinde sunulması

## 6) Kapsam

### 6.1 MVP Kapsamı (In Scope)
- Kullanıcı kaydı ve giriş (Login/Register)
- Varlık ekleme (ad, tür, adet, alış fiyatı, güncel fiyat)
- Dashboard üzerinde toplam değer ve kâr/zarar gösterimi
- Portföy detay ekranı
- Varlık dağılım grafiği (örn. pasta veya sütun grafik)

### 6.2 MVP Dışı (Out of Scope)
- Gelişmiş teknik analiz araçları
- Sosyal yatırım özellikleri
- Otomatik al/sat emri ve broker entegrasyonu
- Çok gelişmiş bildirim ve öneri motorları
- Web sürümü

## 7) Kullanıcı Hikayeleri
1. **Varlık Ekleme:**  
   Kullanıcı olarak portföyüme yeni yatırım eklemek istiyorum, böylece tüm yatırımlarımı tek yerde yönetebilirim.
2. **Toplam Değer Görüntüleme:**  
   Kullanıcı olarak toplam yatırım değerimi görmek istiyorum, böylece portföyümün genel durumunu anlayabilirim.
3. **Kâr/Zarar Takibi:**  
   Kullanıcı olarak kâr/zarar durumumu görmek istiyorum, böylece performansımı ölçebilirim.
4. **Varlık Dağılımı:**  
   Kullanıcı olarak hangi varlığa ne kadar yatırım yaptığımı görmek istiyorum, böylece dağılımımı dengeleyebilirim.
5. **Zaman İçinde Performans:**  
   Kullanıcı olarak yatırım performansımı zaman içinde takip etmek istiyorum, böylece gelişimimi izleyebilirim.

## 8) Acceptance Criteria

### US-1: Varlık Ekleme
- **Given:** Kullanıcı giriş yapmıştır  
- **When:** Varlık bilgilerini girip kaydeder  
- **Then:** Sistem varlığı portföye ekler ve dashboard verilerini günceller

### US-2: Portföy Görüntüleme
- **Given:** Kullanıcının kayıtlı varlıkları vardır  
- **When:** Kullanıcı dashboard ekranını açar  
- **Then:** Toplam portföy değeri ve kâr/zarar bilgisi gösterilir

### US-3: Performans Takibi
- **Given:** Kullanıcının portföyünde varlıklar vardır  
- **When:** Kullanıcı dashboard veya portföy detay ekranına gider  
- **Then:** Varlık dağılımı grafik olarak gösterilir

## 9) Fonksiyonel Gereksinimler
- FR-1: Sistem kullanıcı hesabı oluşturma ve giriş yapmayı desteklemelidir.
- FR-2: Kullanıcı portföye yeni varlık ekleyebilmelidir.
- FR-3: Kullanıcı varlık listesini görüntüleyebilmelidir.
- FR-4: Sistem toplam portföy değerini hesaplayıp göstermelidir.
- FR-5: Sistem varlık bazlı ve toplam kâr/zararı hesaplayıp göstermelidir.
- FR-6: Sistem portföy dağılımını grafikle gösterebilmelidir.
- FR-7: Dashboard, temel metrikleri tek ekranda sunmalıdır.

## 10) Fonksiyonel Olmayan Gereksinimler
- NFR-1: Uygulama açılışında dashboard verisi makul sürede yüklenmelidir.
- NFR-2: Arayüz sade, öğrenmesi kolay ve mobil odaklı olmalıdır.
- NFR-3: Temel kullanıcı ve portföy verileri güvenli biçimde saklanmalıdır.
- NFR-4: iOS ve Android platformlarında tutarlı deneyim sağlanmalıdır.

## 11) Ekranlar (UI/UX)
1. **Login / Register Screen**
2. **Dashboard**
   - Toplam portföy değeri
   - Kâr/zarar
   - Varlık dağılım grafiği
3. **Add Asset Screen**
4. **Portfolio Detail Screen**

## 12) Veri Modeli (MVP Önerisi)

### User
- `id`
- `email`
- `password_hash`
- `created_at`

### Asset
- `id`
- `user_id`
- `name` (örn. BTC, AAPL, XAU)
- `type` (hisse, kripto, emtia vb.)
- `quantity`
- `buy_price`
- `current_price`
- `created_at`

## 13) Başarı Metrikleri (KPIs)
- Günlük aktif kullanıcı sayısı (DAU)
- Ortalama oturum süresi
- Kullanıcı başına eklenen varlık sayısı
- Dashboard görüntüleme sıklığı

## 14) Riskler ve Varsayımlar
- **Risk:** Kullanıcıların düzenli veri girişi yapmaması alışkanlık hedefini düşürebilir.
- **Risk:** Karmaşık finans terimleri başlangıç seviyesinde kullanıcıları zorlayabilir.
- **Varsayım:** Kullanıcılar hızlı ve sade bir deneyimi gelişmiş özelliklere tercih edecektir.
- **Varsayım:** MVP’de temel metrikler, ürünün değerini doğrulamak için yeterli olacaktır.

## 15) MVP Sonrası Yol Haritası (Özet)
- Fiyat verisi otomasyonu / market data entegrasyonu
- Fiyat alarmı ve bildirimler
- Daha detaylı performans analizi
- Kategori bazlı raporlar ve hedef takibi
- Çoklu dil ve kişiselleştirilmiş deneyim

