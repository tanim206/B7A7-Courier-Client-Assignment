import type { ShipmentStatus, ShipmentHub, ShipmentPayment, PaymentStatus } from "./shipment.type";
import type { UserRole, UserStatus } from "./user.type";

/* ==========================================
   SHARED
   ========================================== */

export type HubStatus = "ACTIVE" | "INACTIVE";

export type HubApplicationStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

/* ==========================================
   OVERVIEW
   ========================================== */

export interface AdminOverview {
  users: {
    total: number;
    active: number;
    blocked: number;
    staff: number;
  };
  hubs: {
    total: number;
    active: number;
  };
  shipments: {
    total: number;
    delivered: number;
    byStatus: Record<ShipmentStatus, number>;
  };
  payments: {
    total: number;
    paid: number;
    totalRevenue: string;
  };
  applications: {
    pending: number;
  };
  recentShipments: AdminRecentShipment[];
}

export interface AdminRecentShipment {
  id: string;
  status: ShipmentStatus;
  parcelName: string;
  deliveryCharge: string;
  createdAt: string;
  receiverName: string;
  originHub: { city: string };
  destinationHub: { city: string };
  payment: { status: PaymentStatus } | null;
}

/* ==========================================
   ANALYTICS
   ========================================== */

export interface AdminAnalytics {
  daily: {
    date: string;
    shipments: number;
    revenue: number;
  }[];
  shipmentsByStatus: {
    status: ShipmentStatus;
    count: number;
  }[];
  topDestinationHubs: {
    hubId: string;
    name: string;
    city: string;
    delivered: number;
    revenue: string;
  }[];
}

/* ==========================================
   USERS
   ========================================== */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  hubId: string | null;
  hub: {
    id: string;
    name: string;
    hubCode: string;
    city: string;
  } | null;
  _count: {
    sentShipments: number;
    createdShipments: number;
  };
}

/* ==========================================
   HUBS
   ========================================== */

export interface AdminHub {
  id: string;
  hubCode: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  city: string;
  district: string;
  division: string;
  status: HubStatus;
  createdAt: string;
  _count: {
    staffs: number;
    originShipments: number;
    destinationShipments: number;
  };
}

export interface AdminHubDetail extends AdminHub {
  staffs: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: UserStatus;
  }[];
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateHubPayload {
  hubName: string;
  hubCode: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  district: string;
  division: string;
}

export interface UpdateHubPayload {
  hubName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  division?: string;
  status?: HubStatus;
}

/* ==========================================
   HUB APPLICATIONS
   ========================================== */

export interface AdminHubApplication {
  id: string;
  userId: string;
  hubId: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  district: string;
  division: string;
  additionalFiles: { url: string; publicId: string }[] | null;
  status: HubApplicationStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
  hub: {
    id: string;
    name: string;
    hubCode: string;
    city: string;
    division: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: UserStatus;
  };
  reviewedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
}

/* ==========================================
   SHIPMENTS
   ========================================== */

export interface AdminShipment {
  id: string;
  status: ShipmentStatus;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  parcelName: string;
  weight: number | null;
  deliveryCharge: string;
  createdAt: string;
  originHub: { id: string; name: string; city: string; hubCode: string };
  destinationHub: { id: string; name: string; city: string; hubCode: string };
  payment: {
    id: string;
    status: PaymentStatus;
    amount: string;
    bkashTrxId: string | null;
  } | null;
  createdBy: { id: string; name: string };
}

/* ==========================================
   PAYMENTS
   ========================================== */

export interface AdminPayment {
  id: string;
  amount: string;
  status: PaymentStatus;
  currency: string;
  paymentGateway: string;
  merchantInvoiceNumber: string;
  bkashTrxId: string | null;
  paidAt: string | null;
  createdAt: string;
  shipment: {
    id: string;
    status: ShipmentStatus;
    senderName: string;
    senderEmail: string;
    receiverName: string;
    parcelName: string;
    originHub: { name: string; city: string };
    destinationHub: { name: string; city: string };
  };
}

export type { ShipmentHub, ShipmentPayment };
