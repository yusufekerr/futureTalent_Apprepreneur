import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUpdatedPrices } from "@/services/marketData";
import type { Database } from "@/types/database.types";
import type { Asset, AssetDraft, PortfolioSnapshot } from "@/types/portfolio";
import { getDistribution, getPortfolioMetrics } from "@/utils/portfolio";

/* ------------------------------------------------------------------ */
/*  DB row → App model mapping                                        */
/* ------------------------------------------------------------------ */

type AssetRow = Database["public"]["Tables"]["assets"]["Row"];

function mapRow(row: AssetRow): Asset {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    quantity: Number(row.quantity),
    buyPrice: Number(row.buy_price),
    currentPrice: Number(row.current_price),
    updatedAt: row.updated_at
  };
}

/* ------------------------------------------------------------------ */
/*  Context type                                                       */
/* ------------------------------------------------------------------ */

type PortfolioContextValue = {
  assets: Asset[];
  snapshots: PortfolioSnapshot[];
  isLoading: boolean;
  error: string | null;
  addAsset: (draft: AssetDraft) => Promise<{ error: string | null }>;
  updatePrice: (id: string, nextPrice: number) => Promise<{ error: string | null }>;
  removeAsset: (id: string) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
  syncMarketPrices: () => Promise<{ error: string | null; assets?: Asset[] }>;
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
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- fetch assets ---- */
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

  /* ---- fetch snapshots ---- */
  const fetchSnapshots = useCallback(async () => {
    if (!user) {
      setSnapshots([]);
      return;
    }
    const { data, error: err } = await supabase
      .from("portfolio_snapshots")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(7);

    if (err) {
      console.error("Error fetching snapshots:", err.message);
    } else {
      const mapped = (data ?? [])
        .map((row) => ({
          id: row.id,
          totalValue: Number(row.total_value),
          totalCost: Number(row.total_cost),
          recordedAt: row.recorded_at
        }))
        .reverse(); // Chronological order
      setSnapshots(mapped);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchAssets();
    fetchSnapshots();
  }, [fetchAssets, fetchSnapshots]);

  /* ---- refresh assets and log snapshot helper ---- */
  const refreshAndSnapshot = useCallback(async (): Promise<Asset[]> => {
    if (!user) return [];
    const { data, error: err } = await supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
      return [];
    }
    const mappedAssets = (data ?? []).map(mapRow);
    setAssets(mappedAssets);

    const newMetrics = getPortfolioMetrics(mappedAssets);

    // Save snapshot in database
    await supabase.from("portfolio_snapshots").insert({
      user_id: user.id,
      total_value: newMetrics.totalValue,
      total_cost: newMetrics.totalCost
    });

    await fetchSnapshots();
    return mappedAssets;
  }, [user, fetchSnapshots]);

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

      await refreshAndSnapshot();
      return { error: null };
    },
    [user, refreshAndSnapshot]
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

      await refreshAndSnapshot();
      return { error: null };
    },
    [refreshAndSnapshot]
  );

  /* ---- remove ---- */
  const removeAsset = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const { error: err } = await supabase.from("assets").delete().eq("id", id);

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await refreshAndSnapshot();
      return { error: null };
    },
    [refreshAndSnapshot]
  );

  /* ---- sync market prices ---- */
  const syncMarketPrices = useCallback(async (): Promise<{ error: string | null; assets?: Asset[] }> => {
    if (!user) return { error: "Oturum bulunamadı." };
    if (assets.length === 0) return { error: null, assets: [] };

    setIsLoading(true);
    setError(null);

    try {
      const updatedPrices = await getUpdatedPrices(assets);

      const updatePromises = Object.entries(updatedPrices).map(([id, nextPrice]) =>
        supabase.from("assets").update({ current_price: nextPrice }).eq("id", id)
      );

      const results = await Promise.all(updatePromises);
      const failed = results.find((res) => res.error !== null);
      
      if (failed) {
        setIsLoading(false);
        setError(failed.error!.message);
        return { error: failed.error!.message };
      }

      const freshAssets = await refreshAndSnapshot();
      setIsLoading(false);
      return { error: null, assets: freshAssets };
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Bilinmeyen bir hata oluştu.");
      return { error: err.message || "Bilinmeyen bir hata oluştu." };
    }
  }, [user, assets, refreshAndSnapshot]);

  /* ---- derived ---- */
  const metrics = useMemo(() => getPortfolioMetrics(assets), [assets]);
  const distribution = useMemo(() => getDistribution(assets), [assets]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      assets,
      snapshots,
      isLoading,
      error,
      addAsset,
      updatePrice,
      removeAsset,
      refresh: fetchAssets,
      syncMarketPrices,
      metrics,
      distribution
    }),
    [assets, snapshots, isLoading, error, addAsset, updatePrice, removeAsset, fetchAssets, syncMarketPrices, metrics, distribution]
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
