"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveRequest, denyRequest, AuthRequest } from "@/lib/api";
import { toast } from "sonner";
import { Clock, AlertTriangle } from "lucide-react";

interface PendingCardProps {
  request: AuthRequest;
  agentName?: string;
  onResolved: (id: string) => void;
}

function formatCountdown(expiresAt: string | null): string {
  if (!expiresAt) return "";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatAmount(amount: number | null, currency: string): string {
  if (amount === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

export function PendingCard({ request, agentName, onResolved }: PendingCardProps) {
  const [countdown, setCountdown] = useState(() =>
    formatCountdown(request.expires_at)
  );
  const [loading, setLoading] = useState<"approve" | "deny" | null>(null);

  useEffect(() => {
    if (!request.expires_at) return;
    const interval = setInterval(() => {
      setCountdown(formatCountdown(request.expires_at));
    }, 1000);
    return () => clearInterval(interval);
  }, [request.expires_at]);

  async function handleApprove() {
    setLoading("approve");
    try {
      await approveRequest(request.id);
      toast.success("Request approved");
      onResolved(request.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve");
      setLoading(null);
    }
  }

  async function handleDeny() {
    setLoading("deny");
    try {
      await denyRequest(request.id);
      toast.success("Request denied");
      onResolved(request.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to deny");
      setLoading(null);
    }
  }

  const isExpiringSoon =
    request.expires_at &&
    new Date(request.expires_at).getTime() - Date.now() < 5 * 60 * 1000;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-sm">
              {agentName || "Unknown Agent"}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {request.action}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {request.amount !== null && (
              <span className="text-lg font-bold">
                {formatAmount(request.amount, request.currency)}
              </span>
            )}
            {request.category && (
              <Badge variant="secondary" className="text-xs">
                {request.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 pb-3">
        {request.vendor && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Vendor:</span>
            <span className="font-medium">{request.vendor}</span>
          </div>
        )}

        {request.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {request.description}
          </p>
        )}

        {request.escalation_reason && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-2.5 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>{request.escalation_reason}</span>
          </div>
        )}

        {countdown && (
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${
              isExpiringSoon
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Expires in {countdown}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button
          size="sm"
          className="flex-1"
          onClick={handleApprove}
          disabled={loading !== null}
        >
          {loading === "approve" ? "Approving..." : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex-1"
          onClick={handleDeny}
          disabled={loading !== null}
        >
          {loading === "deny" ? "Denying..." : "Deny"}
        </Button>
      </CardFooter>
    </Card>
  );
}
