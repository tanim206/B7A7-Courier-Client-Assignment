import type { UserRole } from "@/types";

export * from "./admin.route";
export * from "./customer.route";
export * from "./staff.route";

/* ==========================================
   PROFILE ROUTES
   EVERY ROLE KEEPS ITS OWN SETTINGS PAGE UNDER
   ITS OWN DASHBOARD PREFIX
   THE PHOTO IS CHANGED ON A SEPARATE URL SO THE
   FORM STAYS SHORT
========================================== */

export const settingsRouteByRole: Record<UserRole, string> = {
  SUPER_ADMIN: "/dashboard/admin/settings",
  ADMIN: "/dashboard/admin/settings",
  STAFF: "/dashboard/staff/settings",
  CUSTOMER: "/dashboard/settings",
};

export const profileImageRoute = "/dashboard/profile/image";
