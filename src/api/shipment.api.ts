import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateShipmentPayload,
  CreateShipmentResult,
  CustomerOption,
  DeliveryChargeQuote,
  MyPayment,
  RetryPaymentResult,
  Shipment,
  ShipmentDetail,
  ShipmentHub,
  ShipmentStatus,
} from "@/types";

/* ==========================================
   REFERENCE DATA
========================================== */

export function getActiveHubs() {
  return apiClient<ApiResponse<ShipmentHub[]>>("/hub/active");
}

export function searchCustomers(params: { searchTerm?: string }) {
  return apiClient<ApiResponse<CustomerOption[]>>("/hub/customers/search", {
    query: params,
  });
}

export function getDeliveryChargeQuote(params: {
  destinationHubId: string;
  weight: number;
}) {
  return apiClient<ApiResponse<DeliveryChargeQuote>>(
    "/shipments/delivery-charge",
    { query: params },
  );
}

/* ==========================================
   SHIPMENTS
========================================== */

export function createShipment(payload: CreateShipmentPayload) {
  return apiClient<ApiResponse<CreateShipmentResult>>("/shipments", {
    method: "POST",
    body: payload,
  });
}

export function retryShipmentPayment(shipmentId: string) {
  return apiClient<ApiResponse<RetryPaymentResult>>(
    `/shipments/${shipmentId}/payment/retry`,
    { method: "POST" },
  );
}

export function getMyShipments() {
  return apiClient<ApiResponse<Shipment[]>>("/shipments/my");
}

export function getHubShipments(params: {
  searchTerm?: string;
  status?: ShipmentStatus | "";
}) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments", {
    query: {
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
  });
}

export function getShipmentById(shipmentId: string) {
  return apiClient<ApiResponse<ShipmentDetail>>(`/shipments/${shipmentId}`);
}

export function receiveShipment(shipmentId: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${shipmentId}/receive`, {
    method: "PATCH",
  });
}

export function deliverShipment(shipmentId: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${shipmentId}/deliver`, {
    method: "PATCH",
  });
}

/* ==========================================
   PAYMENTS
========================================== */

export function getMyPayments() {
  return apiClient<ApiResponse<MyPayment[]>>("/payment/my-payments");
}
