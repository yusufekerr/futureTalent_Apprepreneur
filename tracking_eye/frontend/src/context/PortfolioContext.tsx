import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUpdatedPrices } from "@/services/marketData";
import type { Database } from "@/types/database.types";
import type { Asset, AssetDraft, PortfolioSnapshot, Transaction, TransactionType } from "@/types/portfolio";
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
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addAsset: (draft: AssetDraft) => Promise<{ error: string | null }>;
  updatePrice: (id: string, nextPrice: number) => Promise<{ error: string | null }>;
  removeAsset: (id: string) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
  syncMarketPrices: () => Promise<{ error: string | null; assets?: Asset[] }>;
  metrics: ReturnType<typeof getPortfolioMetrics>;
  distribution: ReturnType<typeof getDistribution>;
  clearTransactions: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  /* ---- fetch transactions ---- */
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      return;
    }
    try {
      const stored = await AsyncStorage.getItem("portfolio_transactions");
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  }, [user]);

  /* ---- add transaction record ---- */
  const addTransactionRecord = useCallback(async (type: TransactionType, assetName: string, quantity?: number, price?: number) => {
    try {
      const newTx: Transaction = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        assetName,
        quantity,
        price,
        timestamp: new Date().toISOString()
      };
      
      const stored = await AsyncStorage.getItem("portfolio_transactions");
      let currentTxList: Transaction[] = [];
      if (stored) {
        currentTxList = JSON.parse(stored);
      }
      
      const updatedList = [newTx, ...currentTxList].slice(0, 50);
      setTransactions(updatedList);
      await AsyncStorage.setItem("portfolio_transactions", JSON.stringify(updatedList));
    } catch (err) {
      console.error("Error saving transaction:", err);
    }
  }, []);

  /* ---- clear transactions ---- */
  const clearTransactions = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("portfolio_transactions");
      setTransactions([]);
    } catch (err) {
      console.error("Error clearing transactions:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAssets();
    fetchSnapshots();
    fetchTransactions();
  }, [fetchAssets, fetchSnapshots, fetchTransactions]);

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
      await addTransactionRecord("ADD", draft.name, draft.quantity, draft.buyPrice);
      return { error: null };
    },
    [user, refreshAndSnapshot, addTransactionRecord]
  );

  /* ---- update price ---- */
  const updatePrice = useCallback(
    async (id: string, nextPrice: number): Promise<{ error: string | null }> => {
      const assetToUpdate = assets.find(a => a.id === id);
      const { error: err } = await supabase
        .from("assets")
        .update({ current_price: nextPrice })
        .eq("id", id);

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await refreshAndSnapshot();
      if (assetToUpdate) {
        await addTransactionRecord("UPDATE", assetToUpdate.name, assetToUpdate.quantity, nextPrice);
      }
      return { error: null };
    },
    [assets, refreshAndSnapshot, addTransactionRecord]
  );

  /* ---- remove ---- */
  const removeAsset = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const assetToDelete = assets.find(a => a.id === id);
      const { error: err } = await supabase.from("assets").delete().eq("id", id);

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await refreshAndSnapshot();
      if (assetToDelete) {
        await addTransactionRecord("REMOVE", assetToDelete.name, assetToDelete.quantity, assetToDelete.buyPrice);
      }
      return { error: null };
    },
    [assets, refreshAndSnapshot, addTransactionRecord]
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
      await addTransactionRecord("SYNC", "Portföy Senkronizasyonu", undefined, undefined);
      setIsLoading(false);
      return { error: null, assets: freshAssets };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
      setIsLoading(false);
      setError(errMsg);
      return { error: errMsg };
    }
  }, [user, assets, refreshAndSnapshot, addTransactionRecord]);

  /* ---- derived ---- */
  const metrics = useMemo(() => getPortfolioMetrics(assets), [assets]);
  const distribution = useMemo(() => getDistribution(assets), [assets]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      assets,
      snapshots,
      transactions,
      isLoading,
      error,
      addAsset,
      updatePrice,
      removeAsset,
      refresh: fetchAssets,
      syncMarketPrices,
      metrics,
      distribution,
      clearTransactions
    }),
    [assets, snapshots, transactions, isLoading, error, addAsset, updatePrice, removeAsset, fetchAssets, syncMarketPrices, metrics, distribution, clearTransactions]
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
