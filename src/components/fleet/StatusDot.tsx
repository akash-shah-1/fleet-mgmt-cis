import { cn } from "@/lib/utils";
import type { BusStatus } from "@/data/mock";

export function StatusDot({ status, className }: { status: BusStatus; className?: string }) {
  const map: Record<BusStatus, string> = {
    moving: "bg-status-moving",
    idle: "bg-status-idle",
    parked: "bg-status-parked",
    offline: "bg-status-offline",
  };
  return <span className={cn("inline-block h-2 w-2 rounded-full", map[status], className)} />;
}

export function StatusBadge({ status }: { status: BusStatus }) {
  const label: Record<BusStatus, string> = {
    moving: "Moving",
    idle: "Idle",
    parked: "Parked",
    offline: "Offline",
  };
  const tone: Record<BusStatus, string> = {
    moving: "bg-success/10 text-success border-success/20",
    idle: "bg-warning/10 text-warning border-warning/20",
    parked: "bg-muted text-muted-foreground border-border",
    offline: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium", tone[status])}>
      <StatusDot status={status} />
      {label[status]}
    </span>
  );
}