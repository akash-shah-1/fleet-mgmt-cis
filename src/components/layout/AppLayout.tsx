import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Search, Bell, CircleUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fleetStats } from "@/data/mock";

export default function AppLayout() {
  const openAlerts = fleetStats.alertsCritical + fleetStats.alertsHigh + fleetStats.alertsMedium;
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-4 border-b bg-card/80 backdrop-blur sticky top-0 z-30">
            <SidebarTrigger />
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search bus, driver, trip..." className="pl-8 h-9 bg-muted/40 border-transparent focus-visible:bg-background" />
              </div>
            </div>
            <div className="flex-1 md:hidden" />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {openAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-[10px] text-destructive-foreground grid place-items-center font-medium">
                  {openAlerts}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <CircleUser className="h-5 w-5" />
            </Button>
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}