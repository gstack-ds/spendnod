import { ActivityItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  items: ActivityItem[];
}

function eventColor(eventType: string): string {
  if (eventType.includes("approved") || eventType.includes("auto_approved")) {
    return "bg-green-500";
  }
  if (eventType.includes("denied") || eventType.includes("revoked") || eventType.includes("expired")) {
    return "bg-red-500";
  }
  if (eventType.includes("pending") || eventType.includes("created")) {
    return "bg-yellow-500";
  }
  return "bg-blue-500";
}

function eventLabel(eventType: string): string {
  const labels: Record<string, string> = {
    request_created: "Request created",
    auto_approved: "Auto-approved",
    human_approved: "Approved",
    human_denied: "Denied",
    request_expired: "Request expired",
    agent_registered: "Agent registered",
    agent_revoked: "Agent revoked",
    rule_created: "Rule created",
    rule_deleted: "Rule deleted",
  };
  return labels[eventType] || eventType.replace(/_/g, " ");
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4 py-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0",
                eventColor(item.event_type)
              )}
            />
            {index < items.length - 1 && (
              <div className="w-px flex-1 bg-border mt-1" />
            )}
          </div>
          <div className="pb-3 min-w-0">
            <div className="text-sm font-medium">{eventLabel(item.event_type)}</div>
            {item.details && Object.keys(item.details).length > 0 && (
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {typeof item.details.agent_name === "string" && item.details.agent_name && (
                  <span>Agent: {item.details.agent_name} &middot; </span>
                )}
                {item.details.amount !== undefined && item.details.amount !== null && (
                  <span>${Number(item.details.amount).toFixed(2)} &middot; </span>
                )}
                {typeof item.details.vendor === "string" && item.details.vendor && (
                  <span>{item.details.vendor}</span>
                )}
              </div>
            )}
            <div className="text-xs text-muted-foreground/60 mt-0.5">
              {timeAgo(item.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
