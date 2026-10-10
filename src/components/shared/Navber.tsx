"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import UserMenu from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks";
import { Logo } from "@/utils/logo";

export default function Navber() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Contact", url: "/contact" },
  ];

  const { data, isLoading } = useGetMe();

  const user = data?.data;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" onClick={closeMobileMenu}>
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.url}
              href={route.url}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {route.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 md:flex">
          {!isLoading && !user && (
            <Button
              variant="outline"
              render={<Link href="/login">Login</Link>}
              nativeButton={false}
            >
              Login
            </Button>
          )}

          {!isLoading && user && <UserMenu />}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-muted md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4">
            {routes.map((route) => (
              <Link
                key={route.url}
                href={route.url}
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                {route.name}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="mt-3 border-t pt-3">
              {!isLoading && !user && (
                <Button
                  variant="outline"
                  className="w-full"
                  render={<Link href="/login">Login</Link>}
                  nativeButton={false}
                  onClick={closeMobileMenu}
                >
                  Login
                </Button>
              )}

              {!isLoading && user && (
                <div onClick={closeMobileMenu}>
                  <UserMenu />
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
