export type AssetType = "Hisse" | "Kripto" | "Emtia" | "Fon" | "Döviz";

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  updatedAt: string;
};

export type AssetDraft = Omit<Asset, "id" | "updatedAt">;

export type PortfolioSnapshot = {
  id: string;
  totalValue: number;
  totalCost: number;
  recordedAt: string;
};

export type PriceAlert = {
  id: string;
  assetName: string;
  targetPrice: number;
  condition: "above" | "below";
  isTriggered: boolean;
  createdAt: string;
};

export type PriceAlertDraft = Omit<PriceAlert, "id" | "isTriggered" | "createdAt">;

export type TransactionType = "ADD" | "REMOVE" | "UPDATE" | "SYNC";

export type Transaction = {
  id: string;
  type: TransactionType;
  assetName: string;
  quantity?: number;
  price?: number;
  timestamp: string;
};
