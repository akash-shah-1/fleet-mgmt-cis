import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/fleet/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buses, drivers, getDriver, type BusStatus } from "@/data/mock";
import { StatusBadge } from "@/components/fleet/StatusDot";
import { Plus, Search } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const statusFilters: Array<{ key: BusStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "moving", label: "Moving" },
  { key: "idle", label: "Idle" },
  { key: "parked", label: "Parked" },
  { key: "offline", label: "Offline" },
];

export default function Buses() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BusStatus | "all">("all");
  const navigate = useNavigate();

  const rows = useMemo(() =>
    buses.filter((b) =>
      (status === "all" || b.status === status) &&
      (b.number.toLowerCase().includes(q.toLowerCase()) ||
        b.registration.toLowerCase().includes(q.toLowerCase()) ||
        getDriver(b.driverId)?.name.toLowerCase().includes(q.toLowerCase()))
    ), [q, status]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader
        title="Bus Management"
        subtitle={`${buses.length} buses · ${drivers.length} drivers`}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add bus</Button>}
      />

      <Card className="p-3 flex flex-wrap items-center gap-2 shadow-card">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bus, plate, driver..." className="pl-8 h-9 w-72" />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {statusFilters.map((f) => (
            <Button key={f.key} variant={status === f.key ? "default" : "ghost"} size="sm" onClick={() => setStatus(f.key)}>
              {f.label}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus #</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Fuel</TableHead>
              <TableHead className="text-right">Odometer</TableHead>
              <TableHead>Last seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow
                key={b.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/buses/${b.id}`)}
              >
                <TableCell className="font-medium">
                  <Link
                    to={`/buses/${b.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-primary"
                  >
                    {b.number}
                  </Link>
                </TableCell>
                <TableCell className="num">{b.registration}</TableCell>
                <TableCell className="text-muted-foreground">{b.model} · {b.year}</TableCell>
                <TableCell>{getDriver(b.driverId)?.name}</TableCell>
                <TableCell><StatusBadge status={b.status} /></TableCell>
                <TableCell className="text-right num">{b.fuel}%</TableCell>
                <TableCell className="text-right num">{b.odometer.toLocaleString()} km</TableCell>
                <TableCell className="text-muted-foreground">{b.lastSeen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}