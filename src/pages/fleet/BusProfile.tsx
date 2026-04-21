import { Link, useParams } from "react-router-dom";
import PageHeader from "@/components/fleet/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBus, getDriver, services, trips, tyresForBus } from "@/data/mock";
import { StatusBadge } from "@/components/fleet/StatusDot";
import { ArrowLeft, Bus as BusIcon, Disc3, Fuel, Gauge, Wrench } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BusProfile() {
  const { id = "" } = useParams();
  const bus = getBus(id);
  if (!bus) return <div className="p-6">Bus not found.</div>;
  const driver = getDriver(bus.driverId);
  const busTrips = trips.filter((t) => t.busId === bus.id).slice(0, 6);
  const busServices = services.filter((s) => s.busId === bus.id).slice(0, 5);
  const tyres = tyresForBus(bus.id);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2"><Link to="/buses"><ArrowLeft className="h-4 w-4 mr-1" /> Buses</Link></Button>
      <PageHeader
        title={bus.number}
        subtitle={`${bus.registration} · ${bus.model} ${bus.year}`}
        actions={<StatusBadge status={bus.status} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Gauge} label="Speed" value={`${bus.speed} km/h`} />
        <Stat icon={Fuel} label="Fuel" value={`${bus.fuel}%`} />
        <Stat icon={BusIcon} label="Odometer" value={`${bus.odometer.toLocaleString()} km`} />
        <Stat icon={Wrench} label="Last service" value={busServices[0]?.date ?? "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Vehicle details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Chassis" v={bus.chassis} />
            <Row k="Engine" v={bus.engine} />
            <Row k="Device IMEI" v={bus.imei} />
            <Row k="SIM" v={bus.sim} />
            <Row k="Location" v={bus.location} />
            <Row k="Last seen" v={bus.lastSeen} />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Assigned driver</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {driver && (
              <>
                <Row k="Name" v={<Link className="hover:text-primary" to={`/drivers/${driver.id}`}>{driver.name}</Link>} />
                <Row k="Phone" v={driver.phone} />
                <Row k="License" v={driver.license} />
                <Row k="License expiry" v={driver.licenseExpiry} />
                <Row k="Behavior score" v={`${driver.score}/100`} />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Disc3 className="h-4 w-4" /> Tyres</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {tyres.map((t) => (
              <div key={t.position} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.position}</span>
                <span className="num font-medium">{t.pressure} PSI · {t.temperature}°C</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent trips</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>Route</TableHead><TableHead className="text-right">Km</TableHead><TableHead className="text-right">Fuel</TableHead><TableHead className="text-right">Score</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {busTrips.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="num">{t.date}</TableCell>
                  <TableCell className="text-muted-foreground">{t.startLocation} → {t.endLocation}</TableCell>
                  <TableCell className="text-right num">{t.km}</TableCell>
                  <TableCell className="text-right num">{t.fuelUsed} L</TableCell>
                  <TableCell className="text-right num">{t.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right truncate">{v}</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="h-4 w-4" /></div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-base font-semibold num">{value}</div>
        </div>
      </div>
    </Card>
  );
}