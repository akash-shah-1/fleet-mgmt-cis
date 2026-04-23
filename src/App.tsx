import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./components/layout/AppLayout";
import LiveMap from "./pages/fleet/LiveMap";
import Buses from "./pages/fleet/Buses";
import BusProfile from "./pages/fleet/BusProfile";
import Drivers from "./pages/fleet/Drivers";
import DriverProfile from "./pages/fleet/DriverProfile";
import Trips from "./pages/fleet/Trips";
import Fuel from "./pages/fleet/Fuel";
import Maintenance from "./pages/fleet/Maintenance";
import Tyres from "./pages/fleet/Tyres";
import Behavior from "./pages/fleet/Behavior";
import Alerts from "./pages/fleet/Alerts";
import Reports from "./pages/fleet/Reports";
import Staff from "./pages/fleet/Staff";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/buses/:id" element={<BusProfile />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/drivers/:id" element={<DriverProfile />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/tyres" element={<Tyres />} />
            <Route path="/behavior" element={<Behavior />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/staff" element={<Staff />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
