import { useState } from "react";
import PageHeader from "@/components/fleet/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trips, getBus, getDriver } from "@/data/mock";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Trips() {
  const [q, setQ] = useState("");
  const rows = trips.filter((t) =>
    !q ||
    t.startLocation.toLowerCase().includes(q.toLowerCase()) ||
    t.endLocation.toLowerCase().includes(q.toLowerCase()) ||
    t.busId.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Trips" subtitle={`${trips.length} trips logged this period`} />

      <Card className="p-3 shadow-card">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bus or location..." className="pl-8 h-9" />
        </div>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Bus</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead className="text-right">Km</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Fuel</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="num">{t.date} · {t.startTime}</TableCell>
                <TableCell>{getBus(t.busId)?.number}</TableCell>
                <TableCell>{getDriver(t.driverId)?.name}</TableCell>
                <TableCell className="text-muted-foreground">{t.startLocation} → {t.endLocation}</TableCell>
                <TableCell className="text-right num">{t.km}</TableCell>
                <TableCell className="text-right num">{Math.floor(t.durationMin/60)}h {t.durationMin%60}m</TableCell>
                <TableCell className="text-right num">{t.fuelUsed} L</TableCell>
                <TableCell className="text-right num font-semibold">{t.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}