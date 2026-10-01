import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ApplyHubApplicationPayload,
  ApplyHubApplicationResult,
  HubApplication,
} from "@/types";

/* ==========================================
   HUB APPLICATION
   ========================================== */

//  THE HUB ID TRAVELS IN THE PATH AND THE REST OF THE FORM
//  GOES AS MULTIPART SO THE ATTACHMENTS RIDE ALONG

export function applyHubApplication(payload: ApplyHubApplicationPayload) {
  const formData = new FormData();

  formData.append("phone", payload.phone);
  formData.append("address", payload.address);
  formData.append("city", payload.city);
  formData.append("district", payload.district);
  formData.append("division", payload.division);

  for (const file of payload.files ?? []) {
    formData.append("additionalFiles", file);
  }

  return apiClient<ApiResponse<ApplyHubApplicationResult>>(
    `/hub/application-form/${payload.hubId}`,
    { method: "POST", body: formData },
  );
}

export function verifyHubApplication(payload: {
  applicationId: string;
  otp: string;
}) {
  return apiClient<ApiResponse<HubApplication>>("/hub/verify-hub-application", {
    method: "POST",
    body: payload,
  });
}