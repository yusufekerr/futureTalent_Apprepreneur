import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Asset, AssetDraft } from "@/types/portfolio";
import { getDistribution, getPortfolioMetrics } from "@/utils/portfolio";

/* ------------------------------------------------------------------ */
/*  DB row → App model mapping                                        */
/* ------------------------------------------------------------------ */

function mapRow(row: Record<string, unknown>): Asset {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as Asset["type"],
    quantity: Number(row.quantity),
    buyPrice: Number(row.buy_price),
    currentPrice: Number(row.current_price),
    updatedAt: row.created_at as string
  };
}

/* ------------------------------------------------------------------ */
/*  Context type                                                       */
/* ------------------------------------------------------------------ */

type PortfolioContextValue = {
  assets: Asset[];
  isLoading: boolean;
  error: string | null;
  addAsset: (draft: AssetDraft) => Promise<{ error: string | null }>;
  updatePrice: (id: string, nextPrice: number) => Promise<{ error: string | null }>;
  removeAsset: (id: string) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
  metrics: ReturnType<typeof getPortfolioMetrics>;
  distribution: ReturnType<typeof getDistribution>;
};

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- fetch ---- */
  const fetchAssets = useCallback(async () => {
    if (!user) {
      setAssets([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setAssets((data ?? []).map(mapRow));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  /* ---- add ---- */
  const addAsset = useCallback(
    async (draft: AssetDraft): Promise<{ error: string | null }> => {
      if (!user) return { error: "Oturum bulunamadı." };

      const { error: err } = await supabase.from("assets").insert({
        user_id: user.id,
        name: draft.name,
        type: draft.type,
        quantity: draft.quantity,
        buy_price: draft.buyPrice,
        current_price: draft.currentPrice
      });

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await fetchAssets();
      return { error: null };
    },
    [user, fetchAssets]
  );

  /* ---- update price ---- */
  const updatePrice = useCallback(
    async (id: string, nextPrice: number): Promise<{ error: string | null }> => {
      const { error: err } = await supabase
        .from("assets")
        .update({ current_price: nextPrice })
        .eq("id", id);

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await fetchAssets();
      return { error: null };
    },
    [fetchAssets]
  );

  /* ---- remove ---- */
  const removeAsset = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const { error: err } = await supabase.from("assets").delete().eq("id", id);

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await fetchAssets();
      return { error: null };
    },
    [fetchAssets]
  );

  /* ---- derived ---- */
  const metrics = useMemo(() => getPortfolioMetrics(assets), [assets]);
  const distribution = useMemo(() => getDistribution(assets), [assets]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      assets,
      isLoading,
      error,
      addAsset,
      updatePrice,
      removeAsset,
      refresh: fetchAssets,
      metrics,
      distribution
    }),
    [assets, isLoading, error, addAsset, updatePrice, removeAsset, fetchAssets, metrics, distribution]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }
  return ctx;
}
