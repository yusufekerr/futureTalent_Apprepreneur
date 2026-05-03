import type { Asset } from "@/types/portfolio";

export function getAssetValue(asset: Asset): number {
  return asset.quantity * asset.currentPrice;
}

export function getAssetCost(asset: Asset): number {
  return asset.quantity * asset.buyPrice;
}

export function getAssetPnL(asset: Asset): number {
  return getAssetValue(asset) - getAssetCost(asset);
}

export function getPortfolioMetrics(assets: Asset[]) {
  const totalValue = assets.reduce((sum, item) => sum + getAssetValue(item), 0);
  const totalCost = assets.reduce((sum, item) => sum + getAssetCost(item), 0);
  const totalPnL = totalValue - totalCost;
  const pnlPercent = totalCost === 0 ? 0 : (totalPnL / totalCost) * 100;

  return {
    totalValue,
    totalCost,
    totalPnL,
    pnlPercent
  };
}

export function getDistribution(assets: Asset[]) {
  const { totalValue } = getPortfolioMetrics(assets);
  if (totalValue === 0) {
    return [];
  }

  return assets
    .map((asset) => ({
      id: asset.id,
      label: asset.name,
      type: asset.type,
      value: getAssetValue(asset),
      ratio: (getAssetValue(asset) / totalValue) * 100
    }))
    .sort((a, b) => b.value - a.value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
