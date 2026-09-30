import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, ShipmentStatus } from "@/types";

/* ==========================================
   LABELS
========================================== */

const shipmentStatusLabel: Record<ShipmentStatus, string> = {
  PENDING: "Awaiting Payment",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked Up",
  AT_ORIGIN_HUB: "At Origin Hub",
  TRANSIT: "In Transit",
  AT_DESTINATION_HUB: "At Destination Hub",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  FAILED_DELIVERY: "Delivery Failed",
  CANCELLED: "Cancelled",
};

const shipmentStatusVariant: Record<
  ShipmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  PICKUP_SCHEDULED: "default",
  ASSIGNED: "secondary",
  PICKED_UP: "secondary",
  AT_ORIGIN_HUB: "secondary",
  TRANSIT: "secondary",
  AT_DESTINATION_HUB: "default",
  OUT_FOR_DELIVERY: "default",
  DELIVERED: "default",
  FAILED_DELIVERY: "destructive",
  CANCELLED: "destructive",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: "Payment Pending",
  PAID: "Paid",
  FAILED: "Payment Failed",
  CANCELLED: "Payment Cancelled",
  REFUNDED: "Refunded",
};

const paymentStatusVariant: Record<
  PaymentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  PAID: "default",
  FAILED: "destructive",
  CANCELLED: "destructive",
  REFUNDED: "secondary",
};

/* ==========================================
   BADGES
========================================== */

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <Badge variant={shipmentStatusVariant[status]}>
      {shipmentStatusLabel[status]}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={paymentStatusVariant[status]}>
      {paymentStatusLabel[status]}
    </Badge>
  );
}
