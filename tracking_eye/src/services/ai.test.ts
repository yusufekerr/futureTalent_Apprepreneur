import { describe, expect, it } from "vitest";

import type { Asset } from "../types/portfolio";
import { generateOfflineResponse, getQuickDashboardInsight } from "./ai";

describe("AI Offline Assistant Engine", () => {
  const mockMetrics = {
    totalValue: 10000,
    totalCost: 9000,
    totalPnL: 1000,
    pnlPercent: 11.11
  };

  const mockDistribution = [
    { id: "1", label: "BTC", type: "Kripto", value: 6000, ratio: 60 },
    { id: "2", label: "ASELS", type: "Hisse", value: 3000, ratio: 30 },
    { id: "3", label: "XAU", type: "Emtia", value: 1000, ratio: 10 }
  ];

  const mockAssets: Asset[] = [
    {
      id: "1",
      name: "BTC",
      type: "Kripto",
      quantity: 0.1,
      buyPrice: 50000,
      currentPrice: 60000,
      updatedAt: "2026-06-01T00:00:00Z"
    },
    {
      id: "2",
      name: "ASELS",
      type: "Hisse",
      quantity: 50,
      buyPrice: 55,
      currentPrice: 60,
      updatedAt: "2026-06-01T00:00:00Z"
    },
    {
      id: "3",
      name: "XAU",
      type: "Emtia",
      quantity: 1,
      buyPrice: 900,
      currentPrice: 1000,
      updatedAt: "2026-06-01T00:00:00Z"
    }
  ];

  it("returns guide to add assets if portfolio is empty", () => {
    const result = generateOfflineResponse("Portföyümü analiz et", {
      assets: [],
      metrics: { totalValue: 0, totalCost: 0, totalPnL: 0, pnlPercent: 0 },
      distribution: []
    });

    expect(result).toContain("Portföyünüz Boş Görünüyor");
    expect(result).toContain("Google AI Studio");
  });

  it("handles risk analysis request correctly pointing out high crypto concentration", () => {
    const result = generateOfflineResponse("Risk analizi yap", {
      assets: mockAssets,
      metrics: mockMetrics,
      distribution: mockDistribution
    });

    expect(result).toContain("Yüksek Risk");
    expect(result).toContain("Kripto");
    expect(result).toContain("volatilite");
  });

  it("handles diversification suggestion request correctly pointing out portfolio limits", () => {
    const result = generateOfflineResponse("Çeşitlendirme önerisi ver", {
      assets: mockAssets,
      metrics: mockMetrics,
      distribution: mockDistribution
    });

    expect(result).toContain("Çeşitlendirme");
    expect(result).toContain("Aşırı Yoğunlaşma Uyarısı");
  });

  it("renders default overview analysis correctly", () => {
    const result = generateOfflineResponse("Merhaba ne yapayım?", {
      assets: mockAssets,
      metrics: mockMetrics,
      distribution: mockDistribution
    });

    expect(result).toContain("Durum Analizi");
    expect(result).toContain("₺10.000,00");
  });
});

describe("AI Dashboard Quick Insight Generator", () => {
  it("shows empty state warning if no assets", () => {
    const insight = getQuickDashboardInsight([], [], { totalValue: 0, totalCost: 0, totalPnL: 0, pnlPercent: 0 });
    expect(insight).toContain("boş");
  });

  it("warns about high crypto ratio", () => {
    const dist = [{ id: "1", label: "BTC", type: "Kripto", value: 800, ratio: 80 }];
    const insight = getQuickDashboardInsight(
      [
        {
          id: "1",
          name: "BTC",
          type: "Kripto",
          quantity: 1,
          buyPrice: 800,
          currentPrice: 800,
          updatedAt: ""
        }
      ],
      dist,
      { totalValue: 800, totalCost: 800, totalPnL: 0, pnlPercent: 0 }
    );

    expect(insight).toContain("yüksek volatiliteye sahip kripto ağırlıklıdır");
  });

  it("warns about high stock ratio", () => {
    const dist = [{ id: "1", label: "ASELS", type: "Hisse", value: 700, ratio: 70 }];
    const insight = getQuickDashboardInsight(
      [
        {
          id: "1",
          name: "ASELS",
          type: "Hisse",
          quantity: 1,
          buyPrice: 700,
          currentPrice: 700,
          updatedAt: ""
        }
      ],
      dist,
      { totalValue: 700, totalCost: 700, totalPnL: 0, pnlPercent: 0 }
    );

    expect(insight).toContain("hisse senedi ağırlıklıdır");
  });
});
