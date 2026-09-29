export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
