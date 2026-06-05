# TrackingEye – Tasarım Sistemi (Design System)

Bu doküman, TrackingEye uygulamasının görsel kimliğini, tasarım kararlarını, kullanılabilir belirteçleri (tokens) ve kullanıcı arayüzü (UI) kurallarını belgelemektedir.

---

## 1. Tasarım Teması: Premium Neobank
TrackingEye, minimalist, temiz ve üst düzey finansal uygulamaların (neobank) tasarım estetiğini benimser. Canlı grafikler yerine sade geçişler, derin gölgeler, belirgin yuvarlatılmış köşeler ve yüksek okunurluk sunan koyu renk tipografi tercih edilmiştir.

Tasarım belirteçlerine kod seviyesinde [tokens.ts](file:///c:/Users/Yusuf/Desktop/futureTalent_Apprepreneur/tracking_eye/frontend/src/design/tokens.ts) dosyasından erişilebilir.

---

## 2. Renk Paleti (Color Tokens)

Uygulamanın renk kodları ve anlamları aşağıda belirtilmiştir:

```typescript
export const colors = {
  bg: "#F2F4F7",            // Açık gri/mavi neobank arka planı
  surface: "#FFFFFF",       // Kart ve panel yüzeyleri
  surfaceHighlight: "#F8FAFC",
  textPrimary: "#111827",   // Başlıklar ve gövde metinleri için yüksek kontrastlı siyah
  textSecondary: "#6B7280", // İkincil metinler ve açıklamalar
  textMuted: "#9CA3AF",     // Pasif ve devre dışı metinler
  border: "#E5E7EB",        // İnce sınır çizgileri
  primary: "#000000",       // Buton ve ana aksiyonlarda kullanılan asil siyah
  secondary: "#3B82F6",     // Vurgular ve bağlantılar için parlak mavi
  success: "#10B981",       // Pozitif kâr ve yukarı yönlü hareketler (Zümrüt Yeşili)
  danger: "#EF4444",        // Negatif zarar ve silme aksiyonları (Canlı Kırmızı)
  warning: "#F59E0B"        // Alarmlar ve uyarılar (Kehribar Sarısı)
};
```

---

## 3. Tipografi ve Boyutlar (Typography Tokens)

Uygulamada farklı hiyerarşiler için şu yazı boyutu ölçeği kullanılır:

- **H1 (Ana Başlıklar - 32px):** Portföy toplam değeri gibi devasa rakamlar ve ekran başlıkları.
- **H2 (Bölüm Başlıkları - 24px):** Kart başlıkları ve alt bölümler.
- **H3 (Alt Başlıklar - 18px):** Varlık isimleri ve liste başlıkları.
- **Body (Gövde Metni - 15px):** AI tavsiyeleri, form girdileri ve standart açıklamalar.
- **Caption (Açıklama - 13px):** Kar/zarar oranları, saatler ve küçük ipuçları.

---

## 4. Spacing (Boşluk) & Radius (Köşe Yuvarlama)

Arayüzde tutarlı bir grid düzeni ve modern bir yumuşaklık yakalamak adına belirlenmiş ölçekler:

### 4.1 Boşluk Ölçeği (Spacing Scale)
- `xs` (8px): Eleman içi sıkı boşluklar (örn: ikon-metin arası).
- `sm` (12px): Küçük bileşenlerin iç boşluğu.
- `md` (16px): Standart kart iç boşlukları ve liste elemanları arası.
- `lg` (20px): Sayfa kenar marjları (safe-area boşlukları).
- `xl` (32px): Bölümler arası geniş dikey boşluklar.

### 4.2 Köşe Yuvarlama (Border Radius Scale)
- `sm` (8px): Küçük butonlar ve etiketler.
- `md` (12px): Giriş alanları (TextInput) ve standart kartlar.
- `lg` (16px): Büyük portföy özet panelleri.
- `xl` (24px): Alt modallar ve diyalog pencereleri.
- `full` (9999px): Yuvarlak profil resimleri ve bildirim rozetleri.

---

## 5. Gölgeler & Derinlik (Shadow Tokens)

Minimalist yüzeylere derinlik kazandırmak amacıyla tanımlanmış gölge profilleri:

- **SM (Hafif Derinlik):** `shadowOpacity: 0.05`, `shadowRadius: 8` — Listelerdeki hafif yükseltilmiş satırlar için.
- **MD (Kart Derinliği):** `shadowOpacity: 0.08`, `shadowRadius: 16` — Dashboard üzerindeki ana metrik kartları için.
- **GLOW (AI Işıması):** `shadowColor: #2563EB`, `shadowOpacity: 0.3` — Yapay Zeka Danışmanı butonunda ve aktif durumlarda dikkat çekmek için kullanılan mavi ışıma.

---

## 6. Bileşen Tasarım Kuralları

1. **`Button`:** Arka planı tamamen siyah (`#000000`), metni beyaz (`#FFFFFF`) ve köşeleri `radius.md` olan premium butonlar. Aktif basılmalarda opaklık düşer.
2. **`Card`:** Beyaz zemin üzerine ince sınır çizgisi (`colors.border`) ve yumuşak gölgelerle (`shadows.sm`) tasarlanmış veri konteynerleri.
3. **`AllocationBars`:** Dairesel grafik yerine mobil ekranlarda yer kaplamayan ve hızlıca taranabilen, yatay animasyonlu yüzdelik barlar.
4. **`Input`:** Odaklanıldığında (focus) sınır rengi maviye (`colors.secondary`) dönen, hata durumunda ise kırmızı (`colors.danger`) uyarı veren form elemanları.
