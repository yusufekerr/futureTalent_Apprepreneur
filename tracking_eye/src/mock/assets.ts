import type { Asset } from "@/types/portfolio";

export const mockAssets: Asset[] = [
  {
    id: "1",
    name: "BTC",
    type: "Kripto",
    quantity: 0.12,
    buyPrice: 1_850_000,
    currentPrice: 2_050_000,
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "ASELS",
    type: "Hisse",
    quantity: 45,
    buyPrice: 52.6,
    currentPrice: 68.4,
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "XAU",
    type: "Emtia",
    quantity: 12,
    buyPrice: 2_450,
    currentPrice: 2_690,
    updatedAt: new Date().toISOString()
  }
];
