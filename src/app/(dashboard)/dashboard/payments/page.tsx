"use client";

import Link from "next/link";
import { PaymentStatusBadge } from "@/components/module/shipment/shipment-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPayments } from "@/hooks";
import { formatDateTime } from "@/lib/format";

export default function MyPaymentsPage() {
  const { data, isPending, isError } = useMyPayments();
  const payments = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Every bKash payment linked to your shipments.
        </p>
      </header>

      {isPending ? (
        <div className="space-y-2">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">
          Payments could not be loaded. Please refresh and try again.
        </p>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            You have no payments yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} size="sm">
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {payment.amount} {payment.currency}
                    </p>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {payment.shipment.parcelName} &middot;{" "}
                    {payment.shipment.originHub.city} &rarr;{" "}
                    {payment.shipment.destinationHub.city}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(payment.createdAt)}
                    {payment.bkashTrxId
                      ? ` · Trx ${payment.bkashTrxId}`
                      : ""}
                  </p>
                </div>

                <Link
                  href={`/dashboard/shipments/${payment.shipmentId}`}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View shipment
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
