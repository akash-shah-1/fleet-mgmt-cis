import { useMemo, useState } from "react";
import PageHeader from "@/components/fleet/PageHeader";
import StatCard from "@/components/fleet/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buses, tyresForBus, type Tyre } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Disc3, Gauge, Thermometer, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";

type TyreStatus = "ok" | "low" | "critical";

const statusToneCard: Record<TyreStatus, string> = {
  ok: "border-success/30 bg-success/5",
  low: "border-warning/40 bg-warning/10",
  critical: "border-destructive/40 bg-destructive/10",
};

const statusFill: Record<TyreStatus, string> = {
  ok: "hsl(var(--success))",
  low: "hsl(var(--warning))",
  critical: "hsl(var(--destructive))",
};

const statusLabel: Record<TyreStatus, string> = {
  ok: "Healthy",
  low: "Low pressure",
  critical: "Critical",
};

// Anatomical layout on the bus diagram (svg viewBox 400 x 640)
// Order matches tyrePositions in mock.ts
const layout: { x: number; y: number; label: string; short: string }[] = [
  { x: 70,  y: 110, label: "Front Left",        short: "FL"  },
  { x: 330, y: 110, label: "Front Right",       short: "FR"  },
  { x: 60,  y: 470, label: "Rear Left Inner",   short: "RLi" },
  { x: 105, y: 470, label: "Rear Left Outer",   short: "RLo" },
  { x: 295, y: 470, label: "Rear Right Inner",  short: "RRi" },
  { x: 340, y: 470, label: "Rear Right Outer",  short: "RRo" },
];

function PressureRing({ value, status }: { value: number; status: TyreStatus }) {
  const min = 80, max = 120;
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
      <circle cx="32" cy="32" r={r} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
      <circle
        cx="32" cy="32" r={r}
        stroke={statusFill[status]} strokeWidth="6" fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        style={{ transition: "stroke-dashoffset 600ms ease" }}
      />
    </svg>
  );
}

function TreadBar({ km }: { km: number }) {
  // Simulate tread life — newer = full, ~40k km = depleted
  const life = Math.max(0, Math.min(1, 1 - km / 40000));
  const tone =
    life > 0.6 ? "bg-success" : life > 0.3 ? "bg-warning" : "bg-destructive";
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
        <span>Tread life</span>
        <span className="num font-semibold">{Math.round(life * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", tone)} style={{ width: `${life * 100}%` }} />
      </div>
    </div>
  );
}

function BusTyreDiagram({
  tyres, hovered, onHover,
}: {
  tyres: Tyre[];
  hovered: number | null;
  onHover: (i: number | null) => void;
}) {
  return (
    <svg viewBox="0 0 400 640" className="w-full h-auto max-h-[560px]">
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--card))" />
          <stop offset="100%" stopColor="hsl(var(--muted))" />
        </linearGradient>
        <linearGradient id="windshieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.08)" />
        </linearGradient>
        <pattern id="treadPattern" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="hsl(var(--background))" strokeWidth="1.2" opacity="0.55" />
        </pattern>
      </defs>

      {/* ground shadow */}
      <ellipse cx="200" cy="612" rx="155" ry="10" fill="hsl(var(--foreground) / 0.08)" />

      {/* bus body — top-down view */}
      <rect x="120" y="40" width="160" height="560" rx="46"
        fill="url(#bodyGrad)" stroke="hsl(var(--border))" strokeWidth="1.5" />

      {/* roof spine */}
      <line x1="200" y1="70" x2="200" y2="570" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 5" />

      {/* windshield (front) */}
      <path d="M 138 78 Q 200 50 262 78 L 254 110 Q 200 92 146 110 Z" fill="url(#windshieldGrad)" stroke="hsl(var(--border))" strokeWidth="1" />
      {/* rear window */}
      <path d="M 146 555 Q 200 568 254 555 L 258 580 Q 200 590 142 580 Z" fill="url(#windshieldGrad)" stroke="hsl(var(--border))" strokeWidth="1" />

      {/* side windows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <rect x="124" y={140 + i * 60} width="14" height="44" rx="3" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--border))" />
          <rect x="262" y={140 + i * 60} width="14" height="44" rx="3" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--border))" />
        </g>
      ))}

      {/* door */}
      <rect x="262" y="200" width="16" height="50" fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <line x1="270" y1="200" x2="270" y2="250" stroke="hsl(var(--primary))" strokeWidth="0.8" />

      {/* axles */}
      <rect x="60" y="105" width="280" height="10" rx="3" fill="hsl(var(--muted-foreground) / 0.25)" />
      <rect x="50" y="465" width="300" height="10" rx="3" fill="hsl(var(--muted-foreground) / 0.25)" />

      {/* FX badge front */}
      <circle cx="200" cy="62" r="9" fill="hsl(var(--primary))" />
      <text x="200" y="66" textAnchor="middle" fontSize="9" fontWeight="700" fill="hsl(var(--primary-foreground))">FX</text>

      {/* tyres */}
      {layout.map((pos, i) => {
        const t = tyres[i];
        if (!t) return null;
        const status = t.status as TyreStatus;
        const isHovered = hovered === i;
        const isCritical = status === "critical";
        return (
          <g key={t.position}
             onMouseEnter={() => onHover(i)}
             onMouseLeave={() => onHover(null)}
             className="cursor-pointer"
             style={{ transformOrigin: `${pos.x}px ${pos.y}px`, transform: isHovered ? "scale(1.08)" : "scale(1)", transition: "transform 200ms ease" }}>
            {/* outer halo for critical */}
            {isCritical && (
              <circle cx={pos.x} cy={pos.y} r="32" fill={statusFill.critical} opacity="0.18" className="animate-soft-pulse" />
            )}
            {/* tyre rectangle (top-down rubber) */}
            <rect x={pos.x - 16} y={pos.y - 26} width="32" height="52" rx="6"
              fill="hsl(var(--foreground))" opacity="0.92" />
            {/* tread pattern overlay */}
            <rect x={pos.x - 16} y={pos.y - 26} width="32" height="52" rx="6" fill="url(#treadPattern)" />
            {/* hub */}
            <circle cx={pos.x} cy={pos.y} r="11" fill="hsl(var(--card))" stroke={statusFill[status]} strokeWidth="2.5" />
            {/* lug nuts */}
            {[0, 72, 144, 216, 288].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return <circle key={deg} cx={pos.x + Math.cos(rad) * 6} cy={pos.y + Math.sin(rad) * 6} r="1.4" fill="hsl(var(--muted-foreground))" />;
            })}
            {/* status dot */}
            <circle cx={pos.x + 18} cy={pos.y - 22} r="4.5" fill={statusFill[status]} stroke="hsl(var(--card))" strokeWidth="1.5" />
            {/* label */}
            <text x={pos.x < 200 ? pos.x - 28 : pos.x + 28}
                  y={pos.y + 4}
                  textAnchor={pos.x < 200 ? "end" : "start"}
                  fontSize="10" fontWeight="600" fill="hsl(var(--muted-foreground))">
              {pos.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Tyres() {
  const [busId, setBusId] = useState(buses[0].id);
  const [hovered, setHovered] = useState<number | null>(null);
  const tyres = tyresForBus(busId);
  const bus = buses.find((b) => b.id === busId)!;

  const summary = useMemo(() => {
    const critical = tyres.filter((t) => t.status === "critical").length;
    const low = tyres.filter((t) => t.status === "low").length;
    const ok = tyres.filter((t) => t.status === "ok").length;
    const avgP = Math.round(tyres.reduce((s, t) => s + t.pressure, 0) / tyres.length);
    const avgT = Math.round(tyres.reduce((s, t) => s + t.temperature, 0) / tyres.length);
    const totalKm = tyres.reduce((s, t) => s + t.km, 0);
    return { critical, low, ok, avgP, avgT, totalKm };
  }, [tyres]);

  const focused = hovered !== null ? tyres[hovered] : null;

  return (
    <div className="p-4 md:p-6 space-y-5">
      <PageHeader
        eyebrow="Maintenance"
        title="Tyre Management"
        subtitle={
          <span className="inline-flex items-center gap-2">
            <span className={cn("inline-flex h-2 w-2 rounded-full", summary.critical > 0 ? "bg-destructive animate-pulse" : "bg-success")} />
            {summary.critical > 0 ? `${summary.critical} critical tyre${summary.critical > 1 ? "s" : ""} need attention` : "All tyres within safe range"}
          </span>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Avg Pressure" value={`${summary.avgP} PSI`} icon={Gauge} tone="info" />
        <StatCard label="Avg Temperature" value={`${summary.avgT}°C`} icon={Thermometer} tone="warning" />
        <StatCard label="Healthy Tyres" value={`${summary.ok}/6`} icon={CheckCircle2} tone="success" />
        <StatCard label="Needs Service" value={summary.critical + summary.low} icon={AlertTriangle} tone={summary.critical > 0 ? "destructive" : "warning"} hint={`${summary.critical} critical`} />
      </div>

      <Card className="p-3 shadow-card">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">Select bus</span>
          {buses.slice(0, 12).map((b) => (
            <button key={b.id} onClick={() => { setBusId(b.id); setHovered(null); }}
              className={cn(
                "text-xs px-2.5 py-1.5 rounded-md border transition",
                busId === b.id
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "hover:bg-muted border-border",
              )}>
              {b.number}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bus diagram */}
        <Card className="lg:col-span-2 shadow-card overflow-hidden">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Disc3 className="h-4 w-4 text-primary animate-tyre-spin" />
                {bus.number}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{bus.model} · {bus.registration}</p>
            </div>
            <Badge variant="secondary" className="font-normal">Top view</Badge>
          </CardHeader>
          <CardContent className="pt-0 relative">
            <div className="relative bg-gradient-to-b from-muted/40 to-background rounded-xl py-4 grid-pattern">
              <BusTyreDiagram tyres={tyres} hovered={hovered} onHover={setHovered} />
            </div>
            {/* legend */}
            <div className="flex items-center justify-center gap-4 mt-3 text-[11px]">
              {(["ok","low","critical"] as TyreStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusFill[s] }} />
                  <span className="text-muted-foreground">{statusLabel[s]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tyre details grid */}
        <Card className="lg:col-span-3 shadow-card">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Live tyre telemetry</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {focused ? <>Inspecting <span className="font-semibold text-foreground">{focused.position}</span></> : "Hover the diagram or any card to inspect"}
              </p>
            </div>
            <button className="text-xs inline-flex items-center gap-1.5 text-primary hover:underline">
              <Wrench className="h-3.5 w-3.5" /> Schedule service
            </button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tyres.map((t, i) => {
                const status = t.status as TyreStatus;
                const isFocus = hovered === i;
                return (
                  <div
                    key={t.position}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "rounded-xl border p-3.5 transition-all cursor-pointer",
                      statusToneCard[status],
                      isFocus && "shadow-elev -translate-y-0.5 ring-2 ring-primary/30",
                    )}>
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <PressureRing value={t.pressure} status={status} />
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="text-center leading-none">
                            <div className="text-[13px] font-bold num">{t.pressure}</div>
                            <div className="text-[8px] text-muted-foreground font-semibold">PSI</div>
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground truncate">{t.position}</div>
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: statusFill[status] }} />
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Thermometer className="h-3 w-3" />
                            <span className="num font-semibold text-foreground">{t.temperature}°C</span>
                          </span>
                          <span className="text-muted-foreground">{t.brand}</span>
                        </div>
                        <TreadBar km={t.km} />
                        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>Since {t.installedOn}</span>
                          <span className="num font-medium">{t.km.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}