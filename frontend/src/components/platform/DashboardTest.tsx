"use client";

import { useDashboardKPIs, useActivityFeed, useDashboardCharts } from "@/hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function DashboardTest() {
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKPIs();
  const { data: charts, isLoading: chartsLoading, error: chartsError } = useDashboardCharts();
  const { data: activity, isLoading: activityLoading, error: activityError } = useActivityFeed();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Dashboard Connection Test</h2>
      
      {/* KPIs Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>KPIs Connection</span>
            {kpisLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {kpisError && <XCircle className="h-4 w-4 text-red-500" />}
            {kpis && <CheckCircle className="h-4 w-4 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={kpisLoading ? "secondary" : kpisError ? "destructive" : "default"}>
              {kpisLoading ? "Loading..." : kpisError ? "Error" : kpis ? "Connected" : "No Data"}
            </Badge>
            {kpis && (
              <div className="text-sm">
                <p>Active Tenants: {kpis.activeTenants}</p>
                <p>MRR: KES {kpis.mrr?.toLocaleString()}</p>
                <p>Open Tickets: {kpis.openTickets}</p>
              </div>
            )}
            {kpisError && (
              <p className="text-sm text-red-500">Error: {kpisError.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Charts Connection</span>
            {chartsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {chartsError && <XCircle className="h-4 w-4 text-red-500" />}
            {charts && <CheckCircle className="h-4 w-4 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={chartsLoading ? "secondary" : chartsError ? "destructive" : "default"}>
              {chartsLoading ? "Loading..." : chartsError ? "Error" : charts ? "Connected" : "No Data"}
            </Badge>
            {charts && (
              <div className="text-sm">
                <p>MRR Trend Data Points: {charts.mrrTrend?.length || 0}</p>
                <p>Tenant Growth Data Points: {charts.tenantGrowth?.length || 0}</p>
                <p>Ticket Volume Data Points: {charts.ticketVolume?.length || 0}</p>
              </div>
            )}
            {chartsError && (
              <p className="text-sm text-red-500">Error: {chartsError.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Activity Feed Connection</span>
            {activityLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {activityError && <XCircle className="h-4 w-4 text-red-500" />}
            {activity && <CheckCircle className="h-4 w-4 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={activityLoading ? "secondary" : activityError ? "destructive" : "default"}>
              {activityLoading ? "Loading..." : activityError ? "Error" : activity ? "Connected" : "No Data"}
            </Badge>
            {activity && (
              <div className="text-sm">
                <p>Activity Events: {activity?.length || 0}</p>
                {activity?.slice(0, 3).map((event, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    {event.action} - {event.tenantName}
                  </p>
                ))}
              </div>
            )}
            {activityError && (
              <p className="text-sm text-red-500">Error: {activityError.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Troubleshooting Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>1. Check browser console for errors</p>
            <p>2. Verify you're logged in as platform admin</p>
            <p>3. Check network tab for API calls</p>
            <p>4. Ensure Convex deployment is up-to-date</p>
            <p>5. Try refreshing the page</p>
            <p>6. Clear browser cache and cookies</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
