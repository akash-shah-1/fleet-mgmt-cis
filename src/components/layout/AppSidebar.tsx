import {
  LayoutDashboard, Map, Bus, Users, Route, Fuel, Wrench, Disc3,
  Gauge, BellRing, FileBarChart, IdCard,
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
  { title: "Staff", url: "/staff", icon: IdCard },
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
        <div className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-primary-foreground font-bold shadow-glow text-[13px] tracking-tight">
            FX
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-tight">FleetX Console</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-medium">Operator panel</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60 rounded-lg transition-colors text-[13px]"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                    >
                      <item.icon className="h-[15px] w-[15px]" />
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