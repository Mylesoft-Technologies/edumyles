"use client";

import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { useAuth } from "./useAuth";

export function useDashboardKPIs() {
  const { sessionToken, isLoading: authLoading } = useAuth();

  const data = useQuery(
    api.platform.dashboard.queries.getDashboardKPIs,
    { sessionToken: sessionToken || "" },
    !!sessionToken
  );

  const isLoading = authLoading || (!!sessionToken && data === undefined);

  return {
    data: data ?? {
      activeTenants: 0,
      mrr: 0,
      arr: 0,
      openTickets: 0,
      pipelineValue: 0,
      systemHealth: 100,
      trialsActive: 0,
      newThisMonth: 0,
    },
    isLoading,
    error: null,
  };
}

export function useDashboardCharts(timeRange?: "7d" | "30d" | "90d" | "12m") {
  const { sessionToken, isLoading: authLoading } = useAuth();

  const data = useQuery(
    api.platform.dashboard.queries.getDashboardCharts,
    { sessionToken: sessionToken || "", timeRange: timeRange ?? "12m" },
    !!sessionToken
  );

  const isLoading = authLoading || (!!sessionToken && data === undefined);

  return {
    data: data ?? {
      mrrTrend: [],
      tenantGrowth: [],
      ticketVolume: [],
      revenueByPlan: [],
    },
    isLoading,
    error: null,
  };
}

export function useActivityFeed(limit?: number) {
  const { sessionToken, isLoading: authLoading } = useAuth();

  const events = useQuery(
    api.platform.dashboard.queries.getActivityFeed,
    { sessionToken: sessionToken || "", limit: limit ?? 20 },
    !!sessionToken
  );

  return {
    data: events ?? [],
    isLoading: authLoading || (!!sessionToken && events === undefined),
    error: null,
  };
}
