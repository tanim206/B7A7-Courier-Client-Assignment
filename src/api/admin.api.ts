import apiClient from "@/lib/apiClient";
import type {
  AdminAnalytics,
  AdminHub,
  AdminHubApplication,
  AdminHubDetail,
  AdminOverview,
  AdminPayment,
  AdminShipment,
  AdminUser,
  ApiResponse,
  CreateHubPayload,
  HubApplicationStatus,
  HubStatus,
  PaginationMeta,
  ShipmentStatus,
  UpdateHubPayload,
  UserRole,
  UserStatus,
} from "@/types";

type Paginated<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

//  BLANK VALUES ARE DROPPED SO THE BACKEND RECEIVES A CLEAN QUERY

const toQuery = (params: Record<string, string | number | undefined | null>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

/* ==========================================
   DASHBOARD
   ========================================== */

export function getAdminOverview() {
  return apiClient<ApiResponse<AdminOverview>>("/admin/overview");
}

export function getAdminAnalytics() {
  return apiClient<ApiResponse<AdminAnalytics>>("/admin/analytics");
}

/* ==========================================
   USERS
   ========================================== */

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: UserRole | "";
  status?: UserStatus | "";
}

export function getAdminUsers(params: AdminUsersParams) {
  return apiClient<Paginated<AdminUser>>("/admin/users", {
    query: toQuery({ ...params }),
  });
}

export function updateUserStatus(userId: string, status: UserStatus) {
  return apiClient<
    ApiResponse<{ id: string; name: string; status: UserStatus }>
  >(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function updateUserRole(userId: string, role: UserRole) {
  return apiClient<
    ApiResponse<{ id: string; name: string; role: UserRole; hubId: string | null }>
  >(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
  });
}

export function deleteUser(userId: string) {
  return apiClient<ApiResponse<{ id: string; name: string }>>(
    `/admin/users/${userId}`,
    { method: "DELETE" },
  );
}

/* ==========================================
   HUBS
   ========================================== */

export interface AdminHubsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: HubStatus | "";
}

export function getAdminHubs(params: AdminHubsParams) {
  return apiClient<Paginated<AdminHub>>("/admin/hubs", {
    query: toQuery({ ...params }),
  });
}

export function getAdminHubById(hubId: string) {
  return apiClient<ApiResponse<AdminHubDetail>>(`/admin/hubs/${hubId}`);
}

export function createHub(payload: CreateHubPayload) {
  return apiClient<ApiResponse<AdminHub>>("/admin/hubs", {
    method: "POST",
    body: payload,
  });
}

export function updateHub(hubId: string, payload: UpdateHubPayload) {
  return apiClient<ApiResponse<AdminHub>>(`/admin/hubs/${hubId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateHubStatus(hubId: string, status: HubStatus) {
  return apiClient<ApiResponse<AdminHub>>(`/admin/hubs/${hubId}`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteHub(hubId: string) {
  return apiClient<ApiResponse<{ id: string; name: string }>>(
    `/admin/hubs/${hubId}`,
    { method: "DELETE" },
  );
}

/* ==========================================
   HUB APPLICATIONS
   ========================================== */

export interface AdminApplicationsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: HubApplicationStatus | "";
}

export function getAdminApplications(params: AdminApplicationsParams) {
  return apiClient<Paginated<AdminHubApplication>>("/admin/hub-applications", {
    query: toQuery({ ...params }),
  });
}

export function reviewHubApplication(
  applicationId: string,
  body: { action: "APPROVED" | "REJECTED"; rejectionReason?: string },
) {
  return apiClient<ApiResponse<{ applicationId: string; status: HubApplicationStatus }>>(
    `/admin/hub-applications/${applicationId}/review`,
    { method: "PATCH", body },
  );
}

/* ==========================================
   SHIPMENTS
   ========================================== */

export interface AdminShipmentsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: ShipmentStatus | "";
  hubId?: string;
}

export function getAdminShipments(params: AdminShipmentsParams) {
  return apiClient<Paginated<AdminShipment>>("/admin/shipments", {
    query: toQuery({ ...params }),
  });
}

/* ==========================================
   PAYMENTS
   ========================================== */

export interface AdminPaymentsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: import("@/types").PaymentStatus | "";
}

export function getAdminPayments(params: AdminPaymentsParams) {
  return apiClient<Paginated<AdminPayment>>("/admin/payments", {
    query: toQuery({ ...params }),
  });
}
