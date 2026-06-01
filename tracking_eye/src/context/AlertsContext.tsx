import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";
import type { Asset, PriceAlert, PriceAlertDraft } from "@/types/portfolio";

type AlertRow = Database["public"]["Tables"]["price_alerts"]["Row"];

function mapRow(row: AlertRow): PriceAlert {
  return {
    id: row.id,
    assetName: row.asset_name,
    targetPrice: Number(row.target_price),
    condition: row.condition,
    isTriggered: row.is_triggered,
    createdAt: row.created_at
  };
}

type AlertsContextValue = {
  alerts: PriceAlert[];
  triggeredAlerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
  addAlert: (draft: PriceAlertDraft) => Promise<{ error: string | null }>;
  removeAlert: (id: string) => Promise<{ error: string | null }>;
  checkAndTriggerAlerts: (assets: Asset[]) => Promise<void>;
  dismissTriggeredAlert: (id: string) => void;
  refreshAlerts: () => Promise<void>;
};

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- fetch alerts ---- */
  const fetchAlerts = useCallback(async () => {
    if (!user) {
      setAlerts([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("price_alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setAlerts((data ?? []).map(mapRow));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  /* ---- add alert ---- */
  const addAlert = useCallback(
    async (draft: PriceAlertDraft): Promise<{ error: string | null }> => {
      if (!user) return { error: "Oturum bulunamadı." };

      const { error: err } = await supabase.from("price_alerts").insert({
        user_id: user.id,
        asset_name: draft.assetName.toUpperCase(),
        target_price: draft.targetPrice,
        condition: draft.condition
      });

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await fetchAlerts();
      return { error: null };
    },
    [user, fetchAlerts]
  );

  /* ---- remove alert ---- */
  const removeAlert = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const { error: err } = await supabase.from("price_alerts").delete().eq("id", id);

      if (err) {
        setError(err.message);
        return { error: err.message };
      }

      await fetchAlerts();
      return { error: null };
    },
    [fetchAlerts]
  );

  /* ---- dismiss in-app trigger alert ---- */
  const dismissTriggeredAlert = useCallback((id: string) => {
    setTriggeredAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  /* ---- check and trigger price alerts ---- */
  const checkAndTriggerAlerts = useCallback(
    async (currentAssets: Asset[]) => {
      if (!user || alerts.length === 0) return;

      const activeAlerts = alerts.filter((alert) => !alert.isTriggered);
      const newlyTriggered: PriceAlert[] = [];

      for (const alert of activeAlerts) {
        // Find matching asset inside current portfolio list
        const asset = currentAssets.find(
          (a) => a.name.toUpperCase() === alert.assetName.toUpperCase()
        );
        if (!asset) continue;

        let shouldTrigger = false;
        if (alert.condition === "above" && asset.currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.condition === "below" && asset.currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          // 1. Update on database
          const { error: err } = await supabase
            .from("price_alerts")
            .update({ is_triggered: true })
            .eq("id", alert.id);

          if (!err) {
            newlyTriggered.push({
              ...alert,
              isTriggered: true
            });
          }
        }
      }

      if (newlyTriggered.length > 0) {
        // Add to active overlay list
        setTriggeredAlerts((prev) => [...prev, ...newlyTriggered]);
        // Refresh alerts state to show checked status
        await fetchAlerts();
      }
    },
    [user, alerts, fetchAlerts]
  );

  const value = useMemo<AlertsContextValue>(
    () => ({
      alerts,
      triggeredAlerts,
      isLoading,
      error,
      addAlert,
      removeAlert,
      checkAndTriggerAlerts,
      dismissTriggeredAlert,
      refreshAlerts: fetchAlerts
    }),
    [alerts, triggeredAlerts, isLoading, error, addAlert, removeAlert, checkAndTriggerAlerts, dismissTriggeredAlert, fetchAlerts]
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) {
    throw new Error("useAlerts must be used inside AlertsProvider");
  }
  return ctx;
}
