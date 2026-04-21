import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/fleet/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { drivers } from "@/data/mock";
import { Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

function scoreColor(s: number) {
  if (s >= 85) return "text-success";
  if (s >= 70) return "text-warning";
  return "text-destructive";
}

export default function Drivers() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => drivers.filter((d) =>
    d.name.toLowerCase().includes(q.toLowerCase()) || d.license.toLowerCase().includes(q.toLowerCase())
  ), [q]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Driver Management" subtitle={`${drivers.length} drivers in the roster`}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add driver</Button>} />

      <Card className="p-3 flex items-center gap-2 shadow-card">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or license..." className="pl-8 h-9" />
        </div>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>License</TableHead>
              <TableHead>License expiry</TableHead>
              <TableHead>Bus</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <Link to={`/drivers/${d.id}`} className="font-medium hover:text-primary">{d.name}</Link>
                  <div className="text-xs text-muted-foreground">{d.phone}</div>
                </TableCell>
                <TableCell className="num">{d.license}</TableCell>
                <TableCell className="num">{d.licenseExpiry}</TableCell>
                <TableCell>{d.busId}</TableCell>
                <TableCell className={cn("text-right num font-semibold", scoreColor(d.score))}>{d.score}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs border",
                    d.onDuty ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border")}>
                    {d.onDuty ? "On duty" : "Off duty"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}