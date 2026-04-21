import { useState } from "react";
import PageHeader from "@/components/fleet/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buses, tyresForBus } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Disc3 } from "lucide-react";

const statusTone: Record<string, string> = {
  ok: "border-success/30 bg-success/5 text-success",
  low: "border-warning/40 bg-warning/10 text-warning",
  critical: "border-destructive/40 bg-destructive/10 text-destructive",
};

export default function Tyres() {
  const [busId, setBusId] = useState(buses[0].id);
  const tyres = tyresForBus(busId);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Tyre Management" subtitle="Pressure, temperature and replacement history" />

      <Card className="p-3 shadow-card flex flex-wrap gap-2">
        {buses.slice(0, 12).map((b) => (
          <button key={b.id} onClick={() => setBusId(b.id)}
            className={cn("text-xs px-2.5 py-1.5 rounded-md border transition", busId === b.id ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted")}>
            {b.number}
          </button>
        ))}
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3 flex-row items-center gap-2">
          <Disc3 className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Live tyre status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tyres.map((t) => (
              <div key={t.position} className={cn("rounded-xl border p-4", statusTone[t.status])}>
                <div className="text-xs uppercase tracking-wide opacity-80">{t.position}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <div className="text-2xl font-semibold num">{t.pressure}</div>
                  <div className="text-xs">PSI</div>
                </div>
                <div className="mt-1 text-xs">Temp <span className="num font-medium">{t.temperature}°C</span></div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {t.brand} · since {t.installedOn} · <span className="num">{t.km.toLocaleString()} km</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}