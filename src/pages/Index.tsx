import { Bus, Users, AlertTriangle, Fuel, Gauge, Route, Wrench, Activity, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/fleet/PageHeader";
import StatCard from "@/components/fleet/StatCard";
import MapView from "@/components/fleet/MapView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { alerts, buses, fleetStats, getDriver, maintenance } from "@/data/mock";
import { cn } from "@/lib/utils";

const sevTone: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-info/10 text-info border-info/20",
  low: "bg-muted text-muted-foreground border-border",
};

const statusTone: Record<string, string> = {
  ok: "text-muted-foreground",
  soon: "text-warning",
  due: "text-warning",
  overdue: "text-destructive",
};

export default function Index() {
  const recent = alerts.slice(0, 6);
  const upcoming = [...maintenance]
    .sort((a, b) => (a.status === "overdue" ? -1 : 1))
    .slice(0, 5);
  const onTrip = buses.filter((b) => b.status === "moving");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Fleet Overview"
        subtitle="Live status across 25 buses · Updated just now"
        actions={
          <Button asChild size="sm">
            <Link to="/map">Open live map <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Buses" value={fleetStats.total} icon={Bus} hint={`${fleetStats.moving} on trip`} tone="info" />
        <StatCard label="Drivers On Duty" value={fleetStats.driversOnDuty} icon={Users} tone="success" />
        <StatCard label="Open Alerts" value={fleetStats.alertsCritical + fleetStats.alertsHigh + fleetStats.alertsMedium}
          icon={AlertTriangle} hint={`${fleetStats.alertsCritical} critical`} tone="destructive" />
        <StatCard label="Avg Fuel" value={`${fleetStats.avgFuel}%`} icon={Fuel} tone="warning" />
        <StatCard label="Km Today" value={fleetStats.totalKmToday.toLocaleString()} icon={Route} />
        <StatCard label="Trips Today" value={fleetStats.tripsToday} icon={Activity} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Live Fleet Map</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">All 25 buses · click any to inspect</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/map">Full view <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <MapView height="h-[360px]" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Recent Alerts
              <Badge variant="secondary" className="font-normal">{recent.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {recent.map((a) => (
              <Link key={a.id} to="/alerts" className="flex items-start gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-muted/50">
                <span className={cn("mt-0.5 inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase border", sevTone[a.severity])}>
                  {a.severity}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{a.type}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.busId} · {a.location}</div>
                </div>
                <span className="text-xs text-muted-foreground num">{a.time}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Buses currently on trip</CardTitle>
            <Badge variant="secondary" className="font-normal">{onTrip.length}</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {onTrip.slice(0, 6).map((b) => (
                <Link key={b.id} to={`/buses/${b.id}`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40">
                  <div className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center">
                    <Bus className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{b.number}</div>
                    <div className="text-xs text-muted-foreground truncate">{getDriver(b.driverId)?.name} · {b.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold num">{b.speed} <span className="text-xs text-muted-foreground font-normal">km/h</span></div>
                    <div className="text-[11px] text-muted-foreground num">Fuel {b.fuel}%</div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Wrench className="h-4 w-4" /> Upcoming maintenance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {upcoming.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border p-2.5">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{m.busId} · {m.type}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.dueDate ? `Due ${m.dueDate}` : `at ${m.dueKm?.toLocaleString()} km`}
                  </div>
                </div>
                <span className={cn("text-xs font-semibold capitalize", statusTone[m.status])}>{m.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Trips today" value={fleetStats.tripsToday} icon={Activity} />
        <StatCard label="Fuel consumed" value={`${fleetStats.fuelToday} L`} icon={Fuel} />
        <StatCard label="Harsh events" value={fleetStats.harshToday} icon={Gauge} tone="warning" />
        <StatCard label="Docs expiring" value={fleetStats.docsExpiringMonth} icon={AlertTriangle} tone="destructive" hint="this month" />
      </div>
    </div>
  );
}
