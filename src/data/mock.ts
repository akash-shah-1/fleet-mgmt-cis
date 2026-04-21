// Mock data for the fleet management console.
// All values are deterministic so the UI is stable on every render.

export type BusStatus = "moving" | "idle" | "parked" | "offline";

export interface Bus {
  id: string;
  number: string;
  registration: string;
  model: string;
  year: number;
  chassis: string;
  engine: string;
  imei: string;
  sim: string;
  driverId: string;
  status: BusStatus;
  speed: number;
  fuel: number;
  odometer: number;
  lastSeen: string;
  location: string;
  ignition: boolean;
  // Position on the placeholder map, percentage of map width/height.
  pos: { x: number; y: number };
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  licenseExpiry: string;
  address: string;
  emergency: string;
  busId: string;
  onDuty: boolean;
  score: number;
  trips: number;
  km: number;
  harshEvents: number;
}

export interface Trip {
  id: string;
  busId: string;
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  km: number;
  durationMin: number;
  fuelUsed: number;
  idleMin: number;
  score: number;
  harshEvents: number;
}

export type AlertSeverity = "critical" | "high" | "medium" | "low";
export interface FleetAlert {
  id: string;
  severity: AlertSeverity;
  type: string;
  busId: string;
  driverId: string;
  time: string;
  location: string;
  description: string;
  resolved: boolean;
}

export interface FuelEntry {
  id: string;
  busId: string;
  driverId: string;
  date: string;
  litres: number;
  pricePerLitre: number;
  vendor: string;
}

export interface MaintenanceItem {
  id: string;
  busId: string;
  type: string;
  category: "document" | "service" | "tyre";
  dueDate?: string;
  dueKm?: number;
  currentKm?: number;
  status: "ok" | "soon" | "due" | "overdue";
}

export interface ServiceRecord {
  id: string;
  busId: string;
  date: string;
  km: number;
  type: string;
  cost: number;
  vendor: string;
  notes: string;
}

export interface Tyre {
  position: string;
  pressure: number; // PSI
  temperature: number; // C
  km: number;
  brand: string;
  installedOn: string;
  status: "ok" | "low" | "critical";
}

const driverNames = [
  "Rajesh Kumar","Suresh Patil","Anil Verma","Vikram Singh","Mahesh Joshi",
  "Deepak Yadav","Ramesh Iyer","Sunil Reddy","Manoj Sharma","Prakash Nair",
  "Ashok Mehta","Naveen Rao","Sandeep Pawar","Harish Gupta","Mukesh Desai",
  "Kiran Bhatia","Lokesh Shah","Yogesh More","Pankaj Saxena","Tushar Kale",
  "Amit Khanna","Rohit Bansal","Vivek Malhotra","Ajay Chopra","Karan Bhalla",
];

const models = ["Tata Starbus", "Ashok Leyland Lynx", "Eicher Skyline", "Bharat Benz 1217", "Tata LP 909"];
const places = ["Andheri Depot","Bandra Junction","Borivali Hub","Chembur Stop","Dadar Terminus","Goregaon East","Kandivali Station","Malad West","Powai Lake","Thane Square","Mulund Check Post","Vikhroli Park","Sion Circle","Worli Sea Face","Lower Parel","Kurla West","Ghatkopar Plaza","Vashi Bridge","Panvel Junction","Airoli Sector 7"];

const statuses: BusStatus[] = ["moving","moving","moving","moving","moving","moving","moving","moving","moving","moving","moving","moving","idle","idle","idle","idle","parked","parked","parked","parked","parked","offline","offline","offline","moving"];

function pad(n: number, w = 2) { return String(n).padStart(w, "0"); }
function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }

export const drivers: Driver[] = driverNames.map((name, i) => ({
  id: `D${pad(i + 1, 3)}`,
  name,
  phone: `+91 98${pad((i * 17) % 100)}${pad((i * 31) % 100)}${pad((i * 7) % 100)}`,
  license: `MH${pad((i * 3 + 12) % 100)}-${pad(2018 + (i % 6), 4)}-${pad(10000 + i * 137, 5)}`,
  licenseExpiry: `2025-${pad(((i * 2) % 12) + 1)}-${pad(((i * 5) % 27) + 1)}`,
  address: `${10 + i} Main Road, ${pick(places, i)}`,
  emergency: `+91 99${pad((i * 13) % 100)}${pad((i * 19) % 100)}${pad((i * 23) % 100)}`,
  busId: `B${pad(i + 1, 3)}`,
  onDuty: statuses[i] !== "offline" && statuses[i] !== "parked",
  score: 60 + ((i * 13) % 40),
  trips: 80 + ((i * 7) % 120),
  km: 8000 + ((i * 311) % 12000),
  harshEvents: (i * 3) % 25,
}));

export const buses: Bus[] = Array.from({ length: 25 }, (_, i) => {
  const status = statuses[i];
  const moving = status === "moving";
  return {
    id: `B${pad(i + 1, 3)}`,
    number: `MH-12-BUS-${pad(101 + i)}`,
    registration: `MH12 ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 7) % 26))} ${pad(1000 + i * 37, 4)}`,
    model: pick(models, i),
    year: 2018 + (i % 6),
    chassis: `CHS${pad(100000 + i * 731, 6)}`,
    engine: `ENG${pad(200000 + i * 419, 6)}`,
    imei: `8657${pad(10000000 + i * 91317, 8)}`,
    sim: `+91 90${pad((i * 41) % 100)}${pad((i * 53) % 100)}${pad((i * 67) % 100)}`,
    driverId: `D${pad(i + 1, 3)}`,
    status,
    speed: moving ? 25 + ((i * 7) % 50) : 0,
    fuel: 15 + ((i * 11) % 80),
    odometer: 45000 + i * 1873,
    lastSeen: moving ? "just now" : status === "idle" ? `${(i % 5) + 1} min ago` : status === "parked" ? `${(i % 3) + 1} h ago` : `${(i % 4) + 1} d ago`,
    location: pick(places, i),
    ignition: moving || status === "idle",
    pos: {
      x: 8 + ((i * 137) % 84),
      y: 10 + ((i * 211) % 78),
    },
  };
});

const alertTypes = [
  { type: "Overspeeding", sev: "high" as const },
  { type: "Harsh Braking", sev: "medium" as const },
  { type: "Geofence Exit", sev: "high" as const },
  { type: "Fuel Drop", sev: "critical" as const },
  { type: "Idle Too Long", sev: "low" as const },
  { type: "Tyre Pressure Low", sev: "high" as const },
  { type: "Maintenance Overdue", sev: "critical" as const },
  { type: "Document Expiring", sev: "medium" as const },
  { type: "Harsh Acceleration", sev: "medium" as const },
  { type: "Sharp Cornering", sev: "low" as const },
];

export const alerts: FleetAlert[] = Array.from({ length: 18 }, (_, i) => {
  const t = alertTypes[i % alertTypes.length];
  return {
    id: `AL${pad(i + 1, 4)}`,
    severity: t.sev,
    type: t.type,
    busId: `B${pad(((i * 3) % 25) + 1, 3)}`,
    driverId: `D${pad(((i * 3) % 25) + 1, 3)}`,
    time: `${pad((9 + i) % 24)}:${pad((i * 13) % 60)}`,
    location: pick(places, i),
    description: `${t.type} detected on ${pick(places, i)}.`,
    resolved: i > 9,
  };
});

export const trips: Trip[] = Array.from({ length: 40 }, (_, i) => {
  const busIdx = i % 25;
  return {
    id: `T${pad(i + 1, 4)}`,
    busId: `B${pad(busIdx + 1, 3)}`,
    driverId: `D${pad(busIdx + 1, 3)}`,
    date: `2025-04-${pad(((i % 20) + 1))}`,
    startTime: `${pad(6 + (i % 10))}:${pad((i * 7) % 60)}`,
    endTime: `${pad(8 + (i % 10))}:${pad((i * 11) % 60)}`,
    startLocation: pick(places, i),
    endLocation: pick(places, i + 5),
    km: 18 + ((i * 7) % 60),
    durationMin: 60 + ((i * 13) % 180),
    fuelUsed: 4 + ((i * 3) % 18),
    idleMin: (i * 5) % 30,
    score: 55 + ((i * 11) % 45),
    harshEvents: i % 8,
  };
});

export const fuelEntries: FuelEntry[] = Array.from({ length: 30 }, (_, i) => ({
  id: `F${pad(i + 1, 4)}`,
  busId: `B${pad((i % 25) + 1, 3)}`,
  driverId: `D${pad((i % 25) + 1, 3)}`,
  date: `2025-04-${pad(((i % 20) + 1))}`,
  litres: 30 + ((i * 7) % 80),
  pricePerLitre: 92 + ((i * 3) % 8),
  vendor: pick(["HP Pump - Andheri","BPCL - Bandra","IOC - Thane","Reliance - Vashi","Shell - Powai"], i),
}));

const docTypes = ["PUC", "Insurance", "Fitness Certificate", "Permit"];
export const maintenance: MaintenanceItem[] = [
  ...buses.slice(0, 18).flatMap((b, i) =>
    docTypes.map((d, j) => {
      const days = ((i * 7 + j * 11) % 90) - 10;
      return {
        id: `M-${b.id}-${d}`,
        busId: b.id,
        type: `${d} renewal`,
        category: "document" as const,
        dueDate: `2025-${pad(((j + 4) % 12) + 1)}-${pad(((i * 3) % 27) + 1)}`,
        status: days < 0 ? "overdue" : days < 7 ? "due" : days < 30 ? "soon" : "ok",
      };
    })
  ),
  ...buses.slice(0, 12).map((b, i) => {
    const remaining = ((i * 213) % 5000) - 500;
    return {
      id: `S-${b.id}`,
      busId: b.id,
      type: pick(["Engine Oil Change","Tyre Rotation","Brake Pad Check","Air Filter Replacement","Coolant Top-up"], i),
      category: "service" as const,
      currentKm: b.odometer,
      dueKm: b.odometer + remaining,
      status: remaining < 0 ? "overdue" : remaining < 500 ? "due" : remaining < 1500 ? "soon" : "ok",
    } as MaintenanceItem;
  }),
];

export const services: ServiceRecord[] = Array.from({ length: 24 }, (_, i) => ({
  id: `SR${pad(i + 1, 4)}`,
  busId: `B${pad((i % 25) + 1, 3)}`,
  date: `2025-${pad(((i % 4) + 1))}-${pad(((i * 5) % 27) + 1)}`,
  km: 40000 + i * 1500,
  type: pick(["Engine Oil Change","Tyre Rotation","Brake Pad Replacement","Air Filter","Clutch Repair","General Service"], i),
  cost: 2500 + (i * 437) % 18000,
  vendor: pick(["FleetWorks Garage","TopSpeed Service","City Auto Care","RoadKing Workshop"], i),
  notes: "Routine maintenance completed.",
}));

export const tyrePositions = ["Front Left","Front Right","Rear Left Inner","Rear Left Outer","Rear Right Inner","Rear Right Outer"];

export function tyresForBus(busId: string): Tyre[] {
  const seed = parseInt(busId.replace("B",""), 10);
  return tyrePositions.map((pos, i) => {
    const pressure = 100 + ((seed * (i + 3)) % 25) - 5;
    const temp = 38 + ((seed * (i + 1)) % 25);
    const status = pressure < 95 ? "critical" : pressure < 100 ? "low" : "ok";
    return {
      position: pos,
      pressure,
      temperature: temp,
      km: 8000 + ((seed * 311 + i * 137) % 30000),
      brand: pick(["MRF","Apollo","JK Tyre","CEAT","Bridgestone"], seed + i),
      installedOn: `2024-${pad(((seed + i) % 12) + 1)}-${pad(((seed * i) % 27) + 1)}`,
      status,
    };
  });
}

// Aggregates
export function getBus(id: string) { return buses.find((b) => b.id === id); }
export function getDriver(id: string) { return drivers.find((d) => d.id === id); }

export const fleetStats = {
  total: buses.length,
  moving: buses.filter((b) => b.status === "moving").length,
  idle: buses.filter((b) => b.status === "idle").length,
  parked: buses.filter((b) => b.status === "parked").length,
  offline: buses.filter((b) => b.status === "offline").length,
  driversOnDuty: drivers.filter((d) => d.onDuty).length,
  avgFuel: Math.round(buses.reduce((s, b) => s + b.fuel, 0) / buses.length),
  totalKmToday: 1842,
  tripsToday: 47,
  fuelToday: 612,
  harshToday: 14,
  docsExpiringMonth: 6,
  alertsCritical: alerts.filter((a) => !a.resolved && a.severity === "critical").length,
  alertsHigh: alerts.filter((a) => !a.resolved && a.severity === "high").length,
  alertsMedium: alerts.filter((a) => !a.resolved && a.severity === "medium").length,
};