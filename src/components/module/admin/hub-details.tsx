"use client";

import Link from "next/link";
import { ArrowLeftIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { HubStatusBadge } from "@/components/module/admin/admin-badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserStatusBadge } from "@/components/module/admin/admin-badges";
import HubEditForm from "@/components/form/hub-edit-form";
import { useAdminHubById } from "@/hooks";
import { formatDateTime } from "@/lib/format";

const infoRowClass = "flex items-start gap-2 text-sm";

export default function AdminHubDetailsPage({
  hubId,
}: {
  hubId: string;
}) {
  const { data, isPending, isError } = useAdminHubById(hubId);

  const hub = data?.data;

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-sm text-destructive">
              This hub could not be loaded.
            </p>
            <Button
              render={<Link href="/dashboard/admin/hubs" />}
              nativeButton={false}
            >
              Back to hubs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPending || !hub) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <Button
        render={<Link href="/dashboard/admin/hubs" />}
        variant="ghost"
        nativeButton={false}
        className="w-fit"
      >
        <ArrowLeftIcon /> Back to hubs
      </Button>

      <header className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{hub.name}</h1>
          <p className="text-sm text-muted-foreground">
            {hub.hubCode} &middot; created {formatDateTime(hub.createdAt)}
          </p>
        </div>

        <HubStatusBadge status={hub.status} />
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-5">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Contact &amp; Location</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className={infoRowClass}>
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  {hub.address}, {hub.city}, {hub.district}, {hub.division}
                </span>
              </p>

              <p className={infoRowClass}>
                <MailIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="break-all">{hub.email ?? "—"}</span>
              </p>

              <p className={infoRowClass}>
                <PhoneIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{hub.phone ?? "—"}</span>
              </p>

              <p className={infoRowClass}>
                <span className="text-muted-foreground">Created by</span>
                <span>{hub.createdBy?.name ?? "—"}</span>
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Volume</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-semibold">
                  {hub._count.originShipments}
                </p>
                <p className="text-xs text-muted-foreground">Outgoing</p>
              </div>

              <div>
                <p className="text-xl font-semibold">
                  {hub._count.destinationShipments}
                </p>
                <p className="text-xs text-muted-foreground">Incoming</p>
              </div>

              <div>
                <p className="text-xl font-semibold">
                  {hub._count.staffs}
                </p>
                <p className="text-xs text-muted-foreground">Staff</p>
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Staff</CardTitle>
              <CardDescription>
                Staff are assigned when a hub application is approved.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {hub.staffs.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No staff assigned yet.
                </p>
              ) : (
                <ul className="divide-y">
                  {hub.staffs.map((staff) => (
                    <li
                      key={staff.id}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{staff.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {staff.email}
                        </p>
                      </div>

                      <UserStatusBadge status={staff.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <HubEditForm hub={hub} />
      </div>
    </div>
  );
}
