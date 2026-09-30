"use client";

import Link from "next/link";
import {
  Building2Icon,
  CircleDollarSignIcon,
  ClipboardListIcon,
  PackageCheckIcon,
  PackageIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentStatusBadge } from "@/components/module/shipment/shipment-status-badge";
import { StatCard } from "@/components/module/admin/stat-card";
import { useAdminOverview } from "@/hooks";
import { formatDateTime } from "@/lib/format";
import type { ShipmentStatus } from "@/types";

//  THE BUSIEST STATES ARE SHOWN FIRST SO THE OVERVIEW STAYS SHORT

const highlightStatuses: ShipmentStatus[] = [
  "PENDING",
  "PICKUP_SCHEDULED",
  "AT_ORIGIN_HUB",
  "TRANSIT",
  "AT_DESTINATION_HUB",
  "DELIVERED",
];

export default function AdminOverviewPage() {
  const { data, isPending, isError } = useAdminOverview();

  const overview = data?.data;
  const byStatus = overview?.shipments.byStatus;

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Network health across every hub, shipment and payment.
        </p>
      </header>

      {isError && (
        <p className="text-sm text-destructive">
          The overview could not be loaded. Please refresh and try again.
        </p>
      )}

      {/*  PRIMARY METRICS  */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={overview ? `${overview.payments.totalRevenue} BDT` : 0}
          hint="Collected from paid shipments"
          icon={CircleDollarSignIcon}
          tone="success"
          isPending={isPending}
        />

        <StatCard
          label="Shipments"
          value={overview?.shipments.total ?? 0}
          hint={`${overview?.shipments.delivered ?? 0} delivered`}
          icon={PackageIcon}
          isPending={isPending}
        />

        <StatCard
          label="Hubs"
          value={overview?.hubs.total ?? 0}
          hint={`${overview?.hubs.active ?? 0} active`}
          icon={Building2Icon}
          isPending={isPending}
        />

        <StatCard
          label="Users"
          value={overview?.users.total ?? 0}
          hint={`${overview?.users.staff ?? 0} staff`}
          icon={UsersIcon}
          isPending={isPending}
        />
      </div>

      {/*  ATTENTION REQUIRED  */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Pending Applications"
          value={overview?.applications.pending ?? 0}
          hint="Hub staff awaiting review"
          icon={ClipboardListIcon}
          tone={overview?.applications.pending ? "warning" : "default"}
          isPending={isPending}
        />

        <StatCard
          label="Failed Deliveries"
          value={byStatus?.FAILED_DELIVERY ?? 0}
          hint="Need a second attempt"
          icon={TriangleAlertIcon}
          tone={byStatus?.FAILED_DELIVERY ? "danger" : "default"}
          isPending={isPending}
        />

        <StatCard
          label="Unpaid Shipments"
          value={byStatus?.PENDING ?? 0}
          hint="Waiting for bKash payment"
          icon={PackageCheckIcon}
          tone={byStatus?.PENDING ? "warning" : "default"}
          isPending={isPending}
        />
      </div>

      {/*  PIPELINE BREAKDOWN  */}

      <Card>
        <CardHeader>
          <CardTitle>Shipment Pipeline</CardTitle>
          <CardDescription>
            How many shipments sit in each stage right now.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((cell) => (
                <Skeleton key={cell} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {highlightStatuses.map((status) => {
                const count = byStatus?.[status] ?? 0;
                const total = overview?.shipments.total ?? 0;
                const percent = total > 0 ? (count / total) * 100 : 0;

                return (
                  <li
                    key={status}
                    className="space-y-1.5 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <ShipmentStatusBadge status={status} />
                      <span className="text-sm font-semibold">{count}</span>
                    </div>

                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      role="presentation"
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/*  RECENT ACTIVITY  */}

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>The five newest parcels on the network.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isPending ? (
            <div className="space-y-2">
              {[0, 1, 2].map((row) => (
                <Skeleton key={row} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : overview?.recentShipments.length ? (
            <ul className="divide-y">
              {overview.recentShipments.map((shipment) => (
                <li
                  key={shipment.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {shipment.parcelName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {shipment.originHub.city} &rarr;{" "}
                      {shipment.destinationHub.city} &middot;{" "}
                      {shipment.receiverName} &middot;{" "}
                      {formatDateTime(shipment.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium whitespace-nowrap">
                      {shipment.deliveryCharge} BDT
                    </span>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No shipments yet.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/admin/shipments" />}
            >
              All shipments
            </Button>

            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/admin/analytics" />}
            >
              View analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
