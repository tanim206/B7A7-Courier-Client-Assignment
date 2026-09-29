"use client";

import type { ReactNode } from "react";
import AuthLoading from "@/auth/auth-loading";
import { useGetMe } from "@/hooks";
import DashboardShell from "@/layout/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data, isPending } = useGetMe();

  const role = data?.data?.role;

  if (isPending || !role) {
    return <AuthLoading />;
  }

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
