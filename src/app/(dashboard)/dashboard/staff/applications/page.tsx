"use client";

import {
  CheckIcon,
  CircleDashedIcon,
  MailCheckIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
} from "lucide-react";
import RoleGuard from "@/auth/role-guard";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserRoleBadge,
  UserStatusBadge,
} from "@/components/module/admin/admin-badges";
import { useGetMe } from "@/hooks";
import { formatDateTime } from "@/lib/format";

const steps = [
  {
    title: "Apply to a hub",
    description: "A customer submits the form with their contact details.",
  },
  {
    title: "Verify the emailed code",
    description:
      "The application only moves forward once the emailed code is submitted.",
  },
  {
    title: "Admin review",
    description:
      "An admin approves or rejects the application and the applicant is emailed.",
  },
  {
    title: "Staff access granted",
    description:
      "An approved applicant becomes staff of that hub and can work in the hub dashboard.",
  },
];

export default function StaffApplicationsPage() {
  const { data, isPending } = useGetMe();
  const me = data?.data;

  return (
    <RoleGuard roles={["STAFF"]}>
      <div className="flex flex-col gap-5 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Staff Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            How a staff application is reviewed and where you currently stand.
          </p>
        </header>

        {isPending || !me ? (
          <div className="space-y-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-56 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-4" /> Your staff access
                </CardTitle>
                <CardDescription>
                  Your hub and role come from the application an admin approved.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="truncate text-right font-medium">
                      {me.name}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="truncate text-right font-medium">
                      {me.email}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="text-right font-medium">{me.phone}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Role</dt>
                    <dd>
                      <UserRoleBadge role={me.role} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Account status</dt>
                    <dd>
                      <UserStatusBadge status={me.status} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Account created</dt>
                    <dd className="text-right font-medium">
                      {formatDateTime(me.createdAt)}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {me.hub ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your hub</CardTitle>
                  <CardDescription>
                    You can only receive and send parcels for this hub.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Hub</dt>
                      <dd className="text-right font-medium">
                        {me.hub.name}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Hub code</dt>
                      <dd className="text-right font-medium">
                        {me.hub.hubCode}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">City</dt>
                      <dd className="text-right font-medium">
                        {me.hub.city}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">District</dt>
                      <dd className="text-right font-medium">
                        {me.hub.district}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Division</dt>
                      <dd className="text-right font-medium">
                        {me.hub.division}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <TriangleAlertIcon className="size-4" /> No hub assigned
                  </CardTitle>
                  <CardDescription>
                    Your account has the staff role but is not linked to a hub, so
                    hub shipments are not available. Contact an admin to get a hub
                    assigned.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  Every application moves through the same four steps.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ol className="space-y-4">
                  {steps.map((step, index) => {
                    const isLast = index === steps.length - 1;

                    return (
                      <li key={step.title} className="flex gap-3">
                        {isLast ? (
                          <span
                            aria-hidden="true"
                            className="grid size-7 place-items-center rounded-lg bg-secondary text-secondary-foreground"
                          >
                            <CheckIcon className="size-3.5" />
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="grid size-7 place-items-center rounded-lg text-muted-foreground"
                          >
                            <CircleDashedIcon className="size-3.5" />
                          </span>
                        )}

                        <div className="min-w-0 space-y-0.5">
                          <p className="text-sm font-medium">{step.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MailCheckIcon className="size-4" />
              You are emailed whenever an admin reviews an application.
            </p>
          </>
        )}
      </div>
    </RoleGuard>
  );
}