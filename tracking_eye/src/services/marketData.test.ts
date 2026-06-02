import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import type { Asset } from "../types/portfolio";
import { getUpdatedPrices, simulatePriceFluctuation } from "./marketData";

describe("market data simulation", () => {
  it("fluctuates within -2% and +2% range of starting price", () => {
    const startPrice = 100;
    const nextPrice = simulatePriceFluctuation("ASELS", startPrice);
    
    // Max decrease: 100 * 0.98 = 98
    // Max increase: 100 * 1.02 = 102
    expect(nextPrice).toBeGreaterThanOrEqual(97.9);
    expect(nextPrice).toBeLessThanOrEqual(102.1);
  });

  it("uses baseline price if starting price is 0 or negative", () => {
    const nextPrice = simulatePriceFluctuation("USD", 0);
    // Baseline for USD is 33.25. So fluctuation is on 33.25
    expect(nextPrice).toBeGreaterThanOrEqual(33.25 * 0.979);
    expect(nextPrice).toBeLessThanOrEqual(33.25 * 1.021);
  });

  it("returns default fallback if asset symbol is unknown", () => {
    const nextPrice = simulatePriceFluctuation("UNKNOWN_SYMBOL", 0);
    // Baseline for unknown is 100
    expect(nextPrice).toBeGreaterThanOrEqual(97.9);
    expect(nextPrice).toBeLessThanOrEqual(102.1);
  });
});

describe("market data fetch and update mapping", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              bitcoin: { try: 2350000 },
              ethereum: { try: 115000 }
            })
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps new simulated prices correctly to asset array", async () => {
    const assets: Asset[] = [
      {
        id: "a1",
        name: "ASELS",
        type: "Hisse",
        quantity: 10,
        buyPrice: 50,
        currentPrice: 60,
        updatedAt: "2026-01-01T00:00:00.000Z"
      },
      {
        id: "a2",
        name: "USD",
        type: "Döviz",
        quantity: 100,
        buyPrice: 32,
        currentPrice: 33,
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ];

    const result = await getUpdatedPrices(assets);
    
    expect(result).toHaveProperty("a1");
    expect(result).toHaveProperty("a2");
    expect(result.a1).toBeGreaterThan(0);
    expect(result.a2).toBeGreaterThan(0);
  });
});
