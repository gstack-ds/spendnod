"use client";

import useSWR from "swr";
import { getRequests, getAgents } from "@/lib/api";
import { PendingCard } from "@/components/pending-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PendingPage() {
  const {
    data: requests,
    isLoading,
    error,
    mutate,
  } = useSWR("pending-requests-page", () => getRequests("pending"), {
    refreshInterval: 8000,
  });

  const { data: agents } = useSWR("agents", getAgents, {
    refreshInterval: 30000,
  });

  const agentMap = new Map(agents?.map((a) => [a.id, a.name]) ?? []);

  function handleResolved(id: string) {
    mutate((prev) => prev?.filter((r) => r.id !== id) ?? []);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review and approve or deny agent requests
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => mutate()}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <span>Failed to load requests</span>
          <Button variant="outline" size="sm" onClick={() => mutate()}>
            Retry
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-52 rounded-lg" />
          ))}
        </div>
      ) : requests && requests.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <PendingCard
              key={req.id}
              request={req}
              agentName={agentMap.get(req.agent_id)}
              onResolved={handleResolved}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-16 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-base font-medium">No pending requests</p>
          <p className="text-sm text-muted-foreground mt-1">
            All clear — your agents are operating within their rules
          </p>
        </div>
      )}
    </div>
  );
}
