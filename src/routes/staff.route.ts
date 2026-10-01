import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Settings,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/dashboard/staff";

export const staffRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard },
      {
        title: "Shipments",
        url: `${prefix}/shipments`,
        icon: PackageSearch,
      },  
      {
        title: "New Shipment",
        url: `${prefix}/shipments/create`,
        icon: PackagePlus,
      },
      {
        title: "Applications",
        url: `${prefix}/applications`,
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "App Settings",
    items: [{ title: "Settings", url: `${prefix}/settings`, icon: Settings }],
  },
];
