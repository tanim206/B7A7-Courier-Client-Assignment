import {
  Building2,
  ChartNoAxesColumn,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  PackageSearch,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/dashboard/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: prefix, icon: LayoutDashboard },
      { title: "Shipments", url: `${prefix}/shipments`, icon: PackageSearch },
      { title: "Hubs", url: `${prefix}/hubs`, icon: Building2 },
      {
        title: "Applications",
        url: `${prefix}/applications`,
        icon: ClipboardList,
      },
      { title: "Users", url: `${prefix}/users`, icon: Users },
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        title: "Analytics",
        url: `${prefix}/analytics`,
        icon: ChartNoAxesColumn,
      },
    ],
  },
];
