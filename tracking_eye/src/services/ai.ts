import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Asset } from "../types/portfolio";

export type ChatMessage = {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
};

const API_KEY_STORAGE_KEY = "tracking_eye_gemini_api_key";

/**
 * Saves the custom user Gemini API Key to local storage
 */
export async function saveApiKey(key: string): Promise<void> {
  if (!key || key.trim() === "") {
    await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
  } else {
    await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  }
}

/**
 * Retrieves the Gemini API Key from local storage or environment variables
 */
export async function getApiKey(): Promise<string | null> {
  const customKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
  if (customKey) return customKey;

  // Fallback to Expo environment variable if set
  return process.env.EXPO_PUBLIC_GEMINI_API_KEY || null;
}

/**
 * Generates an offline fallback response based on portfolio metrics when no API key is set
 */
export function generateOfflineResponse(
  prompt: string,
  portfolioData: {
    assets: Asset[];
    metrics: { totalValue: number; totalCost: number; totalPnL: number; pnlPercent: number };
    distribution: Array<{ id: string; label: string; type: string; value: number; ratio: number }>;
  }
): string {
  const { assets, metrics, distribution } = portfolioData;
  const p = prompt.toLowerCase();

  // Disclaimer header
  const disclaimer = `> [!NOTE]\n> **Yasal Uyarı:** Burada yer alan bilgiler yatırım danışmanlığı kapsamında değildir. Çevrimdışı simülasyon modunda çalışmaktasınız.\n\n`;

  // 1. If portfolio is empty
  if (assets.length === 0) {
    return (
      disclaimer +
      `### Portföyünüz Boş Görünüyor 📊\n\n` +
      `Şu anda portföyünüzde takip edilen herhangi bir varlık bulunmamaktadır. AI analizi yapabilmem için öncelikle **"Ekle"** sekmesinden varlıklarınızı (Hisse Senedi, Kripto, Emtia, Fon, Döviz) eklemeniz gerekmektedir.\n\n` +
      `**Gemini AI Entegrasyonu Nasıl Aktif Edilir?**\n` +
      `1. [Google AI Studio](https://aistudio.google.com/) adresinden **ücretsiz** bir Gemini API anahtarı alın.\n` +
      `2. Bu ekranın sağ üstündeki **Ayarlar** (dişli) ikonuna tıklayın.\n` +
      `3. Kopyaladığınız anahtarı yapıştırıp kaydedin. Bu sayede canlı yapay zeka analizleri alabilirsiniz!`
    );
  }

  // 2. Risk analysis response
  if (p.includes("risk") || p.includes("ölç") || p.includes("analiz")) {
    const cryptoRatio = distribution.find((d) => d.type === "Kripto")?.ratio || 0;
    const stockRatio = distribution.find((d) => d.type === "Hisse")?.ratio || 0;
    const commodityRatio = distribution.find((d) => d.type === "Emtia")?.ratio || 0;

    let riskLevel = "Orta Risk";
    let riskDesc = "Portföyünüz dengeli bir risk dağılımına sahip görünüyor.";

    if (cryptoRatio > 50) {
      riskLevel = "Yüksek Risk 🚨";
      riskDesc = `Portföyünüzün **%${cryptoRatio.toFixed(1)}** gibi büyük bir kısmı **Kripto** varlıklarda bulunuyor. Kripto piyasaları yüksek volatiliteye sahip olduğu için sert düşüşlere karşı hassastır.`;
    } else if (stockRatio > 60) {
      riskLevel = "Yüksek / Orta Risk 📈";
      riskDesc = `Portföyünüzün **%${stockRatio.toFixed(1)}** kadarı **Hisse Senedi** ağırlıklı. Şirket ve sektör risklerini azaltmak için döviz veya emtia (altın) ile çeşitlendirme düşünebilirsiniz.`;
    } else if (commodityRatio > 50) {
      riskLevel = "Düşük Risk / Defansif 🛡️";
      riskDesc = `Portföyünüzün **%${commodityRatio.toFixed(1)}** kadarı **Emtia/Altın** ağırlıklı. Bu, enflasyona karşı koruyucu ancak yüksek büyüme potansiyeli sınırlı, oldukça güvenli bir limandır.`;
    }

    return (
      disclaimer +
      `### Portföy Risk Değerlendirmesi: **${riskLevel}**\n\n` +
      `${riskDesc}\n\n` +
      `**Metrikler:**\n` +
      `- **Toplam Değer:** ${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(metrics.totalValue)}\n` +
      `- **Net Kâr/Zarar:** ${metrics.totalPnL >= 0 ? "+" : ""}${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(metrics.totalPnL)} (%${metrics.pnlPercent.toFixed(2)})\n` +
      `- **Varlık Sayısı:** ${assets.length} farklı varlık\n\n` +
      `**Öneri:** Portföyünüzün oynaklığını azaltmak için tek bir varlık grubuna bağımlı kalmamaya çalışın. Varlıklarınızı hisse senedi, altın (emtia) ve döviz arasında bölüştürmek riskinizi optimize edecektir.`
    );
  }

  // 3. Diversification/diversify advice response
  if (p.includes("çeşit") || p.includes("öneri") || p.includes("tavsiye")) {
    const types = Array.from(new Set(assets.map((a) => a.type)));
    const suggestionList: string[] = [];

    if (types.length <= 2) {
      suggestionList.push(`- **Sınırlı Çeşitlilik:** Şu anda yalnızca ${types.length} farklı varlık türüne sahipsiniz. Risk dağılımı için en az 3 farklı varlık grubuna (örn: Hisse + Emtia + Döviz) yayılmanızı öneririm.`);
    } else {
      suggestionList.push(`- **İyi Çeşitlilik:** ${types.length} farklı varlık grubunda yatırımınız var. Çeşitlendirme seviyeniz oldukça sağlıklı.`);
    }

    const maxAlloc = distribution[0];
    if (maxAlloc && maxAlloc.ratio > 40) {
      suggestionList.push(`- **Aşırı Yoğunlaşma Uyarısı:** En büyük varlığınız olan **${maxAlloc.label}**, portföyünüzün **%${maxAlloc.ratio.toFixed(1)}**'ini kaplıyor. Bu varlıktaki olası bir düşüş portföyünüzü derinden etkileyebilir.`);
    }

    return (
      disclaimer +
      `### AI Çeşitlendirme Önerileri 🧩\n\n` +
      `Portföyünüzün mevcut dağılımı analiz edildiğinde öne çıkan detaylar şunlardır:\n\n` +
      suggestionList.join("\n") +
      `\n\n` +
      `**İdeal Portföy Dağılım Modeli (Dengeli):**\n` +
      `- **%30 - Hisse Senedi:** Uzun vadeli büyüme ve temettü potansiyeli için.\n` +
      `- **%25 - Emtia (Altın/Gümüş):** Enflasyon koruması ve küresel kriz sigortası.\n` +
      `- **%20 - Döviz / Nakit / Fon:** Fırsat anlarında nakit gücü ve likidite.\n` +
      `- **%15 - Kripto Para:** Yüksek büyüme ve risk toleranslı dinamik varlıklar.\n` +
      `- **%10 - Eurobond / Devlet Tahvili:** Düzenli sabit getiri için.\n\n` +
      `*Portföyünüzü bu oranlara yakınlaştırmak piyasa şoklarına karşı daha dirençli olmanızı sağlayabilir.*`
    );
  }

  // 4. Default Analysis or any other prompt
  const positivePnL = metrics.totalPnL >= 0;
  return (
    disclaimer +
    `### Portföy Durum Analizi 📈\n\n` +
    `Mevcut portföyünüz toplam **${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(metrics.totalValue)}** büyüklüğündedir. ` +
    `Yatırım maliyetiniz ${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(metrics.totalCost)} olup, ` +
    `toplam kâr/zarar durumunuz **${positivePnL ? "+" : ""}${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(metrics.totalPnL)} (%${metrics.pnlPercent.toFixed(2)})** seviyesindedir.\n\n` +
    `**Dağılım Özeti:**\n` +
    distribution.map((d) => `- **${d.label}** (${d.type}): %${d.ratio.toFixed(1)} (${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(d.value)})`).join("\n") +
    `\n\n` +
    `*Yapay zekanın bu verileri daha detaylı inceleyebilmesi ve güncel piyasa koşullarına göre yorum yapabilmesi için sağ üstten **Gemini API Key** tanımlaması yapabilirsiniz.*`
  );
}

/**
 * Call real Gemini API to analyze the portfolio
 */
export async function generateAIResponse(
  messages: ChatMessage[],
  portfolioData: {
    assets: Asset[];
    metrics: { totalValue: number; totalCost: number; totalPnL: number; pnlPercent: number };
    distribution: Array<{ id: string; label: string; type: string; value: number; ratio: number }>;
  }
): Promise<string> {
  const apiKey = await getApiKey();

  const lastUserMessage = messages[messages.length - 1]?.content || "Genel analiz yap";

  if (!apiKey) {
    // Return offline mock response if key is missing
    return generateOfflineResponse(lastUserMessage, portfolioData);
  }

  const { assets, metrics, distribution } = portfolioData;

  // Prepare system context prompt
  const systemContext = `
Sen TrackingEye isimli neobank tarzı, şık ve mobil yatırım takip uygulamasının yapay zeka finansal danışmanısın.
Görevin kullanıcının mevcut portföyünü incelemek, yatırım alışkanlıklarını geliştirmesine destek olmak ve finansal farkındalığı artırmaktır.

Kullanıcının Portföy Verileri:
- Toplam Değer: ${metrics.totalValue.toFixed(2)} TRY
- Toplam Maliyet: ${metrics.totalCost.toFixed(2)} TRY
- Toplam Net Kâr/Zarar: ${metrics.totalPnL.toFixed(2)} TRY (${metrics.pnlPercent.toFixed(2)}%)
- Sahip Olunan Varlıklar: ${JSON.stringify(
    assets.map((a) => ({
      adı: a.name,
      türü: a.type,
      miktarı: a.quantity,
      alışFiyatı: a.buyPrice,
      güncelFiyatı: a.currentPrice,
      toplamDeğeri: a.quantity * a.currentPrice,
      pnl: (a.currentPrice - a.buyPrice) * a.quantity
    }))
  )}
- Portföy Dağılımı (Yüzdeler): ${JSON.stringify(
    distribution.map((d) => ({
      ad: d.label,
      tür: d.type,
      oran: d.ratio.toFixed(2) + "%",
      tutar: d.value.toFixed(2) + " TRY"
    }))
  )}

Önemli Kurallar:
1. Kesinlikle doğrudan "şu hisseyi alın", "bunu satın" gibi resmi yatırım tavsiyesi verme. Yanıtlarında "Burada yer alan bilgiler yatırım danışmanlığı kapsamında değildir..." yasal uyarısını şık bir şekilde (tercihen en altta veya bir blok halinde) ekle.
2. Yanıtını tamamen Türkçe yaz. Sade, samimi ama profesyonel, neobank uygulamasına yakışır modern bir dil kullan.
3. Markdown formatını çok iyi kullan. Başlıklar, listeler, kalın yazılar ve GitHub stili alert kutuları (> [!NOTE], > [!WARNING], > [!TIP]) ekleyerek görsel zenginlik oluştur.
4. Kullanıcıya net, anlaşılır ve eyleme dökülebilir tavsiyeler ver. Örneğin çeşitlendirme eksikse bunu vurgula, kâr durumu iyiyse rebalance (yeniden dengeleme) öner.
  `;

  // We map the conversation history for Gemini API.
  // Gemini 1.5 chat structure:
  // contents: [{ role: 'user', parts: [{ text: '...' }] }, { role: 'model', parts: [{ text: '...' }] }]
  // Note: the system instructions can be passed as systemInstruction in the request body for Gemini 1.5.

  const contents = [
    // Include user chat history
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }))
  ];

  // If there are no messages, add the user prompt
  if (contents.length === 0) {
    contents.push({
      role: "user",
      parts: [{ text: lastUserMessage }]
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: systemContext }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Response:", errText);
      throw new Error(`API Hatası (Kod: ${response.status})`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error("Yapay zeka boş yanıt döndürdü.");
    }

    return reply;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.warn("Gemini API failed, falling back to offline simulation engine:", error);
    return (
      `> [!WARNING]\n> Canlı Gemini API bağlantısı başarısız oldu. Hata: ${errMessage}\n> Geçici olarak Çevrimdışı Simülatör Moduna geçildi.\n\n` +
      generateOfflineResponse(lastUserMessage, portfolioData)
    );
  }
}

/**
 * Returns a brief one-sentence AI insight for the dashboard widget
 */
export function getQuickDashboardInsight(
  assets: Asset[],
  distribution: Array<{ id: string; label: string; type: string; value: number; ratio: number }>,
  metrics: { totalValue: number; totalCost: number; totalPnL: number; pnlPercent: number }
): string {
  if (assets.length === 0) {
    return "Portföyünüz henüz boş. Yatırımlarınızı ekleyerek yapay zeka analizini başlatın.";
  }

  const cryptoRatio = distribution.find((d) => d.type === "Kripto")?.ratio || 0;
  const stockRatio = distribution.find((d) => d.type === "Hisse")?.ratio || 0;
  const commodityRatio = distribution.find((d) => d.type === "Emtia")?.ratio || 0;

  if (cryptoRatio > 55) {
    return `🚨 Portföyünüz yüksek volatiliteye sahip kripto ağırlıklıdır (%${cryptoRatio.toFixed(0)}). Risk dengesi için emtia veya döviz düşünebilirsiniz.`;
  }

  if (stockRatio > 60) {
    return `📈 Portföyünüz %${stockRatio.toFixed(0)} oranında hisse senedi ağırlıklıdır. Olası piyasa düzeltmelerine karşı emtia ekleyerek riskinizi azaltabilirsiniz.`;
  }

  if (commodityRatio > 50) {
    return `🛡️ Portföyünüz defansif emtia ağırlıklıdır (%${commodityRatio.toFixed(0)}). Getiri potansiyelini artırmak için kontrollü hisse yatırımı düşünebilirsiniz.`;
  }

  if (metrics.totalPnL < 0 && Math.abs(metrics.pnlPercent) > 5) {
    return `📉 Portföyünüzde kâr/zarar eksidedir (%${metrics.pnlPercent.toFixed(1)}). Fiyatı düşen varlıklarda maliyet düşürmek (DCA) için uygun seviyeleri inceleyebilirsiniz.`;
  }

  return "✨ Portföy dağılımınız dengeli görünüyor. Risk oranlarını korumak için AI Danışman sekmesinden detaylı rebalance önerisi alabilirsiniz.";
}

