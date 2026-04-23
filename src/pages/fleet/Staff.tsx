import { useMemo, useState } from "react";
import PageHeader from "@/components/fleet/PageHeader";
import StatCard from "@/components/fleet/StatCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { buses, staff as initialStaff, type StaffMember } from "@/data/mock";
import {
  Plus, Search, UserPlus, Users, Camera, ShieldCheck, Bus as BusIcon,
  CheckCircle2, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const roleOptions: StaffMember["role"][] = ["Engineer","Technician","Supervisor","Cleaner","Helper","Manager"];
const shiftOptions: StaffMember["shift"][] = ["Morning","Evening","Night"];

const UNASSIGNED = "__none__";

export default function Staff() {
  const [list, setList] = useState<StaffMember[]>(initialStaff);
  const [q, setQ] = useState("");
  const [busFilter, setBusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    employeeCode: "",
    role: "Engineer" as StaffMember["role"],
    department: "Operations",
    phone: "",
    email: "",
    assignedBusId: UNASSIGNED,
    shift: "Morning" as StaffMember["shift"],
  });

  const rows = useMemo(() => {
    return list.filter((s) => {
      const matchQ =
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.employeeCode.toLowerCase().includes(q.toLowerCase()) ||
        s.email.toLowerCase().includes(q.toLowerCase());
      const matchBus =
        busFilter === "all" ? true :
        busFilter === "unassigned" ? s.assignedBusId === null :
        s.assignedBusId === busFilter;
      return matchQ && matchBus;
    });
  }, [list, q, busFilter]);

  const stats = useMemo(() => ({
    total: list.length,
    assigned: list.filter((s) => s.assignedBusId).length,
    unassigned: list.filter((s) => !s.assignedBusId).length,
    active: list.filter((s) => s.active).length,
  }), [list]);

  function reassign(staffId: string, busId: string) {
    const next = busId === UNASSIGNED ? null : busId;
    setList((prev) => prev.map((s) => s.id === staffId ? { ...s, assignedBusId: next } : s));
    toast.success(next ? `Assigned to ${next}` : "Unassigned from bus");
  }

  function toggleActive(staffId: string) {
    setList((prev) => prev.map((s) => s.id === staffId ? { ...s, active: !s.active } : s));
  }

  function addStaff() {
    if (!form.name.trim() || !form.employeeCode.trim()) {
      toast.error("Name and employee code are required");
      return;
    }
    const id = `S${String(list.length + 1).padStart(3, "0")}`;
    const assigned = form.assignedBusId === UNASSIGNED ? null : form.assignedBusId;
    setList((prev) => [
      {
        id,
        name: form.name.trim(),
        employeeCode: form.employeeCode.trim(),
        role: form.role,
        department: form.department,
        phone: form.phone,
        email: form.email,
        assignedBusId: assigned,
        shift: form.shift,
        active: true,
        joinedOn: new Date().toISOString().slice(0, 10),
        photoSeed: list.length + 1,
      },
      ...prev,
    ]);
    toast.success(`${form.name} added to staff`);
    setOpen(false);
    setForm({
      name: "", employeeCode: "", role: "Engineer", department: "Operations",
      phone: "", email: "", assignedBusId: UNASSIGNED, shift: "Morning",
    });
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      <PageHeader
        eyebrow="Access Control"
        title="Staff & Bus Assignment"
        subtitle="Only assigned staff are authorised to board their bus. Onboard cameras verify identity in real time."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add staff</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" /> New staff member
                </DialogTitle>
                <DialogDescription>
                  Register a new staff member and optionally assign them to a bus.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 py-2">
                <Field label="Full name" required>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Aarav Shah" />
                </Field>
                <Field label="Employee code" required>
                  <Input value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} placeholder="EMP-2025-0001" />
                </Field>
                <Field label="Role">
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as StaffMember["role"] })}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Department">
                  <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                </Field>
                <Field label="Phone">
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." />
                </Field>
                <Field label="Email">
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@fleetx.in" />
                </Field>
                <Field label="Shift">
                  <Select value={form.shift} onValueChange={(v) => setForm({ ...form, shift: v as StaffMember["shift"] })}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {shiftOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Assigned bus">
                  <Select value={form.assignedBusId} onValueChange={(v) => setForm({ ...form, assignedBusId: v })}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                      {buses.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.id} · {b.number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={addStaff}>Save staff</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total staff" value={stats.total} icon={Users} tone="info" />
        <StatCard label="Assigned to bus" value={stats.assigned} icon={BusIcon} tone="success" hint={`${Math.round((stats.assigned / Math.max(stats.total, 1)) * 100)}% coverage`} />
        <StatCard label="Unassigned" value={stats.unassigned} icon={ShieldCheck} tone="warning" />
        <StatCard label="Camera-verified today" value={Math.max(stats.assigned - 2, 0)} icon={Camera} tone="default" hint="Onboard face match" />
      </div>

      <Card className="p-3 flex flex-wrap items-center gap-2 shadow-card">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, employee code, email…"
            className="pl-8 h-9"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Filter by bus</span>
          <Select value={busFilter} onValueChange={setBusFilter}>
            <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All buses</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {buses.map((b) => <SelectItem key={b.id} value={b.id}>{b.id} · {b.number}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Assigned bus</TableHead>
              <TableHead>Camera verification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar seed={s.photoSeed} name={s.name} />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground num">{s.employeeCode}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{s.role}</div>
                  <div className="text-xs text-muted-foreground">{s.department}</div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs border bg-muted text-foreground border-border">
                    {s.shift}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={s.assignedBusId ?? UNASSIGNED}
                    onValueChange={(v) => reassign(s.id, v)}
                  >
                    <SelectTrigger className="h-8 w-[170px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                      {buses.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.id} · {b.number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {s.assignedBusId ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 border bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3" /> Authorised
                      </span>
                      {s.lastSeenAt && (
                        <span className="text-muted-foreground">last seen {s.lastSeenAt}</span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border bg-warning/10 text-warning border-warning/20">
                      <XCircle className="h-3 w-3" /> No bus assigned
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={s.active ? "outline" : "default"}
                    onClick={() => toggleActive(s.id)}
                  >
                    {s.active ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                  No staff found for the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Avatar({ seed, name }: { seed: number; name: string }) {
  const palette = [
    "bg-primary/10 text-primary",
    "bg-info/10 text-info",
    "bg-success/10 text-success",
    "bg-warning/10 text-warning",
    "bg-secondary text-foreground",
  ];
  const cls = palette[seed % palette.length];
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className={cn("h-9 w-9 rounded-full grid place-items-center text-xs font-semibold shrink-0", cls)}>
      {initials}
    </div>
  );
}