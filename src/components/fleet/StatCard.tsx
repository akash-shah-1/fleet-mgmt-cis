import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
  trend?: { value: string; positive?: boolean };
}

const toneMap = {
  default: "bg-secondary text-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

const ringMap = {
  default: "",
  success: "before:bg-success",
  warning: "before:bg-warning",
  destructive: "before:bg-destructive",
  info: "before:bg-info",
};

export default function StatCard({ label, value, icon: Icon, hint, tone = "default", className, trend }: Props) {
  return (
    <Card
      className={cn(
        "relative p-4 shadow-card hover:shadow-elev transition-shadow overflow-hidden",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px]",
        ringMap[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">{label}</div>
          <div className="text-[26px] font-bold mt-1.5 num truncate leading-none tracking-tight">{value}</div>
          {(hint || trend) && (
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              {trend && (
                <span className={cn("font-semibold num", trend.positive ? "text-success" : "text-destructive")}>
                  {trend.positive ? "↑" : "↓"} {trend.value}
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0", toneMap[tone])}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
        )}
      </div>
    </Card>
  );
}