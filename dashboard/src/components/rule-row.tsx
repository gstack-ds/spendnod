"use client";

import { useState } from "react";
import { Rule, deleteRule } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface RuleRowProps {
  rule: Rule;
  onDeleted: (id: string) => void;
}

function ruleLabel(ruleType: string): string {
  const labels: Record<string, string> = {
    max_per_transaction: "Max per transaction",
    max_per_day: "Max per day",
    max_per_month: "Max per month",
    allowed_vendors: "Allowed vendors",
    blocked_vendors: "Blocked vendors",
    allowed_categories: "Allowed categories",
    blocked_categories: "Blocked categories",
    require_approval_above: "Require approval above",
    auto_approve_below: "Auto-approve below",
  };
  return labels[ruleType] || ruleType;
}

function ruleValueSummary(ruleType: string, value: Record<string, unknown>): string {
  if (value.amount !== undefined) {
    return `$${value.amount}`;
  }
  if (value.vendors && Array.isArray(value.vendors)) {
    return (value.vendors as string[]).join(", ");
  }
  if (value.categories && Array.isArray(value.categories)) {
    return (value.categories as string[]).join(", ");
  }
  return JSON.stringify(value);
}

export function RuleRow({ rule, onDeleted }: RuleRowProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteRule(rule.id);
      toast.success("Rule deleted");
      onDeleted(rule.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete rule");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-sm font-medium">{ruleLabel(rule.rule_type)}</div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {ruleValueSummary(rule.rule_type, rule.value)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        <Badge variant={rule.is_active ? "default" : "secondary"} className="text-xs">
          {rule.is_active ? "Active" : "Inactive"}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
