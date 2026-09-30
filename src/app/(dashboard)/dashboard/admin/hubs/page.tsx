"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2Icon, PowerIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import HubCreateForm from "@/components/form/hub-create-form";
import { HubStatusBadge } from "@/components/module/admin/admin-badges";
import { ConfirmAction } from "@/components/module/admin/confirm-action";
import { DataPagination } from "@/components/module/admin/data-pagination";
import {
  useAdminHubs,
  useDebouncedValue,
  useDeleteHub,
  useUpdateHubStatus,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime } from "@/lib/format";
import type { HubStatus } from "@/types";

const statusOptions: { value: HubStatus | ""; label: string }[] = [
  { value: "", label: "All hubs" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export default function AdminHubsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<HubStatus | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending, isError } = useAdminHubs({
    page,
    limit,
    searchTerm: debouncedSearch.trim(),
    status,
  });

  const { mutate: updateStatus, isPending: statusPending } =
    useUpdateHubStatus();
  const { mutate: deleteHub, isPending: deletePending } = useDeleteHub();

  const hubs = data?.data ?? [];

  const handleToggleStatus = (hubId: string, currentStatus: HubStatus) => {
    const nextStatus: HubStatus =
      currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    updateStatus(
      { hubId, status: nextStatus },
      {
        onSuccess: () => {
          toast.add({
            title: nextStatus === "ACTIVE" ? "Hub activated" : "Hub deactivated",
            type: "success",
          });
        },
        onError: (error: unknown) => {
          toast.add({
            title: "Hub could not be updated",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Hubs</h1>
          <p className="text-sm text-muted-foreground">
            Every pickup and delivery point in the network.
          </p>
        </div>

        <Sheet open={createOpen} onOpenChange={setCreateOpen}>
          <Button onClick={() => setCreateOpen(true)}>
            <Building2Icon /> New Hub
          </Button>

          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Create Hub</SheetTitle>
              <SheetDescription>
                A new hub immediately becomes selectable as a shipment
                destination.
              </SheetDescription>
            </SheetHeader>

            <HubCreateForm onCreated={() => setCreateOpen(false)} />
          </SheetContent>
        </Sheet>
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
            placeholder="Search by name, code, city or phone"
            aria-label="Search hubs"
            className="pl-8"
          />
        </div>

        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as HubStatus | "");
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
          Hubs could not be loaded. Please refresh and try again.
        </p>
      ) : (
        <Card>
          <CardContent className="space-y-4">
            {isPending ? (
              <div className="space-y-2">
                {[0, 1, 2, 3].map((row) => (
                  <Skeleton key={row} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : hubs.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No hubs match your filters.
              </p>
            ) : (
              <ul className="divide-y">
                {hubs.map((hub) => (
                  <li
                    key={hub.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{hub.name}</p>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {hub.hubCode}
                        </span>
                        <HubStatusBadge status={hub.status} />
                      </div>

                      <p className="truncate text-xs text-muted-foreground">
                        {hub.address}, {hub.city}, {hub.district}, {hub.division}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {hub.email || "No email"} &middot; {hub.phone || "No phone"}{" "}
                        &middot; created {formatDateTime(hub.createdAt)}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {hub._count.staffs} staff &middot;{" "}
                        {hub._count.originShipments} outgoing &middot;{" "}
                        {hub._count.destinationShipments} incoming
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        render={<Link href={`/dashboard/admin/hubs/${hub.id}`} />}
                        nativeButton={false}
                      >
                        Open
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={statusPending}
                        onClick={() => handleToggleStatus(hub.id, hub.status)}
                      >
                        {statusPending ? <Spinner /> : <PowerIcon />}
                        {hub.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </Button>

                      <ConfirmAction
                        trigger={<Trash2Icon />}
                        title={`Delete ${hub.name}?`}
                        description="The hub is soft deleted and its staff are moved back to customer accounts. Hubs with active shipments cannot be removed."
                        confirmLabel="Delete hub"
                        isPending={deletePending}
                        onConfirm={() =>
                          deleteHub(hub.id, {
                            onSuccess: () => {
                              toast.add({
                                title: "Hub deleted",
                                type: "success",
                              });
                            },
                            onError: (error: unknown) => {
                              toast.add({
                                title: "Hub could not be deleted",
                                description: getApiErrorMessage(error),
                                type: "error",
                              });
                            },
                          })
                        }
                      />
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
              itemLabel="hubs"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
