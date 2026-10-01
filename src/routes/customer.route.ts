import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  PackageSearch,
  Settings,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/dashboard";

export const customerRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard },
      {
        title: "My Shipments",
        url: `${prefix}/shipments`,
        icon: PackageSearch,
      },
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
      {
        title: "Staff Application",
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
