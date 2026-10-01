import { updateProfile, uploadProfileImage } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* ==========================================
   PROFILE MUTATIONS
   EVERY PROFILE WRITE REFRESHES THE SHARED
   "user" QUERY SO THE AVATAR AND THE SIDEBAR
   SHOW THE NEW DETAILS WITHOUT A RELOAD
========================================== */

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
