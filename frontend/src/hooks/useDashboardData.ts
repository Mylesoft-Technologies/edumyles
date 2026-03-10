"use client";

import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { useAuth } from "./useAuth";

export function useDashboardKPIs() {
  const { sessionToken } = useAuth();
  return useQuery(api.platform.dashboard.getDashboardKPIs, { 
    sessionToken: sessionToken || "" 
  });
}

export function useDashboardCharts(timeRange?: "7d" | "30d" | "90d" | "12m") {
  const { sessionToken } = useAuth();
  return useQuery(api.platform.dashboard.getDashboardCharts, { 
    sessionToken: sessionToken || "",
    timeRange: timeRange || "12m"
  });
}

export function useActivityFeed(limit?: number) {
  const { sessionToken } = useAuth();
  return useQuery(api.platform.dashboard.getActivityFeed, { 
    sessionToken: sessionToken || "",
    limit: limit || 20
  });
}
