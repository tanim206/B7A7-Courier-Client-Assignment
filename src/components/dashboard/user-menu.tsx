"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import type { UserRole } from "@/types/user.type";

const dashboardRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/dashboard/admin",
  ADMIN: "/dashboard/admin",
  CUSTOMER: "/dashboard",
  STAFF: "/dashboard/staff",
};

export default function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useGetMe();
  const { mutate: logout } = useLogout();

  const user = data?.data;
  const role: UserRole | undefined = user?.role;

  if (!user || !role) {
    return null;
  }

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "User Logout Successfully",
          description: "Welcome Back",
          type: "success",
        });

        queryClient.clear();
        queryClient.removeQueries({ queryKey: ["user"] });

        router.push("/");
      },
      onError: (err) => {
        toast.add({
          title: "Logout Failed",
          description: err.message || "Something went wrong, Please try again",
          type: "error",
        });
      },
    });
  };

  return (
    <>
      {/* ================= Desktop User Menu ================= */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center rounded-full border p-1 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Open profile menu"
          >
            {user.imageUrl ? (
              // biome-ignore lint/performance/noImgElement: remote avatar
              <img
                src={user.imageUrl}
                alt={user.name}
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full">
                <User className="size-4" />
              </span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-2">
                <span className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </span>

                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              render={
                <Link href="/dashboard/profile">
                  <User />
                  Profile
                </Link>
              }
            />

            <DropdownMenuItem
              render={
                <Link href={dashboardRoute[role]}>
                  <LayoutDashboard />
                  Dashboard
                </Link>
              }
            />

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ================= Mobile User Menu ================= */}
      <div className="block md:hidden">
        {/* User Information */}
        <div className="mb-3 flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
          {user.imageUrl ? (
            // biome-ignore lint/performance/noImgElement: remote avatar
            <img
              src={user.imageUrl}
              alt={user.name}
              className="size-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
              <User className="size-5" />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="space-y-1">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <User className="size-4" />
            <span>Profile</span>
          </Link>

          <Link
            href={dashboardRoute[role]}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
