import { useState } from "react";
import PageHeader from "@/components/fleet/PageHeader";
import MapView from "@/components/fleet/MapView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buses, getDriver, type Bus, type BusStatus } from "@/data/mock";
import { StatusBadge } from "@/components/fleet/StatusDot";
import { Search, MapPin, Gauge, Fuel, Power, Clock, X } from "lucide-react";
import { Link } from "react-router-dom";

const filters: Array<{ key: BusStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "moving", label: "Moving" },
  { key: "idle", label: "Idle" },
  { key: "parked", label: "Parked" },
  { key: "offline", label: "Offline" },
];

export default function LiveMap() {
  const [filter, setFilter] = useState<BusStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Bus | null>(null);

  const filterFn = (b: Bus) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (query && !b.number.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Live Map" subtitle="Real-time positions across the fleet" />

      <Card className="p-3 flex flex-wrap items-center gap-2 shadow-card">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bus number..." className="pl-8 h-9 w-56" />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {filters.map((f) => (
            <Button key={f.key} variant={filter === f.key ? "default" : "ghost"} size="sm" onClick={() => setFilter(f.key)}>
              {f.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <MapView height="h-[640px]" filter={filterFn} selectedId={selected?.id} onSelect={setSelected} />

        <Card className="p-4 shadow-card h-[640px] overflow-y-auto">
          {!selected ? (
            <div className="h-full grid place-items-center text-center text-sm text-muted-foreground">
              <div>
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" />
                Select any bus on the map to see live details.
              </div>
            </div>
          ) : (
            <BusDetail bus={selected} onClose={() => setSelected(null)} />
          )}
        </Card>
      </div>
    </div>
  );
}

function BusDetail({ bus, onClose }: { bus: Bus; onClose: () => void }) {
  const driver = getDriver(bus.driverId);
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Bus</div>
          <div className="text-lg font-semibold">{bus.number}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{bus.registration}</div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      <StatusBadge status={bus.status} />
      <div className="grid grid-cols-2 gap-2">
        <Stat icon={Gauge} label="Speed" value={`${bus.speed} km/h`} />
        <Stat icon={Fuel} label="Fuel" value={`${bus.fuel}%`} />
        <Stat icon={Power} label="Ignition" value={bus.ignition ? "On" : "Off"} />
        <Stat icon={Clock} label="Last seen" value={bus.lastSeen} />
      </div>
      <div className="rounded-lg border p-3">
        <div className="text-xs text-muted-foreground">Current location</div>
        <div className="text-sm font-medium mt-0.5">{bus.location}</div>
      </div>
      <div className="rounded-lg border p-3">
        <div className="text-xs text-muted-foreground">Driver</div>
        <div className="text-sm font-medium mt-0.5">{driver?.name}</div>
        <div className="text-xs text-muted-foreground">{driver?.phone}</div>
      </div>
      <Button asChild className="w-full"><Link to={`/buses/${bus.id}`}>Open full bus profile</Link></Button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="text-sm font-semibold mt-1 num">{value}</div>
    </div>
  );
}