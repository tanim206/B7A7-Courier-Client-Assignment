"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DataPagination } from "@/components/module/admin/data-pagination";
import { useAdminPayments, useDebouncedValue } from "@/hooks";
import { formatDateTime } from "@/lib/format";
import type { PaymentStatus } from "@/types";

const statusOptions: { value: PaymentStatus | ""; label: string }[] = [
  { value: "", label: "All payments" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

const paymentVariant: Record<
  PaymentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "outline",
  FAILED: "destructive",
  CANCELLED: "secondary",
  REFUNDED: "secondary",
};

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending, isError } = useAdminPayments({
    page,
    limit,
    searchTerm: debouncedSearch.trim(),
    status,
  });

  const payments = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Every bKash transaction collected through the platform.
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
            placeholder="Search by shipment, customer, trx id or invoice"
            aria-label="Search payments"
            className="pl-8"
          />
        </div>

        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as PaymentStatus | "");
            setPage(1);
          }}
          aria-label="Filter by status"
          className="sm:w-44"
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
          Payments could not be loaded. Please refresh and try again.
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
            ) : payments.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No payments match your filters.
              </p>
            ) : (
              <ul className="divide-y">
                {payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">
                          {payment.shipment.parcelName}
                        </p>
                        <Badge variant={paymentVariant[payment.status]}>
                          {payment.status}
                        </Badge>
                      </div>

                      <p className="truncate text-xs text-muted-foreground">
                        {payment.shipment.senderName} &middot;{" "}
                        {payment.shipment.originHub.city} &rarr;{" "}
                        {payment.shipment.destinationHub.city}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        Trx {payment.bkashTrxId || "—"} &middot; invoice{" "}
                        {payment.merchantInvoiceNumber} &middot;{" "}
                        {payment.paidAt
                          ? `paid ${formatDateTime(payment.paidAt)}`
                          : `created ${formatDateTime(payment.createdAt)}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium whitespace-nowrap">
                        {payment.amount} {payment.currency}
                      </span>

                      <Link
                        href={`/dashboard/admin/shipments/${payment.shipment.id}`}
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
              itemLabel="payments"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
