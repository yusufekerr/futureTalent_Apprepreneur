import { describe, expect, it } from "vitest";

import type { Asset } from "../types/portfolio";
import { getDistribution, getPortfolioMetrics } from "./portfolio";

const sampleAssets: Asset[] = [
  {
    id: "a1",
    name: "BTC",
    type: "Kripto",
    quantity: 2,
    buyPrice: 100,
    currentPrice: 150,
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "a2",
    name: "ASELS",
    type: "Hisse",
    quantity: 10,
    buyPrice: 20,
    currentPrice: 10,
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("portfolio metrics", () => {
  it("calculates total value, cost and pnl correctly", () => {
    const metrics = getPortfolioMetrics(sampleAssets);

    expect(metrics.totalValue).toBe(400);
    expect(metrics.totalCost).toBe(400);
    expect(metrics.totalPnL).toBe(0);
    expect(metrics.pnlPercent).toBe(0);
  });

  it("returns zero percent when total cost is zero", () => {
    const metrics = getPortfolioMetrics([
      {
        id: "a3",
        name: "XAU",
        type: "Emtia",
        quantity: 1,
        buyPrice: 0,
        currentPrice: 100,
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ]);

    expect(metrics.totalCost).toBe(0);
    expect(metrics.pnlPercent).toBe(0);
  });
});

describe("portfolio distribution", () => {
  it("sorts assets by value and computes ratios", () => {
    const distribution = getDistribution(sampleAssets);

    expect(distribution).toHaveLength(2);
    expect(distribution[0].label).toBe("BTC");
    expect(distribution[0].value).toBe(300);
    expect(distribution[0].ratio).toBeCloseTo(75);
    expect(distribution[1].label).toBe("ASELS");
    expect(distribution[1].value).toBe(100);
    expect(distribution[1].ratio).toBeCloseTo(25);
  });

  it("returns empty array when total value is zero", () => {
    const distribution = getDistribution([
      {
        id: "a4",
        name: "TRY",
        type: "Döviz",
        quantity: 1,
        buyPrice: 0,
        currentPrice: 0,
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ]);

    expect(distribution).toEqual([]);
  });
});
