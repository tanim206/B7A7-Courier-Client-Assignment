import type { ReactNode } from "react";
import RoleGuard from "@/auth/role-guard";

/* ==========================================
   EVERY /dashboard/admin PAGE IS ADMIN ONLY
   THE GUARD IS HERE SO A NEW SUB PAGE CANNOT
   ACCIDENTALLY SHIP WITHOUT IT
   ========================================== */

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>{children}</RoleGuard>;
}
