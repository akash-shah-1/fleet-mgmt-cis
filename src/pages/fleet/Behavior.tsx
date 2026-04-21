import PageHeader from "@/components/fleet/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { drivers } from "@/data/mock";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Behavior() {
  const ranked = [...drivers].sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, 3);
  const bottom = ranked.slice(-3).reverse();

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Driver Behavior" subtitle="Scoring across all drivers · last 30 days" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-success" /> Top performers</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0">
            {top.map((d, i) => (
              <Row key={d.id} d={d} rank={i + 1} tone="success" />
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ArrowDownRight className="h-4 w-4 text-destructive" /> Needs attention</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0">
            {bottom.map((d, i) => (
              <Row key={d.id} d={d} rank={drivers.length - i} tone="destructive" />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Full leaderboard</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {ranked.map((d, i) => (
              <Link key={d.id} to={`/drivers/${d.id}`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40">
                <div className="h-8 w-8 rounded-md bg-muted text-muted-foreground grid place-items-center text-xs font-semibold">#{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.harshEvents} harsh · {d.trips} trips</div>
                </div>
                <div className={cn("text-base font-semibold num",
                  d.score >= 85 ? "text-success" : d.score >= 70 ? "text-warning" : "text-destructive")}>
                  {d.score}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ d, rank, tone }: { d: any; rank: number; tone: "success" | "destructive" }) {
  return (
    <Link to={`/drivers/${d.id}`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40">
      <div className={cn("h-9 w-9 rounded-md grid place-items-center text-sm font-bold",
        tone === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
        #{rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{d.name}</div>
        <div className="text-xs text-muted-foreground">{d.km.toLocaleString()} km · {d.harshEvents} harsh events</div>
      </div>
      <div className="flex items-center gap-1 text-base font-semibold num">
        {tone === "success" ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
        {d.score}
      </div>
    </Link>
  );
}