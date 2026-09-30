import type { FetchError } from "ofetch";

/* ==========================================
   NORMALIZED ERROR MESSAGE
   ofetch throws FetchError where the backend
   payload lives in `data`.
========================================== */

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong, Please try again",
): string => {
  if (!error) {
    return fallback;
  }

  const fetchError = error as FetchError<{
    message?: string;
    data?: { message?: string };
  }>;

  return (
    fetchError.data?.data?.message ||
    fetchError.data?.message ||
    fetchError.message ||
    fallback
  );
};
