import PageHeader from "@/components/fleet/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { maintenance, services, getBus } from "@/data/mock";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  ok: "bg-success/10 text-success border-success/20",
  soon: "bg-info/10 text-info border-info/20",
  due: "bg-warning/10 text-warning border-warning/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Maintenance() {
  const docs = maintenance.filter((m) => m.category === "document");
  const svc = maintenance.filter((m) => m.category === "service");

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Maintenance" subtitle="Documents, services, and history"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add service</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Document compliance</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader><TableRow><TableHead>Bus</TableHead><TableHead>Document</TableHead><TableHead>Due</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {docs.slice(0, 12).map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{getBus(m.busId)?.number}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell className="num">{m.dueDate}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs capitalize", tone[m.status])}>{m.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Km-based reminders</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader><TableRow><TableHead>Bus</TableHead><TableHead>Service</TableHead><TableHead className="text-right">Due km</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {svc.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{getBus(m.busId)?.number}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell className="text-right num">{m.dueKm?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs capitalize", tone[m.status])}>{m.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Service history</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Bus</TableHead><TableHead>Type</TableHead><TableHead>Vendor</TableHead><TableHead className="text-right">Km</TableHead><TableHead className="text-right">Cost</TableHead></TableRow></TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="num">{s.date}</TableCell>
                  <TableCell>{getBus(s.busId)?.number}</TableCell>
                  <TableCell>{s.type}</TableCell>
                  <TableCell className="text-muted-foreground">{s.vendor}</TableCell>
                  <TableCell className="text-right num">{s.km.toLocaleString()}</TableCell>
                  <TableCell className="text-right num font-semibold">₹{s.cost.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}