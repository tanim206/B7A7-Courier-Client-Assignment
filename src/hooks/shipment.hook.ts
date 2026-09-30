import {
  createShipment,
  deliverShipment,
  getActiveHubs,
  getDeliveryChargeQuote,
  getHubShipments,
  getMyPayments,
  getMyShipments,
  getShipmentById,
  receiveShipment,
  retryShipmentPayment,
  searchCustomers,
} from "@/api";
import type { CreateShipmentPayload, ShipmentStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ==========================================
   QUERY KEYS
========================================== */

export const shipmentKeys = {
  all: ["shipments"] as const,
  hubs: ["shipments", "hubs"] as const,
  customers: (searchTerm: string) =>
    ["shipments", "customers", searchTerm] as const,
  quote: (destinationHubId: string, weight: number) =>
    ["shipments", "quote", destinationHubId, weight] as const,
  my: ["shipments", "my"] as const,
  hub: (searchTerm: string, status: ShipmentStatus | "") =>
    ["shipments", "hub", searchTerm, status] as const,
  detail: (shipmentId: string) =>
    ["shipments", "detail", shipmentId] as const,
  payments: ["shipments", "payments"] as const,
};

/* ==========================================
   REFERENCE DATA
========================================== */

export function useActiveHubs() {
  return useQuery({
    queryKey: shipmentKeys.hubs,
    queryFn: getActiveHubs,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchCustomers(searchTerm: string) {
  return useQuery({
    queryKey: shipmentKeys.customers(searchTerm),
    queryFn: () => searchCustomers({ searchTerm }),
    enabled: searchTerm.trim().length > 0,
    staleTime: 30 * 1000,
  });
}

export function useDeliveryChargeQuote(
  destinationHubId: string,
  weight: number,
) {
  return useQuery({
    queryKey: shipmentKeys.quote(destinationHubId, weight),
    queryFn: () => getDeliveryChargeQuote({ destinationHubId, weight }),
    enabled: Boolean(destinationHubId) && weight > 0,
    staleTime: 60 * 1000,
  });
}

/* ==========================================
   SHIPMENT READS
========================================== */

export function useMyShipments() {
  return useQuery({
    queryKey: shipmentKeys.my,
    queryFn: getMyShipments,
  });
}

export function useHubShipments(
  searchTerm: string,
  status: ShipmentStatus | "",
) {
  return useQuery({
    queryKey: shipmentKeys.hub(searchTerm, status),
    queryFn: () => getHubShipments({ searchTerm, status }),
  });
}

export function useShipmentById(shipmentId: string) {
  return useQuery({
    queryKey: shipmentKeys.detail(shipmentId),
    queryFn: () => getShipmentById(shipmentId),
    enabled: Boolean(shipmentId),
  });
}

/* ==========================================
   SHIPMENT MUTATIONS
========================================== */

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShipmentPayload) => createShipment(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    },
  });
}

export function useRetryPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId: string) => retryShipmentPayment(shipmentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    },
  });
}

export function useReceiveShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId: string) => receiveShipment(shipmentId),

    onSuccess: async (response) => {
      const shipmentId = response.data?.id;

      await queryClient.invalidateQueries({ queryKey: shipmentKeys.all });

      if (shipmentId) {
        await queryClient.invalidateQueries({
          queryKey: shipmentKeys.detail(shipmentId),
        });
      }
    },
  });
}

export function useDeliverShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId: string) => deliverShipment(shipmentId),

    onSuccess: async (response) => {
      const shipmentId = response.data?.id;

      await queryClient.invalidateQueries({ queryKey: shipmentKeys.all });

      if (shipmentId) {
        await queryClient.invalidateQueries({
          queryKey: shipmentKeys.detail(shipmentId),
        });
      }
    },
  });
}

/* ==========================================
   PAYMENTS
========================================== */

export function useMyPayments() {
  return useQuery({
    queryKey: shipmentKeys.payments,
    queryFn: getMyPayments,
  });
}
