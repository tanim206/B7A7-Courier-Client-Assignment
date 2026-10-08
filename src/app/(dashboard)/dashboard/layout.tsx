"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLoading from "@/auth/auth-loading";
import { useGetMe } from "@/hooks";
import DashboardShell from "@/layout/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;
  const role = user?.role;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !user) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !role) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
