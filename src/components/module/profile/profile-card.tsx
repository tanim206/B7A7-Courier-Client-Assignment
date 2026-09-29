"use client";

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  KeyRound,
  LogIn,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetMe } from "@/hooks";
import type { UserRole, UserStatus } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const humanize = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const roleStyles: Record<UserRole, string> = {
  SUPER_ADMIN: "border-transparent bg-primary/15 text-primary",
  ADMIN: "border-transparent bg-chart-1/20 text-foreground",
  STAFF: "border-transparent bg-chart-2/20 text-foreground",
  CUSTOMER: "border-transparent bg-secondary text-secondary-foreground",
};

const statusStyles: Record<UserStatus, string> = {
  ACTIVE:
    "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  BLOCKED: "border-transparent bg-destructive/15 text-destructive",
  DELETED: "border-transparent bg-muted text-muted-foreground",
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

function ProfileRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm break-words">{children}</span>
      </div>
    </div>
  );
}

export default function ProfileCard() {
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            The account you are currently signed in with.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            {user.imageUrl ? (
              // biome-ignore lint/performance/noImgElement: remote avatar
              <img
                src={user.imageUrl}
                alt={user.name}
                className="size-20 rounded-full object-cover ring-1 ring-foreground/10"
              />
            ) : (
              <span className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground ring-1 ring-foreground/10">
                {initialsOf(user.name) || <UserIcon className="size-8" />}
              </span>
            )}

            <div className="flex flex-col items-center gap-2 sm:items-start">
              <h1 className="font-heading text-xl font-semibold">
                {user.name}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge className={roleStyles[user.role]}>
                  <ShieldCheck />
                  {humanize(user.role)}
                </Badge>
                <Badge className={statusStyles[user.status]}>
                  {humanize(user.status)}
                </Badge>
                {user.emailVerified && (
                  <Badge className="border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    <BadgeCheck />
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <ProfileRow icon={<Mail className="size-4" />} label="Email">
              {user.email}
            </ProfileRow>

            <ProfileRow icon={<Phone className="size-4" />} label="Phone">
              {user.phone || "Not provided"}
            </ProfileRow>

            <ProfileRow
              icon={<KeyRound className="size-4" />}
              label="Sign in method"
            >
              {humanize(user.authProvider)}
            </ProfileRow>

            <ProfileRow
              icon={<Building2 className="size-4" />}
              label="Assigned hub"
            >
              {user.hub ? (
                <span className="flex flex-col">
                  <span>{user.hub.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.hub.hubCode} &middot; {user.hub.city}
                  </span>
                </span>
              ) : (
                "Not assigned"
              )}
            </ProfileRow>

            <ProfileRow
              icon={<CalendarDays className="size-4" />}
              label="Member since"
            >
              {dateFormatter.format(new Date(user.createdAt))}
            </ProfileRow>

            <ProfileRow icon={<LogIn className="size-4" />} label="Last login">
              {user.lastLoginAt
                ? dateTimeFormatter.format(new Date(user.lastLoginAt))
                : "Not available"}
            </ProfileRow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
