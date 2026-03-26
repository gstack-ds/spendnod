"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Agent, revokeAgent } from "@/lib/api";
import { toast } from "sonner";
import { Bot, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AgentCardProps {
  agent: Agent;
  onRevoked: (id: string) => void;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> =
  {
    active: "default",
    paused: "secondary",
    revoked: "destructive",
  };

export function AgentCard({ agent, onRevoked }: AgentCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    setLoading(true);
    try {
      await revokeAgent(agent.id);
      toast.success(`Agent "${agent.name}" revoked`);
      onRevoked(agent.id);
      setConfirmOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to revoke agent");
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">{agent.name}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  {agent.api_key_prefix}...
                </div>
              </div>
            </div>
            <Badge variant={statusVariant[agent.status] || "secondary"}>
              {agent.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-0">
          <span className="text-xs text-muted-foreground">
            Created {new Date(agent.created_at).toLocaleDateString()}
          </span>
          {agent.status !== "revoked" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Revoke
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke agent?</DialogTitle>
            <DialogDescription>
              Revoking <strong>{agent.name}</strong> will immediately invalidate
              its API key. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={loading}
            >
              {loading ? "Revoking..." : "Revoke agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
