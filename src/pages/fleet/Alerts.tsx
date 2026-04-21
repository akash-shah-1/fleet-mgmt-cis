import { useState } from "react";
import PageHeader from "@/components/fleet/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { alerts, getBus, getDriver, type AlertSeverity } from "@/data/mock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const sevTone: Record<AlertSeverity, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-info/10 text-info border-info/20",
  low: "bg-muted text-muted-foreground border-border",
};

const tabs = ["all", "open", "resolved"] as const;
type Tab = typeof tabs[number];

export default function Alerts() {
  const [tab, setTab] = useState<Tab>("open");
  const rows = alerts.filter((a) => tab === "all" ? true : tab === "open" ? !a.resolved : a.resolved);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Alerts" subtitle="Operational, maintenance, and behavior alerts" />

      <Card className="p-2 shadow-card flex items-center gap-1 w-fit">
        {tabs.map((t) => (
          <Button key={t} size="sm" variant={tab === t ? "default" : "ghost"} onClick={() => setTab(t)} className="capitalize">
            {t}
          </Button>
        ))}
      </Card>

      <Card className="shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Bus</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs uppercase font-semibold", sevTone[a.severity])}>
                    {a.severity}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{a.type}</TableCell>
                <TableCell>{getBus(a.busId)?.number}</TableCell>
                <TableCell>{getDriver(a.driverId)?.name}</TableCell>
                <TableCell className="text-muted-foreground">{a.location}</TableCell>
                <TableCell className="text-right num">{a.time}</TableCell>
                <TableCell className="text-right">
                  {a.resolved ? (
                    <span className="text-xs text-success">Resolved</span>
                  ) : (
                    <Button size="sm" variant="ghost">Acknowledge</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}