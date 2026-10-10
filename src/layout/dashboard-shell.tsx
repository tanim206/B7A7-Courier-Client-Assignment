import type { ReactNode } from "react";
import UserMenu from "@/components/dashboard/user-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types/user.type";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="text-sm">{role}</div>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
