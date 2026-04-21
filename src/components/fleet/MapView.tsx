import { buses, type Bus } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Bus as BusIcon } from "lucide-react";

interface Props {
  height?: string;
  selectedId?: string;
  onSelect?: (b: Bus) => void;
  filter?: (b: Bus) => boolean;
  compact?: boolean;
}

const colorByStatus: Record<string, string> = {
  moving: "bg-status-moving text-white border-status-moving",
  idle: "bg-status-idle text-white border-status-idle",
  parked: "bg-status-parked text-white border-status-parked",
  offline: "bg-status-offline text-white border-status-offline",
};

export default function MapView({ height = "h-[520px]", selectedId, onSelect, filter, compact }: Props) {
  const list = buses.filter((b) => (filter ? filter(b) : true));
  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl border bg-[hsl(210_40%_94%)]", height)}>
      {/* Faux street grid */}
      <svg className="absolute inset-0 h-full w-full opacity-50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
          </pattern>
          <pattern id="grid-lg" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#grid-lg)" />
        {/* faux roads */}
        <path d="M 0 220 Q 300 180 600 260 T 1200 240" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.25" strokeWidth="6" fill="none" />
        <path d="M 200 0 Q 240 200 360 380 T 520 720" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.25" strokeWidth="6" fill="none" />
        <path d="M 800 0 L 760 800" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.2" strokeWidth="5" fill="none" />
      </svg>

      {/* Bus markers */}
      {list.map((b) => {
        const active = selectedId === b.id;
        return (
          <button
            key={b.id}
            onClick={() => onSelect?.(b)}
            style={{ left: `${b.pos.x}%`, top: `${b.pos.y}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 group flex items-center gap-1.5 rounded-full border-2 shadow-elev transition-transform",
              colorByStatus[b.status],
              active ? "scale-110 ring-4 ring-primary/30" : "hover:scale-105",
              compact ? "p-1" : "px-2 py-1",
            )}
          >
            <BusIcon className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
            {!compact && <span className="text-[10px] font-semibold">{b.number.slice(-3)}</span>}
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 rounded-lg bg-card/95 backdrop-blur px-3 py-2 text-xs shadow-elev border">
        {(["moving","idle","parked","offline"] as const).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 capitalize">
            <span className={cn("h-2 w-2 rounded-full", `bg-status-${s}`)} />
            {s}
          </span>
        ))}
      </div>
      <div className="absolute top-3 right-3 rounded-lg bg-card/95 backdrop-blur px-3 py-1.5 text-xs shadow-elev border">
        {list.length} buses
      </div>
    </div>
  );
}