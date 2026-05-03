import { createContext, useContext, useMemo, useState } from "react";

import { mockAssets } from "@/mock/assets";
import type { Asset, AssetDraft } from "@/types/portfolio";
import { getDistribution, getPortfolioMetrics } from "@/utils/portfolio";

type PortfolioContextValue = {
  isAuthenticated: boolean;
  assets: Asset[];
  signIn: () => void;
  signOut: () => void;
  addAsset: (draft: AssetDraft) => void;
  updatePrice: (id: string, nextPrice: number) => void;
  removeAsset: (id: string) => void;
  metrics: ReturnType<typeof getPortfolioMetrics>;
  distribution: ReturnType<typeof getDistribution>;
};

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);

  const value = useMemo<PortfolioContextValue>(() => {
    return {
      isAuthenticated,
      assets,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
      addAsset: (draft) => {
        setAssets((prev) => [
          {
            ...draft,
            id: `${Date.now()}-${Math.round(Math.random() * 10_000)}`,
            updatedAt: new Date().toISOString()
          },
          ...prev
        ]);
      },
      updatePrice: (id, nextPrice) => {
        setAssets((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  currentPrice: nextPrice,
                  updatedAt: new Date().toISOString()
                }
              : item
          )
        );
      },
      removeAsset: (id) => {
        setAssets((prev) => prev.filter((item) => item.id !== id));
      },
      metrics: getPortfolioMetrics(assets),
      distribution: getDistribution(assets)
    };
  }, [assets, isAuthenticated]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }
  return ctx;
}
