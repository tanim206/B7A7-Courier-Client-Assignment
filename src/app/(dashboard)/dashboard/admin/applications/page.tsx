"use client";

import { useState } from "react";
import {
  CheckIcon,
  ExternalLinkIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ApplicationStatusBadge } from "@/components/module/admin/admin-badges";
import { DataPagination } from "@/components/module/admin/data-pagination";
import {
  useAdminApplications,
  useDebouncedValue,
  useReviewHubApplication,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime } from "@/lib/format";
import type { AdminHubApplication, HubApplicationStatus } from "@/types";

const statusOptions: { value: HubApplicationStatus | ""; label: string }[] = [
  { value: "", label: "All applications" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DRAFT", label: "Draft" },
];

export default function AdminApplicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<HubApplicationStatus | "">("PENDING");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  //  THE REJECTION REASON IS COLLECTED IN A SHEET SO A HALF
  //  TYPED REASON IS NEVER SENT AS AN EMPTY APPROVAL

  const [activeApplication, setActiveApplication] =
    useState<AdminHubApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending, isError } = useAdminApplications({
    page,
    limit,
    searchTerm: debouncedSearch.trim(),
    status,
  });

  const { mutate: review, isPending: reviewPending } = useReviewHubApplication();

  const applications = data?.data ?? [];

  const runReview = (
    applicationId: string,
    action: "APPROVED" | "REJECTED",
    reason?: string,
  ) => {
    review(
      { applicationId, action, rejectionReason: reason },
      {
        onSuccess: () => {
          toast.add({
            title: action === "APPROVED" ? "Application approved" : "Application rejected",
            description:
              action === "APPROVED"
                ? "The applicant is now a staff member of that hub."
                : "The applicant has been notified by email.",
            type: "success",
          });

          setActiveApplication(null);
          setRejectionReason("");
          setReasonError(null);
        },
        onError: (error: unknown) => {
          toast.add({
            title: "Application could not be reviewed",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleRejectClick = () => {
    if (!activeApplication) {
      return;
    }

    const trimmed = rejectionReason.trim();

    if (trimmed.length < 5) {
      setReasonError("Please give a reason of at least 5 characters");
      return;
    }

    setReasonError(null);
    runReview(activeApplication.id, "REJECTED", trimmed);
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Hub Applications
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject customers who applied to join a hub as staff.
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
            placeholder="Search by applicant, phone or hub"
            aria-label="Search applications"
            className="pl-8"
          />
        </div>

        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as HubApplicationStatus | "");
            setPage(1);
          }}
          aria-label="Filter by status"
          className="sm:w-48"
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
          Applications could not be loaded. Please refresh and try again.
        </p>
      ) : (
        <Card>
          <CardContent className="space-y-4">
            {isPending ? (
              <div className="space-y-2">
                {[0, 1, 2].map((row) => (
                  <Skeleton key={row} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No applications match your filters.
              </p>
            ) : (
              <ul className="divide-y">
                {applications.map((application) => (
                  <li
                    key={application.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">
                          {application.name}
                        </p>
                        <ApplicationStatusBadge
                          status={application.status}
                        />
                      </div>

                      <p className="truncate text-xs text-muted-foreground">
                        {application.email} &middot; {application.phone}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        Applied for{" "}
                        <span className="font-medium text-foreground">
                          {application.hub.name} ({application.hub.hubCode})
                        </span>{" "}
                        &middot; {application.city}, {application.district},{" "}
                        {application.division}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        Applied {formatDateTime(application.createdAt)}
                        {application.reviewedAt &&
                          ` · reviewed ${formatDateTime(application.reviewedAt)}`}
                        {application.reviewedBy &&
                          ` by ${application.reviewedBy.name}`}
                      </p>

                      {application.rejectionReason && (
                        <p className="truncate text-xs text-destructive">
                          Reason: {application.rejectionReason}
                        </p>
                      )}

                      {application.additionalFiles?.length ? (
                        <ul className="flex flex-wrap gap-2 pt-1">
                          {application.additionalFiles.map((file) => (
                            <li key={file.publicId}>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                              >
                                <ExternalLinkIcon className="size-3" />
                                Attachment
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    {application.status === "PENDING" && (
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={reviewPending}
                          onClick={() =>
                            runReview(application.id, "APPROVED")
                          }
                        >
                          {reviewPending ? <Spinner /> : <CheckIcon />}
                          Approve
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setActiveApplication(application);
                            setRejectionReason("");
                            setReasonError(null);
                          }}
                        >
                          <XIcon /> Reject
                        </Button>
                      </div>
                    )}
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
              itemLabel="applications"
            />
          </CardContent>
        </Card>
      )}

      {/*  REJECTION REASON  */}

      <Sheet
        open={Boolean(activeApplication)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveApplication(null);
            setRejectionReason("");
            setReasonError(null);
          }
        }}
      >
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>
              Reject {activeApplication?.name ?? "application"}
            </SheetTitle>
            <SheetDescription>
              The reason is emailed to the applicant and stored on the
              application.
            </SheetDescription>
          </SheetHeader>

          <Field data-invalid={Boolean(reasonError)}>
            <FieldLabel htmlFor="rejectionReason">Rejection Reason</FieldLabel>
            <Input
              id="rejectionReason"
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);
                setReasonError(null);
              }}
              placeholder="Explain why this application was rejected"
              aria-invalid={Boolean(reasonError)}
            />
            {reasonError && <FieldError>{reasonError}</FieldError>}
          </Field>

          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setActiveApplication(null)}
              disabled={reviewPending}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={reviewPending}
            >
              {reviewPending && <Spinner />}
              Reject application
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
