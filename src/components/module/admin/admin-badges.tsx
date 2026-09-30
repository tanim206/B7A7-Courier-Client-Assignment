import { Badge } from "@/components/ui/badge";
import type { HubApplicationStatus, HubStatus, UserRole, UserStatus } from "@/types";

/* ==========================================
   USER ROLE + STATUS
   ========================================== */

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  STAFF: "Staff",
  CUSTOMER: "Customer",
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge
      variant={
        role === "SUPER_ADMIN" || role === "ADMIN" ? "default" : "secondary"
      }
    >
      {roleLabels[role]}
    </Badge>
  );
}

const userStatusVariant: Record<
  UserStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  BLOCKED: "destructive",
  DELETED: "outline",
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge variant={userStatusVariant[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

/* ==========================================
   HUB
   ========================================== */

const hubStatusVariant: Record<HubStatus, "default" | "secondary"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
};

export function HubStatusBadge({ status }: { status: HubStatus }) {
  return (
    <Badge variant={hubStatusVariant[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

/* ==========================================
   HUB APPLICATION
   ========================================== */

const applicationStatusVariant: Record<
  HubApplicationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "default",
  APPROVED: "secondary",
  REJECTED: "destructive",
  DRAFT: "outline",
};

const applicationStatusLabel: Record<HubApplicationStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DRAFT: "Draft",
};

export function ApplicationStatusBadge({
  status,
}: {
  status: HubApplicationStatus;
}) {
  return (
    <Badge variant={applicationStatusVariant[status]}>
      {applicationStatusLabel[status]}
    </Badge>
  );
}
