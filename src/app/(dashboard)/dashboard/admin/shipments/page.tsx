"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentStatusBadge } from "@/components/module/shipment/shipment-status-badge";
import { DataPagination } from "@/components/module/admin/data-pagination";
import { useAdminShipments, useDebouncedValue } from "@/hooks";
import { formatDateTime } from "@/lib/format";
import type { ShipmentStatus } from "@/types";

const statusOptions: { value: ShipmentStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Awaiting Payment" },
  { value: "PICKUP_SCHEDULED", label: "Pickup Scheduled" },
  { value: "PICKED_UP", label: "Picked Up" },
  { value: "AT_ORIGIN_HUB", label: "At Origin Hub" },
  { value: "TRANSIT", label: "In Transit" },
  { value: "AT_DESTINATION_HUB", label: "At Destination Hub" },
  { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "FAILED_DELIVERY", label: "Delivery Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminShipmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShipmentStatus | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending, isError } = useAdminShipments({
    page,
    limit,
    searchTerm: debouncedSearch.trim(),
    status,
  });

  const shipments = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">All Shipments</h1>
        <p className="text-sm text-muted-foreground">
          Every parcel on the network, across all hubs.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by id, customer, receiver or parcel"
            aria-label="Search shipments"
            className="pl-8"
          />
        </div>

        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as ShipmentStatus | "");
            setPage(1);
          }}
          aria-label="Filter by status"
          className="sm:w-56"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">
          Shipments could not be loaded. Please refresh and try again.
        </p>
      ) : (
        <Card>
          <CardContent className="space-y-4">
            {isPending ? (
              <div className="space-y-2">
                {[0, 1, 2, 3].map((row) => (
                  <Skeleton key={row} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : shipments.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No shipments match your filters.
              </p>
            ) : (
              <ul className="divide-y">
                {shipments.map((shipment) => (
                  <li
                    key={shipment.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">
                          {shipment.parcelName}
                        </p>
                        <ShipmentStatusBadge status={shipment.status} />
                        {shipment.payment && (
                          <Badge
                            variant={
                              shipment.payment.status === "PAID"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {shipment.payment.status}
                          </Badge>
                        )}
                      </div>

                      <p className="truncate text-xs text-muted-foreground">
                        {shipment.originHub.city} &rarr;{" "}
                        {shipment.destinationHub.city} &middot;{" "}
                        {shipment.senderName} &rarr; {shipment.receiverName}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {shipment.id.slice(0, 8)} &middot; created by{" "}
                        {shipment.createdBy.name} &middot;{" "}
                        {formatDateTime(shipment.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium whitespace-nowrap">
                        {shipment.deliveryCharge} BDT
                      </span>

                      <Link
                        href={`/dashboard/admin/shipments/${shipment.id}`}
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Open
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <DataPagination
              meta={data?.meta}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(next) => {
                setLimit(next);
                setPage(1);
              }}
              itemLabel="shipments"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
