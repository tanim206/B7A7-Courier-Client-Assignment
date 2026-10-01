"use client";

import RoleGuard from "@/auth/role-guard";
import HubApplicationForm from "@/components/form/hub-application-form";

export default function CustomerApplicationsPage() {
  return (
    <RoleGuard roles={["CUSTOMER"]}>
      <div className="flex flex-col gap-5 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Staff Application
          </h1>
          <p className="text-sm text-muted-foreground">
            Apply to join a hub as staff. An admin reviews every application
            before the role is granted.
          </p>
        </header>

        <HubApplicationForm />
      </div>
    </RoleGuard>
  );
}