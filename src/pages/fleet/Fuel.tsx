import PageHeader from "@/components/fleet/PageHeader";
import StatCard from "@/components/fleet/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buses, fuelEntries, getBus, getDriver } from "@/data/mock";
import { Droplets, Fuel as FuelIcon, AlertTriangle, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Fuel() {
  const totalLitres = fuelEntries.reduce((s, f) => s + f.litres, 0);
  const totalCost = fuelEntries.reduce((s, f) => s + f.litres * f.pricePerLitre, 0);
  const avgEfficiency = 4.8;
  const worst = [...buses].sort((a, b) => a.fuel - b.fuel).slice(0, 4);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Fuel Management" subtitle="Consumption, fills, and theft alerts"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Log fuel fill</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total litres (mo)" value={totalLitres.toLocaleString()} icon={Droplets} tone="info" />
        <StatCard label="Total cost" value={`₹${totalCost.toLocaleString()}`} icon={FuelIcon} tone="warning" />
        <StatCard label="Avg efficiency" value={`${avgEfficiency} km/L`} />
        <StatCard label="Theft alerts" value={3} icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Fuel fill log</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Bus</TableHead><TableHead>Driver</TableHead><TableHead className="text-right">Litres</TableHead><TableHead className="text-right">₹/L</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Vendor</TableHead></TableRow></TableHeader>
              <TableBody>
                {fuelEntries.slice(0, 12).map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="num">{f.date}</TableCell>
                    <TableCell>{getBus(f.busId)?.number}</TableCell>
                    <TableCell>{getDriver(f.driverId)?.name}</TableCell>
                    <TableCell className="text-right num">{f.litres}</TableCell>
                    <TableCell className="text-right num">₹{f.pricePerLitre}</TableCell>
                    <TableCell className="text-right num font-semibold">₹{(f.litres * f.pricePerLitre).toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{f.vendor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Lowest fuel buses</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {worst.map((b) => (
              <div key={b.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{b.number}</div>
                  <div className="text-sm font-semibold num">{b.fuel}%</div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-warning" style={{ width: `${b.fuel}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{b.location}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}