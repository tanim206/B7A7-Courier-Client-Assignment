import { applyHubApplication, verifyHubApplication } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApplyHubApplicationPayload } from "@/types";

/* ==========================================
   QUERY KEYS
   ========================================== */

export const hubApplicationKeys = {
  all: ["hub-applications"] as const,
};

/* ==========================================
   HUB APPLICATION
   ========================================== */

export function useApplyHubApplication() {
  return useMutation({
    mutationFn: (payload: ApplyHubApplicationPayload) =>
      applyHubApplication(payload),
  });
}

export function useVerifyHubApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { applicationId: string; otp: string }) =>
      verifyHubApplication(payload),

    //  THE PROFILE CARRIES THE ROLE AND THE HUB, SO IT IS
    //  REFRESHED WHEN THE APPLICATION MOVES FORWARD

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}