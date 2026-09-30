"use client";

import { useState } from "react";
import Link from "next/link";
import { PackagePlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ShipmentList } from "@/components/module/shipment/shipment-list";
import { useDebouncedValue, useHubShipments } from "@/hooks";
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

export default function StaffShipmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShipmentStatus | "">("");

  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending, isError } = useHubShipments(
    debouncedSearch.trim(),
    status,
  );

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
          <p className="text-sm text-muted-foreground">
            Every parcel that is sent or received by your hub.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/dashboard/staff/shipments/create" />}
        >
          <PackagePlusIcon /> New Shipment
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by shipment id, customer, receiver or parcel"
            aria-label="Search shipments"
            className="pl-8"
          />
        </div>

        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value as ShipmentStatus | "")}
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
        <ShipmentList
          shipments={data?.data ?? []}
          isPending={isPending}
          detailsHref={(shipmentId) =>
            `/dashboard/staff/shipments/${shipmentId}`
          }
          emptyMessage="No shipments match your filters."
        />
      )}
    </div>
  );
}
