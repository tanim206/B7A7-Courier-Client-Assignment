import {
  Building2,
  Database,
  LayoutDashboard,
  Route,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/dashboard/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: `${prefix}`, icon: LayoutDashboard },
      { title: "Hub", url: `${prefix}/hub`, icon: Building2 },
      { title: "Users", url: `${prefix}/users`, icon: Users },
    ],
  },
  {
    title: "App Settings",
    items: [
      { title: "Routing", url: `${prefix}/settings/routing`, icon: Route },
      {
        title: "Data Fetching",
        url: `${prefix}/settings/data-fetching`,
        icon: Database,
      },
    ],
  },
];
