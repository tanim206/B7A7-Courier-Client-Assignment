export type ShipmentStatus =
  | "PENDING"
  | "PICKUP_SCHEDULED"
  | "ASSIGNED"
  | "PICKED_UP"
  | "AT_ORIGIN_HUB"
  | "TRANSIT"
  | "AT_DESTINATION_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED_DELIVERY"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface ShipmentHub {
  id: string;
  hubCode: string;
  name: string;
  city: string;
  district: string;
  division: string;
  address?: string;
  phone?: string;
}

export interface CustomerOption {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ShipmentPayment {
  id: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  paymentGateway: string;
  merchantInvoiceNumber: string;
  bkashPaymentId: string | null;
  bkashTrxId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  status: ShipmentStatus;

  senderId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;

  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  receiverDistrict: string;
  receiverDivision: string;

  parcelName: string;
  weight: number | null;
  description: string | null;

  originHubId: string;
  originHub: ShipmentHub;

  destinationHubId: string;
  destinationHub: ShipmentHub;

  createdById: string;
  receivedById: string | null;

  receivedAt: string | null;
  deliveredAt: string | null;

  deliveryCharge: string;
  payment: ShipmentPayment | null;

  createdAt: string;
  updatedAt: string;
}

export interface ShipmentActions {
  canPay: boolean;
  canReceive: boolean;
  canDeliver: boolean;
}

export interface ShipmentDetail extends Shipment {
  actions: ShipmentActions;
}

export interface DeliveryChargeQuote {
  division: string;
  weightKg: number;
  baseCharge: number;
  freeWeightKg: number;
  extraKg: number;
  extraKgCharge: number;
  totalCharge: number;
  destinationHub: ShipmentHub;
}

export interface CreateShipmentPayload {
  senderId: string;

  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  receiverDistrict: string;
  receiverDivision: string;

  parcelName: string;
  weight: number;
  description?: string;

  destinationHubId: string;
}

export interface CreateShipmentResult {
  shipmentId: string;
  amount: string;
  deliveryCharge: number;
  paymentId: string;
  paymentUrl: string | null;
  paymentStatus: PaymentStatus;
  paymentError: string | null;
  canRetryPayment: boolean;
}

export interface RetryPaymentResult {
  shipmentId: string;
  amount: string;
  paymentId: string;
  paymentUrl: string | null;
  paymentStatus: PaymentStatus;
  paymentError: string | null;
  canRetryPayment: boolean;
}

export interface MyPayment extends ShipmentPayment {
  shipmentId: string;
  shipment: Shipment;
}
