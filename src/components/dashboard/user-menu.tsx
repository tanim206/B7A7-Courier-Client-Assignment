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

        queryClient.removeQueries({ queryKey: ["user"] });

        router.push("/");
        router.refresh();
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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center rounded-full border p-1 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Open profile menu"
      >
        {user.imageUrl ? (
          // biome-ignore lint/performance/noImgElement: remote avatar
          <img
            src={user.imageUrl}
            alt={user.name}
            className="size-6 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-6 items-center justify-center rounded-full">
            <User className="size-4" />
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate text-sm text-foreground">
              {user.name}
            </span>
            <span className="truncate text-xs font-normal">{user.email}</span>
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
  );
}
