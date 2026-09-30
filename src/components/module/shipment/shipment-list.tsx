"use client";

import Link from "next/link";
import { PackageOpenIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentStatusBadge } from "@/components/module/shipment/shipment-status-badge";
import type { Shipment } from "@/types";

interface IProps {
  shipments: Shipment[];
  isPending?: boolean;
  detailsHref: (shipmentId: string) => string;
  emptyMessage?: string;
}

export function ShipmentList({
  shipments,
  isPending,
  detailsHref,
  emptyMessage = "No shipments found.",
}: IProps) {
  if (isPending) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((row) => (
          <Skeleton key={row} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <PackageOpenIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/*  DESKTOP TABLE  */}

      <div className="hidden overflow-hidden rounded-xl border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Shipment
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Route
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Receiver
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Charge
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{shipment.parcelName}</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.id.slice(0, 8)} &middot;{" "}
                    {shipment.weight ? `${shipment.weight} KG` : "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {shipment.originHub.city} &rarr; {shipment.destinationHub.city}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{shipment.receiverName}</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.receiverPhone}
                  </p>
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {shipment.deliveryCharge} BDT
                </td>
                <td className="px-4 py-3">
                  <ShipmentStatusBadge status={shipment.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={detailsHref(shipment.id)}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  MOBILE CARDS  */}

      <div className="space-y-3 md:hidden">
        {shipments.map((shipment) => (
          <Card key={shipment.id} size="sm">
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{shipment.parcelName}</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.id.slice(0, 8)}
                  </p>
                </div>
                <ShipmentStatusBadge status={shipment.status} />
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Route</dt>
                  <dd className="font-medium">
                    {shipment.originHub.city} &rarr;{" "}
                    {shipment.destinationHub.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Charge</dt>
                  <dd className="font-medium">
                    {shipment.deliveryCharge} BDT
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Receiver</dt>
                  <dd className="truncate font-medium">
                    {shipment.receiverName}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="font-medium">
                    {shipment.weight ? `${shipment.weight} KG` : "—"}
                    {shipment.payment && (
                      <Badge
                        variant={
                          shipment.payment.status === "PAID"
                            ? "default"
                            : "outline"
                        }
                        className="ml-1.5"
                      >
                        {shipment.payment.status}
                      </Badge>
                    )}
                  </dd>
                </div>
              </dl>

              <Link
                href={detailsHref(shipment.id)}
                className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                View details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
