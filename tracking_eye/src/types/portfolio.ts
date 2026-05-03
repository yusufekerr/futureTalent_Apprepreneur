export type AssetType = "Hisse" | "Kripto" | "Emtia" | "Fon" | "Doviz";

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
