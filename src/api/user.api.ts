import apiClient from "@/lib/apiClient";
import type { ApiResponse, Me, UpdateProfilePayload } from "@/types";

/* ==========================================
   PROFILE
========================================== */

export function updateProfile(payload: UpdateProfilePayload) {
  return apiClient<ApiResponse<Me>>("/user/profile", {
    method: "PATCH",
    body: payload,
  });
}

//  THE IMAGE RIDES ALONE AS MULTIPART UNDER THE FIELD
//  NAME THE MULTER MIDDLEWARE EXPECTS

export function uploadProfileImage(file: File) {
  const formData = new FormData();

  formData.append("profileImage", file);

  return apiClient<ApiResponse<Me>>("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
}
