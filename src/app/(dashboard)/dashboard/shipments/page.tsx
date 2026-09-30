"use client";

import { ShipmentList } from "@/components/module/shipment/shipment-list";
import { useMyShipments } from "@/hooks";

export default function MyShipmentsPage() {
  const { data, isPending, isError } = useMyShipments();

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">My Shipments</h1>
        <p className="text-sm text-muted-foreground">
          Track every parcel you have sent and its current status.
        </p>
      </header>

      {isError ? (
        <p className="text-sm text-destructive">
          Shipments could not be loaded. Please refresh and try again.
        </p>
      ) : (
        <ShipmentList
          shipments={data?.data ?? []}
          isPending={isPending}
          detailsHref={(shipmentId) => `/dashboard/shipments/${shipmentId}`}
          emptyMessage="You have not sent any shipment yet."
        />
      )}
    </div>
  );
}
