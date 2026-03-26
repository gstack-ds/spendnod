"use client";

import useSWR from "swr";
import { getDashboardStats, getRequests, getAgents } from "@/lib/api";
import { MetricCard } from "@/components/metric-card";
import { PendingCard } from "@/components/pending-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OverviewPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    mutate: mutateStats,
  } = useSWR("dashboard-stats", getDashboardStats, {
    refreshInterval: 15000,
  });

  const {
    data: pendingRequests,
    isLoading: pendingLoading,
    mutate: mutatePending,
  } = useSWR("pending-requests", () => getRequests("pending"), {
    refreshInterval: 10000,
  });

  const {
    data: agents,
    isLoading: agentsLoading,
  } = useSWR("agents", getAgents, { refreshInterval: 30000 });

  const agentMap = new Map(agents?.map((a) => [a.id, a.name]) ?? []);

  function handleResolved(id: string) {
    mutatePending((prev) => prev?.filter((r) => r.id !== id) ?? []);
    mutateStats();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your agent activity and spending
        </p>
      </div>

      {statsError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <span>Failed to load stats</span>
          <Button variant="outline" size="sm" onClick={() => mutateStats()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Requests"
          value={stats?.total_requests ?? 0}
          icon={Activity}
          loading={statsLoading}
        />
        <MetricCard
          title="Auto-Approved"
          value={stats?.auto_approved ?? 0}
          icon={CheckCircle}
          description={
            stats
              ? `${Math.round(stats.approval_rate * 100)}% approval rate`
              : undefined
          }
          loading={statsLoading}
        />
        <MetricCard
          title="Pending"
          value={stats?.pending ?? 0}
          icon={Clock}
          description="Awaiting your review"
          loading={statsLoading}
        />
        <MetricCard
          title="Total Spend"
          value={
            stats
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(stats.total_spend)
              : "$0.00"
          }
          icon={DollarSign}
          loading={statsLoading}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pending Requests</h2>
          {(pendingRequests?.length ?? 0) > 3 && (
            <Link href="/pending">
              <Button variant="outline" size="sm">View all</Button>
            </Link>
          )}
        </div>

        {pendingLoading || agentsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : pendingRequests && pendingRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.slice(0, 3).map((req) => (
              <PendingCard
                key={req.id}
                request={req}
                agentName={agentMap.get(req.agent_id)}
                onResolved={handleResolved}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <CheckCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No pending requests — all clear!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
