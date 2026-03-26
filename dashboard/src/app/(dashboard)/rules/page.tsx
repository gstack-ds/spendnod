"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  getAgents,
  getAgentRules,
  createRule,
  getRuleTemplates,
  RuleTemplate,
} from "@/lib/api";
import { RuleRow } from "@/components/rule-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Shield, Loader2, AlertTriangle } from "lucide-react";

const RULE_TYPES = [
  { value: "max_per_transaction", label: "Max per transaction", hasAmount: true },
  { value: "max_per_day", label: "Max per day", hasAmount: true },
  { value: "max_per_month", label: "Max per month", hasAmount: true },
  { value: "require_approval_above", label: "Require approval above", hasAmount: true },
  { value: "auto_approve_below", label: "Auto-approve below", hasAmount: true },
  { value: "allowed_vendors", label: "Allowed vendors", hasList: true },
  { value: "blocked_vendors", label: "Blocked vendors", hasList: true },
  { value: "allowed_categories", label: "Allowed categories", hasList: true },
  { value: "blocked_categories", label: "Blocked categories", hasList: true },
];

const templateBadgeVariant = (name: string): "default" | "secondary" | "destructive" => {
  if (name.toLowerCase().includes("conservative")) return "default";
  if (name.toLowerCase().includes("permissive")) return "secondary";
  return "secondary";
};

export default function RulesPage() {
  const { data: agents, isLoading: agentsLoading } = useSWR("agents", getAgents);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const {
    data: rules,
    isLoading: rulesLoading,
    mutate: mutateRules,
  } = useSWR(
    selectedAgentId ? `rules-${selectedAgentId}` : null,
    () => getAgentRules(selectedAgentId)
  );

  const {
    data: templates,
    isLoading: templatesLoading,
  } = useSWR(
    selectedAgentId ? `templates-${selectedAgentId}` : null,
    () => getRuleTemplates(selectedAgentId)
  );

  const [addOpen, setAddOpen] = useState(false);
  const [ruleType, setRuleType] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [listValue, setListValue] = useState("");
  const [adding, setAdding] = useState(false);

  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null);

  const selectedRuleType = RULE_TYPES.find((r) => r.value === ruleType);

  async function handleAddRule(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAgentId || !ruleType) return;
    setAdding(true);

    let value: Record<string, unknown> = {};
    if (selectedRuleType?.hasAmount) {
      const amt = parseFloat(amountValue);
      if (isNaN(amt) || amt <= 0) {
        toast.error("Enter a valid positive amount");
        setAdding(false);
        return;
      }
      value = { amount: amt };
    } else if (selectedRuleType?.hasList) {
      const items = listValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length === 0) {
        toast.error("Enter at least one item");
        setAdding(false);
        return;
      }
      const key = ruleType.includes("vendor") ? "vendors" : "categories";
      value = { [key]: items };
    }

    try {
      await createRule(selectedAgentId, ruleType, value);
      toast.success("Rule added");
      setAddOpen(false);
      setRuleType("");
      setAmountValue("");
      setListValue("");
      mutateRules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add rule");
    } finally {
      setAdding(false);
    }
  }

  async function handleApplyTemplate(template: RuleTemplate) {
    if (!selectedAgentId) return;
    setApplyingTemplate(template.name);
    try {
      for (const rule of template.rules) {
        await createRule(selectedAgentId, rule.rule_type, rule.value);
      }
      toast.success(`Applied "${template.name}" template (${template.rules.length} rules)`);
      mutateRules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to apply template");
    } finally {
      setApplyingTemplate(null);
    }
  }

  function handleRuleDeleted(id: string) {
    mutateRules((prev) => prev?.filter((r) => r.id !== id) ?? []);
  }

  const selectedAgent = agents?.find((a) => a.id === selectedAgentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rules</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure auto-approval and spending limits per agent
          </p>
        </div>
      </div>

      {/* Agent selector */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1 space-y-2">
              <Label>Select agent</Label>
              {agentsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedAgentId} onValueChange={(v) => setSelectedAgentId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an agent to manage rules" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents?.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                        {agent.status !== "active" && (
                          <span className="ml-2 text-muted-foreground text-xs">
                            ({agent.status})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {selectedAgentId && (
              <Button onClick={() => setAddOpen(true)} className="gap-2 flex-shrink-0">
                <Plus className="h-4 w-4" />
                Add rule
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedAgentId && (
        <>
          {/* Templates */}
          {!templatesLoading && templates && templates.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick templates</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {templates.map((tmpl) => (
                    <Button
                      key={tmpl.name}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleApplyTemplate(tmpl)}
                      disabled={applyingTemplate !== null}
                      title={tmpl.description}
                    >
                      {applyingTemplate === tmpl.name ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : null}
                      <Badge
                        variant={templateBadgeVariant(tmpl.name)}
                        className="text-xs px-1.5 py-0"
                      >
                        {tmpl.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {tmpl.rules.length} rules
                      </span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Templates add rules to the existing set. They don&apos;t replace current rules.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Rules list */}
          <div>
            <h2 className="text-base font-semibold mb-3">
              Rules for {selectedAgent?.name}
            </h2>

            {rulesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : rules && rules.length > 0 ? (
              <div className="space-y-2">
                {rules.map((rule) => (
                  <RuleRow key={rule.id} rule={rule} onDeleted={handleRuleDeleted} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-10 text-center">
                <Shield className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium">No rules configured</p>
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-700 dark:text-amber-400 mt-4 text-left">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>All requests require your approval</strong> until you set
                    rules for this agent. Add rules or apply a template to enable
                    auto-approval.
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Rule Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add rule</DialogTitle>
            <DialogDescription>
              Configure a spending rule for {selectedAgent?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRule}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Rule type</Label>
                <Select value={ruleType} onValueChange={(v) => setRuleType(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RULE_TYPES.map((rt) => (
                      <SelectItem key={rt.value} value={rt.value}>
                        {rt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRuleType?.hasAmount && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 50.00"
                    value={amountValue}
                    onChange={(e) => setAmountValue(e.target.value)}
                    required
                  />
                </div>
              )}

              {selectedRuleType?.hasList && (
                <div className="space-y-2">
                  <Label htmlFor="list-value">
                    {ruleType.includes("vendor") ? "Vendors" : "Categories"}{" "}
                    <span className="text-muted-foreground font-normal">
                      (comma-separated)
                    </span>
                  </Label>
                  <Input
                    id="list-value"
                    placeholder={
                      ruleType.includes("vendor")
                        ? "e.g. AWS, GCP, Azure"
                        : "e.g. cloud_services, office_supplies"
                    }
                    value={listValue}
                    onChange={(e) => setListValue(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
                disabled={adding}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adding || !ruleType}>
                {adding ? "Adding..." : "Add rule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
