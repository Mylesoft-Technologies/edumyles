"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useAccessibility } from "@/hooks/useAccessibility";
import { usePlatformMetrics } from "@/components/platform/PlatformMetrics";
import { InteractiveChart } from "@/components/charts/InteractiveChart";
import { HeatmapChart } from "@/components/charts/HeatmapChart";
import {
  Activity,
  AlertTriangle,
  Building2,
  DollarSign,
  FileText,
  Shield,
  UserCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/formatters";

const PLAN_PRICES_USD: Record<string, number> = {
  starter: 49,
  growth: 129,
  premium: 249,
  enterprise: 499,
};

function getActionBadgeClass(action: string) {
  if (action.includes("suspended") || action.includes("deleted")) return "bg-red-500/10 text-red-700";
  if (action.includes("created") || action.includes("installed")) return "bg-green-500/10 text-green-700";
  if (action.includes("updated")) return "bg-amber-500/10 text-amber-700";
  if (action.includes("impersonation")) return "bg-orange-500/10 text-orange-700";
  return "bg-slate-500/10 text-slate-700";
}

export default function PlatformDashboardPage() {
  const { isLoading } = useAuth();
  const { hasRole } = usePermissions();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const isPlatformAdmin = hasRole("master_admin", "super_admin");

  const { data: stats, isConnected } = usePlatformMetrics();
  const { announceToScreenReader } = useAccessibility();

  const rangeStart = useMemo(() => {
    const now = Date.now();
    const ms = timeRange === "7d" ? 7 * 24 * 60 * 60 * 1000 : timeRange === "30d" ? 30 * 24 * 60 * 60 * 1000 : 90 * 24 * 60 * 60 * 1000;
    return now - ms;
  }, [timeRange]);

  const derived = useMemo(() => {
    if (!stats) {
      return {
        newUsers: 0,
        estimatedMrr: 0,
        recentActivity: [],
        securityEvents: 0,
      };
    }

    const activeSubscriptions = (stats?.subscriptions ?? []).filter((s) => s.status === "active" || s.status === "trial");
    const estimatedRevenue = activeSubscriptions.reduce((sum, s) => {
      const key = String(s.plan || "").toLowerCase();
      return sum + (PLAN_PRICES_USD[key] ?? 0);
    }, 0);

    const recentActivity = (stats?.recentActivity ?? []).filter((a) => (a.timestamp ?? 0) >= rangeStart);
    const securityEvents = recentActivity.filter((a) => /(suspend|deleted|unauthorized|failed|impersonation)/i.test(String(a.action)));
    const newUsers = recentActivity.filter((a) => /created/i.test(String(a.action)));

    return {
      newUsers: newUsers.length,
      estimatedMrr: estimatedRevenue,
      recentActivity,
      securityEvents: securityEvents.length,
    };
  }, [stats, timeRange, rangeStart]);

  if (isLoading) return <LoadingSkeleton variant="page" />;

  if (!isPlatformAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Master Admin Dashboard" description="Platform-wide operations and controls" breadcrumbs={[{ label: "Dashboard", href: "/platform" }]} />
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">You do not have permission to view platform-wide metrics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Admin Dashboard"
        description="Live platform metrics and cross-tenant activity"
        breadcrumbs={[{ label: "Dashboard", href: "/platform" }]}
      />

      {/* Toolbar: time range + connection status + analytics link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => { setTimeRange(range); announceToScreenReader(`Showing ${range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"} of data`); }}
                className="text-xs"
              >
                {range === "7d" ? "7D" : range === "30d" ? "30D" : "90D"}
              </Button>
            ))}
          </div>

          {/* Connection status pill */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isConnected
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            {isConnected ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <Wifi className="h-3 w-3" />
                <span>Live</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <WifiOff className="h-3 w-3" />
                <span>Reconnecting…</span>
              </>
            )}
          </div>
        </div>

        <Link href="/platform/analytics">
          <Button className="bg-[#056C40] hover:bg-[#023c24]">
            <FileText className="h-4 w-4 mr-2" />
            Open Analytics
          </Button>
        </Link>
      </div>

      {/* 4 key stat cards (consolidated from 8) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tenants" value={stats?.totalTenants ?? 0} icon={Building2} />
        <StatCard label="Estimated MRR (USD)" value={`$${derived.estimatedMrr.toLocaleString()}`} icon={DollarSign} />
        <StatCard label="Security Events" value={derived.securityEvents} icon={Shield} />
        <StatCard label="New Users (Range)" value={derived.newUsers.toLocaleString()} icon={UserCheck} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <InteractiveChart
          data={derived.recentActivity.map((item, index) => ({
            x: index,
            y: item.action.includes('created') ? 1 : item.action.includes('updated') ? 0.5 : 0.2,
            value: item
          }))}
          title="Activity Trend"
          type="line"
          onDrillDown={(point) => {
            console.log('Drill down to:', point.value);
          }}
        />

        <HeatmapChart
          data={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => {
            const count = derived.recentActivity.filter((a) => {
              const d = new Date(a.timestamp ?? 0);
              return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] === dayName;
            }).length;
            return { day: dayName, hour: 12, value: count };
          })}
          title="User Activity Heatmap"
        />
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-[#056C40]" />
              <span>Recent Activity</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {derived.recentActivity.length} events
              </Badge>
              <Link href="/platform/audit">
                <Button variant="outline" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {derived.recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No activity in this time range</p>
            </div>
          ) : (
            <div className="space-y-2">
              {derived.recentActivity.slice(0, 15).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-3 min-w-0">
                    <Badge className={`shrink-0 text-xs font-medium ${getActionBadgeClass(item.action)}`}>
                      {item.action}
                    </Badge>
                    {item.details && (
                      <span className="text-sm text-muted-foreground truncate">
                        {typeof item.details === "string" ? item.details : JSON.stringify(item.details)}
                      </span>
                    )}
                  </div>
                  {item.timestamp && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
