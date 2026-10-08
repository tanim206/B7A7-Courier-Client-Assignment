import {
  forgotPassword,
  getMe,
  googleOAuth,
  refreshAccessToken,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  userVerify,
} from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

function isUnauthorized(error: unknown): boolean {
  const status =
    (error as { status?: unknown })?.status ??
    (error as { statusCode?: unknown })?.statusCode ??
    (error as { response?: { status?: unknown } })?.response?.status ??
    (error as { data?: { statusCode?: unknown } })?.data?.statusCode;
  return status === 401;
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}
export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (error) {
        // Access token expired but refresh token may still be valid.
        // Try the backend refresh flow exactly once, then retry.
        // If refresh also fails, propagate the error so callers
        // redirect to /login instead of hanging on loading.
        if (isUnauthorized(error)) {
          await refreshAccessToken();
          return await getMe();
        }
        throw error;
      }
    },
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}
export function useVerifyUser() {
  return useMutation({
    mutationFn: userVerify,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
