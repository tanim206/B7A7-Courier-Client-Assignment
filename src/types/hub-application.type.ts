import type { HubApplicationStatus } from "./admin.type";

export interface HubApplicationAttachment {
  url: string;
  publicId: string;
}

//  THE BACKEND READS THE APPLICANT FROM THE SESSION, SO ONLY
//  THE HUB, THE CONTACT DETAILS AND THE FILES ARE SENT

export interface ApplyHubApplicationPayload {
  hubId: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  division: string;
  files?: File[];
}

export interface ApplyHubApplicationResult {
  hubApplicationId: string;
  message: string;
}

export interface HubApplication {
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
  additionalFiles: HubApplicationAttachment[] | null;
  status: HubApplicationStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
  hub: {
    id: string;
    hubCode: string;
    name: string;
    city: string;
    district: string;
    division: string;
    address: string | null;
    phone: string | null;
  };
}