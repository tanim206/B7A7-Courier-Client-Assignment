import {
  createHub as createHubApi,
  deleteHub as deleteHubApi,
  deleteUser as deleteUserApi,
  getAdminAnalytics,
  getAdminApplications,
  getAdminHubById,
  getAdminHubs,
  getAdminOverview,
  getAdminPayments,
  getAdminShipments,
  getAdminUsers,
  reviewHubApplication,
  updateHub as updateHubApi,
  updateHubStatus as updateHubStatusApi,
  updateUserRole as updateUserRoleApi,
  updateUserStatus as updateUserStatusApi,
} from "@/api";
import type {
  AdminApplicationsParams,
  AdminHubsParams,
  AdminPaymentsParams,
  AdminShipmentsParams,
  AdminUsersParams,
} from "@/api";
import type {
  HubStatus,
  PaginationMeta,
  ShipmentStatus,
  UpdateHubPayload,
  UserRole,
  UserStatus,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ==========================================
   QUERY KEYS
   ========================================== */

export const adminKeys = {
  all: ["admin"] as const,
  overview: ["admin", "overview"] as const,
  analytics: ["admin", "analytics"] as const,
  users: ["admin", "users"] as const,
  hubs: ["admin", "hubs"] as const,
  hub: (hubId: string) => ["admin", "hubs", "detail", hubId] as const,
  applications: ["admin", "applications"] as const,
  shipments: ["admin", "shipments"] as const,
  payments: ["admin", "payments"] as const,
};

const resolvePage = (meta?: PaginationMeta) => ({
  page: meta?.page ?? 1,
  limit: meta?.limit ?? 10,
  total: meta?.total ?? 0,
  totalPages: meta?.totalPages ?? 1,
});

/* ==========================================
   DASHBOARD
   ========================================== */

export function useAdminOverview() {
  return useQuery({
    queryKey: adminKeys.overview,
    queryFn: getAdminOverview,
    refetchInterval: 60 * 1000,
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics,
    queryFn: getAdminAnalytics,
    staleTime: 60 * 1000,
  });
}

/* ==========================================
   USERS
   ========================================== */

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: [...adminKeys.users, params],
    queryFn: () => getAdminUsers(params),
    placeholderData: (previous) => previous,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateUserStatusApi(userId, status),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRoleApi(userId, role),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUserApi(userId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/* ==========================================
   HUBS
   ========================================== */

export function useAdminHubs(params: AdminHubsParams) {
  return useQuery({
    queryKey: [...adminKeys.hubs, params],
    queryFn: () => getAdminHubs(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminHubById(hubId: string) {
  return useQuery({
    queryKey: adminKeys.hub(hubId),
    queryFn: () => getAdminHubById(hubId),
    enabled: Boolean(hubId),
  });
}

export function useCreateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHubApi,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useUpdateHubStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hubId, status }: { hubId: string; status: HubStatus }) =>
      updateHubStatusApi(hubId, status),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useUpdateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hubId, ...payload }: { hubId: string } & UpdateHubPayload) =>
      updateHubApi(hubId, payload),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.all }),
        queryClient.invalidateQueries({ queryKey: adminKeys.hub(variables.hubId) }),
      ]);
    },
  });
}

export function useDeleteHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hubId: string) => deleteHubApi(hubId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/* ==========================================
   HUB APPLICATIONS
   ========================================== */

export function useAdminApplications(params: AdminApplicationsParams) {
  return useQuery({
    queryKey: [...adminKeys.applications, params],
    queryFn: () => getAdminApplications(params),
    placeholderData: (previous) => previous,
  });
}

export function useReviewHubApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      action,
      rejectionReason,
    }: {
      applicationId: string;
      action: "APPROVED" | "REJECTED";
      rejectionReason?: string;
    }) => reviewHubApplication(applicationId, { action, rejectionReason }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/* ==========================================
   SHIPMENTS + PAYMENTS
   ========================================== */

export function useAdminShipments(params: AdminShipmentsParams) {
  return useQuery({
    queryKey: [...adminKeys.shipments, params],
    queryFn: () => getAdminShipments(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminPayments(params: AdminPaymentsParams) {
  return useQuery({
    queryKey: [...adminKeys.payments, params],
    queryFn: () => getAdminPayments(params),
    placeholderData: (previous) => previous,
  });
}

export { resolvePage };
export type { ShipmentStatus };
