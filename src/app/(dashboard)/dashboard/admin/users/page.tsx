"use client";

import { useState } from "react";
import {
  BanIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  UserRoleBadge,
  UserStatusBadge,
} from "@/components/module/admin/admin-badges";
import { ConfirmAction } from "@/components/module/admin/confirm-action";
import { DataPagination } from "@/components/module/admin/data-pagination";
import {
  useAdminUsers,
  useDeleteUser,
  useGetMe,
  useUpdateUserRole,
  useUpdateUserStatus,
  useDebouncedValue,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime } from "@/lib/format";
import type { UserRole, UserStatus } from "@/types";

const roleOptions: { value: UserRole | ""; label: string }[] = [
  { value: "", label: "All roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "CUSTOMER", label: "Customer" },
];

const statusOptions: { value: UserStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "DELETED", label: "Deleted" },
];

//  A REGULAR ADMIN CANNOT EDIT AN ADMIN, SO THE UI MATCHES THE BACKEND

const adminRoles: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebouncedValue(search);

  const { data: meData } = useGetMe();
  const currentUser = meData?.data;
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const { data, isPending, isError } = useAdminUsers({
    page,
    limit,
    searchTerm: debouncedSearch.trim(),
    role,
    status,
  });

  const { mutate: updateStatus, isPending: statusPending } =
    useUpdateUserStatus();
  const { mutate: updateRole, isPending: rolePending } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: deletePending } = useDeleteUser();

  const users = data?.data ?? [];

  const canEditUser = (targetId: string, targetRole: UserRole) => {
    if (targetId === currentUser?.id) {
      return false;
    }

    return isSuperAdmin || !adminRoles.includes(targetRole);
  };

  const handleToggleStatus = (userId: string, currentStatus: UserStatus) => {
    const nextStatus: UserStatus =
      currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";

    updateStatus(
      { userId, status: nextStatus },
      {
        onSuccess: () => {
          toast.add({
            title: nextStatus === "BLOCKED" ? "User blocked" : "User unblocked",
            type: "success",
          });
        },
        onError: (error: unknown) => {
          toast.add({
            title: "Status could not be changed",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleRoleChange = (userId: string, nextRole: UserRole) => {
    updateRole(
      { userId, role: nextRole },
      {
        onSuccess: () => {
          toast.add({ title: "Role updated", type: "success" });
        },
        onError: (error: unknown) => {
          toast.add({
            title: "Role could not be changed",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage accounts, roles and access across the whole platform.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
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
            placeholder="Search by name, email or phone"
            aria-label="Search users"
            className="pl-8"
          />
        </div>

        <Select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as UserRole | "");
            setPage(1);
          }}
          aria-label="Filter by role"
          className="sm:w-44"
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as UserStatus | "");
            setPage(1);
          }}
          aria-label="Filter by status"
          className="sm:w-40"
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
          Users could not be loaded. Please refresh and try again.
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
            ) : users.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No users match your filters.
              </p>
            ) : (
              <ul className="divide-y">
                {users.map((user) => {
                  const editable = canEditUser(user.id, user.role);
                  const isSelf = user.id === currentUser?.id;

                  return (
                    <li
                      key={user.id}
                      className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">{user.name}</p>
                          <UserRoleBadge role={user.role} />
                          <UserStatusBadge status={user.status} />
                          {isSelf && (
                            <span className="text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email} &middot; {user.phone}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.hub
                            ? `${user.hub.name} (${user.hub.hubCode})`
                            : "No hub assigned"}{" "}
                          &middot; {user._count.sentShipments} sent &middot;{" "}
                          {user._count.createdShipments} created &middot; joined{" "}
                          {formatDateTime(user.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {isSuperAdmin && !isSelf && (
                          <Select
                            value={user.role}
                            onChange={(event) =>
                              handleRoleChange(
                                user.id,
                                event.target.value as UserRole,
                              )
                            }
                            disabled={rolePending}
                            aria-label={`Change role for ${user.name}`}
                            className="w-40"
                          >
                            {roleOptions.slice(1).map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                        )}

                        {editable && user.status !== "DELETED" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={statusPending}
                              onClick={() =>
                                handleToggleStatus(user.id, user.status)
                              }
                            >
                              {statusPending ? (
                                <Spinner />
                              ) : user.status === "BLOCKED" ? (
                                <UserCheckIcon />
                              ) : (
                                <BanIcon />
                              )}
                              {user.status === "BLOCKED"
                                ? "Unblock"
                                : "Block"}
                            </Button>

                            <ConfirmAction
                              trigger={<Trash2Icon />}
                              title={`Delete ${user.name}?`}
                              description="This account is soft deleted and can no longer sign in. Historic shipments are kept."
                              confirmLabel="Delete user"
                              isPending={deletePending}
                              onConfirm={() =>
                                deleteUser(user.id, {
                                  onSuccess: () => {
                                    toast.add({
                                      title: "User deleted",
                                      type: "success",
                                    });
                                  },
                                  onError: (error: unknown) => {
                                    toast.add({
                                      title: "User could not be deleted",
                                      description:
                                        getApiErrorMessage(error),
                                      type: "error",
                                    });
                                  },
                                })
                              }
                            />
                          </>
                        )}

                        {isSelf && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ShieldCheckIcon className="size-3.5" />
                            Your own account is locked
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
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
              itemLabel="users"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
