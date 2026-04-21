import PageHeader from "@/components/fleet/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, BarChart3, Disc3, Download, FileText, Fuel, Gauge, Route, Wrench } from "lucide-react";

const reports = [
  { title: "Daily fleet summary", desc: "Per-bus km, trips, fuel and events for any day.", icon: BarChart3 },
  { title: "Trip report", desc: "All trips in a date range, filterable by bus or driver.", icon: Route },
  { title: "Fuel consumption", desc: "Litres, cost, and km/L by bus and date range.", icon: Fuel },
  { title: "Driver behavior", desc: "Scores, harsh events and rankings.", icon: Gauge },
  { title: "Maintenance cost", desc: "Service spend by bus and period.", icon: Wrench },
  { title: "Compliance status", desc: "All document expiry dates across the fleet.", icon: FileText },
  { title: "Tyre status", desc: "Tyre km, last replaced, and costs.", icon: Disc3 },
  { title: "Harsh events", desc: "All harsh driving events by bus or driver.", icon: AlertTriangle },
  { title: "Live activity feed", desc: "Live operational events log.", icon: Activity },
];

export default function Reports() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title="Reports" subtitle="Generate, download or schedule recurring reports" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {reports.map((r) => (
          <Card key={r.title} className="shadow-card hover:shadow-elev transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><r.icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5 mr-1" /> Excel</Button>
                    <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5 mr-1" /> PDF</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}