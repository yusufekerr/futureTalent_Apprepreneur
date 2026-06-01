import type { Asset } from "../types/portfolio";

// Base prices lookup for simulation baseline fallback
const BASELINE_PRICES: Record<string, number> = {
  BTC: 2350000,
  ETH: 115000,
  SOL: 5400,
  XRP: 19.5,
  ADA: 15.2,
  USD: 33.25,
  EUR: 36.12,
  GBP: 42.45,
  ASELS: 64.80,
  THYAO: 312.50,
  EREGL: 52.40,
  TUPRS: 168.20,
  XAU: 2480, // Gold per gram
  XAG: 31.80, // Silver per gram
  TECD: 145.60 // A popular fund
};

// CoinGecko API Mapping
const COINGECKO_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano"
};

type CoinGeckoResponse = Record<string, { try: number }>;

/**
 * Fetches real crypto prices from CoinGecko or falls back to simulation
 */
async function fetchRealCryptoPrices(): Promise<Record<string, number>> {
  try {
    const ids = Object.values(COINGECKO_MAP).join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=try`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as CoinGeckoResponse;
    
    const prices: Record<string, number> = {};
    for (const [symbol, id] of Object.entries(COINGECKO_MAP)) {
      if (data[id]?.try) {
        prices[symbol] = data[id].try;
      }
    }
    return prices;
  } catch (error) {
    console.warn("CoinGecko API call failed, falling back to simulated crypto prices:", error);
    return {};
  }
}

/**
 * Simulates a market price change for a given asset.
 * If the asset has a non-zero current price, it fluctuates around that price.
 * Otherwise, it uses the baseline index price.
 */
export function simulatePriceFluctuation(symbol: string, currentPrice: number): number {
  const basePrice = BASELINE_PRICES[symbol.toUpperCase()] || 100;
  const startingPrice = currentPrice > 0 ? currentPrice : basePrice;
  
  // Random percentage fluctuation between -2.0% and +2.0%
  const fluctuationPercent = (Math.random() * 4 - 2) / 100;
  const nextPrice = startingPrice * (1 + fluctuationPercent);
  
  // Format to 2 decimal places and ensure it's not zero or negative
  return Math.max(0.01, Number(nextPrice.toFixed(2)));
}

/**
 * Main service function to update all assets with latest prices
 */
export async function getUpdatedPrices(assets: Asset[]): Promise<Record<string, number>> {
  const updatedPrices: Record<string, number> = {};
  
  // 1. Fetch real-time crypto prices
  const cryptoPrices = await fetchRealCryptoPrices();
  
  // 2. Loop through assets and determine the new price
  for (const asset of assets) {
    const symbol = asset.name.toUpperCase();
    
    if (asset.type === "Kripto" && cryptoPrices[symbol]) {
      // Use real-time price fetched from CoinGecko
      updatedPrices[asset.id] = cryptoPrices[symbol];
    } else {
      // Use premium simulation fluctuation for other assets (stocks, FX, etc.) or fallback
      updatedPrices[asset.id] = simulatePriceFluctuation(symbol, asset.currentPrice);
    }
  }
  
  return updatedPrices;
}
