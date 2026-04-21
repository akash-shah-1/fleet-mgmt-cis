import {
  LayoutDashboard, Map, Bus, Users, Route, Fuel, Wrench, Disc3,
  Gauge, BellRing, FileBarChart,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Live Map", url: "/map", icon: Map },
  { title: "Buses", url: "/buses", icon: Bus },
  { title: "Drivers", url: "/drivers", icon: Users },
  { title: "Trips", url: "/trips", icon: Route },
  { title: "Fuel", url: "/fuel", icon: Fuel },
  { title: "Maintenance", url: "/maintenance", icon: Wrench },
  { title: "Tyres", url: "/tyres", icon: Disc3 },
  { title: "Driver Behavior", url: "/behavior", icon: Gauge },
  { title: "Alerts", url: "/alerts", icon: BellRing },
  { title: "Reports", url: "/reports", icon: FileBarChart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-bold shadow-elev">
            FX
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">FleetX Console</div>
              <div className="text-[11px] text-muted-foreground">Operator panel</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60 rounded-md"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}