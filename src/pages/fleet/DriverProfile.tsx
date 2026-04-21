import { Link, useParams } from "react-router-dom";
import PageHeader from "@/components/fleet/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDriver, trips } from "@/data/mock";
import { ArrowLeft, Phone, MapPin, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DriverProfile() {
  const { id = "" } = useParams();
  const d = getDriver(id);
  if (!d) return <div className="p-6">Driver not found.</div>;
  const driverTrips = trips.filter((t) => t.driverId === d.id);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2"><Link to="/drivers"><ArrowLeft className="h-4 w-4 mr-1" /> Drivers</Link></Button>
      <PageHeader title={d.name} subtitle={`License ${d.license} · expires ${d.licenseExpiry}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Behavior score" value={`${d.score}/100`} icon={Award} />
        <Stat label="Total trips" value={d.trips.toString()} />
        <Stat label="Total km" value={d.km.toLocaleString()} />
        <Stat label="Harsh events" value={d.harshEvents.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Personal</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k={<><Phone className="h-3.5 w-3.5 inline mr-1" /> Phone</>} v={d.phone} />
            <Row k={<><MapPin className="h-3.5 w-3.5 inline mr-1" /> Address</>} v={d.address} />
            <Row k="Emergency" v={d.emergency} />
            <Row k="Assigned bus" v={d.busId} />
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-base">Recent trips</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Route</TableHead><TableHead className="text-right">Km</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
              <TableBody>
                {driverTrips.slice(0, 8).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="num">{t.date}</TableCell>
                    <TableCell className="text-muted-foreground">{t.startLocation} → {t.endLocation}</TableCell>
                    <TableCell className="text-right num">{t.km}</TableCell>
                    <TableCell className="text-right num">{t.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <Card className="p-4 shadow-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1 num flex items-center gap-2">{Icon && <Icon className="h-4 w-4 text-primary" />}{value}</div>
    </Card>
  );
}
function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{v}</span></div>;
}