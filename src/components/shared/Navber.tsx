"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { UserRole } from "@/types/user.type";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const routes = [
    { name: "Home", url: "/" },
    { name: "Doctors", url: "/doctors" },
    { name: "About us", url: "/about-us" },
  ];

  const dashboardRoute: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    ADMIN: "/admin",
    CUSTOMER: "/customer",
    STAFF: "/staff",
  };
  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const role: UserRole = !!data?.data && data?.data.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (res) => {
        toast.add({
          title: "User Logout Successfully",
          description: "Welcome Back",
          type: "success",
        });

        queryClient.removeQueries({
          queryKey: ["user"],
        });

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
    <header className="w-full h-16  border border-b">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
        <div>PH Healthcare</div>
        <nav className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}
        </nav>
        <div>
          {role && <Link href={dashboardRoute[role]}>Dashboard</Link>}
          {!isLoading && !data && (
            <Button
              variant="outline"
              render={<Link href="/login">Login</Link>}
              nativeButton={false}
            >
              login
            </Button>
          )}
          {!isLoading && data && (
            <Button onClick={handleLogout} variant="destructive">
              logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
