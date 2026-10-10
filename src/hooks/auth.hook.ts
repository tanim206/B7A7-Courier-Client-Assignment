import {
  forgotPassword,
  getMe,
  googleOAuth,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  userVerify,
} from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

// function isUnauthorized(error: unknown): boolean {
//   const status =
//     (error as { status?: unknown })?.status ??
//     (error as { statusCode?: unknown })?.statusCode ??
//     (error as { response?: { status?: unknown } })?.response?.status ??
//     (error as { data?: { statusCode?: unknown } })?.data?.statusCode;
//   return status === 401;
// }

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}
export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
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
