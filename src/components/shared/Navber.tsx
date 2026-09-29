"use client";

import UserMenu from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks";
import Link from "next/link";

export default function Navber() {
  const routes = [
    { name: "Home", url: "/" },
    { name: "Doctors", url: "/doctors" },
    { name: "About us", url: "/about-us" },
  ];

  const { data, isLoading } = useGetMe();

  const user = data?.data;

  return (
    <header className="w-full h-16  border border-b">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
        <div>Courier Jhaw</div>
        <nav className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {!isLoading && !user && (
            <Button
              variant="outline"
              render={<Link href="/login">Login</Link>}
              nativeButton={false}
            >
              login
            </Button>
          )}
          {!isLoading && user && <UserMenu />}
        </div>
      </div>
    </header>
  );
}
