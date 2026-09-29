"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForgotPassword, useResetPassword } from "@/hooks";
import type { ApiError, ApiResponse } from "@/types";
import {
  forgotPasswordSchema,
  newPasswordSchema,
  otpSchema,
} from "@/validation";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";
import OtpInput from "./otp-input";

const STEPS = ["email", "otp", "password"] as const;

type Step = (typeof STEPS)[number];

const STEP_CONTENT: Record<
  Step,
  { title: string; description: string }
> = {
  email: {
    title: "Forgot password",
    description:
      "Enter your email and we will send you an OTP to reset your password",
  },
  otp: {
    title: "Verify OTP",
    description: "Enter the 6 digit OTP we sent to your email",
  },
  password: {
    title: "Set new password",
    description: "Choose a new password for your account",
  },
};

function getErrorMessage(err: ApiError) {
  return (
    err?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again"
  );
}

export default function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: sendOtp, isPending: sendOtpPending } = useForgotPassword();
  const { mutate: resetPassword, isPending: resetPasswordPending } =
    useResetPassword();

  const emailForm = useForm({
    defaultValues: {
      email: searchParams.get("email") || "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      sendOtp(
        { email: value.email },
        {
          onSuccess: (res: ApiResponse<null>) => {
            if (!res?.success) {
              toast.add({
                title: "Server Failure",
                description:
                  res?.message || "Something went wrong. Please try again",
                type: "error",
              });
              return;
            }

            setEmail(value.email);
            setOtp("");
            setStep("otp");

            toast.add({
              title: "OTP Sent",
              description: `We have sent an OTP to ${value.email}. It will expire in 5 minutes.`,
              type: "success",
            });
          },
          onError: (err: ApiError) => {
            toast.add({
              title: "Request failure",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  const otpForm = useForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onSubmit: otpSchema,
    },
    onSubmit: ({ value }) => {
      setOtp(value.otp);
      setStep("password");
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: newPasswordSchema,
    },
    onSubmit: ({ value }) => {
      resetPassword(
        {
          email,
          otp,
          newPassword: value.newPassword,
        },
        {
          onSuccess: (res: ApiResponse<null>) => {
            if (!res?.success) {
              toast.add({
                title: "Server Failure",
                description:
                  res?.message || "Something went wrong. Please try again",
                type: "error",
              });
              return;
            }

            toast.add({
              title: "Password Reset Successful",
              description: "Please login with your new password",
              type: "success",
            });
            router.push("/login");
          },
          onError: (err: ApiError) => {
            toast.add({
              title: "Password reset failure",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  const content = STEP_CONTENT[step];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {content.description}
        </p>
      </div>

      <ol className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        {STEPS.map((item, index) => (
          <li
            key={item}
            aria-current={step === item ? "step" : undefined}
            className={
              step === item ? "font-medium text-foreground" : undefined
            }
          >
            Step {index + 1} of {STEPS.length}
            {index < STEPS.length - 1 ? " ›" : ""}
          </li>
        ))}
      </ol>

      {step === "email" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            emailForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <emailForm.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="m@example.com"
                      autoComplete="email"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </emailForm.Field>

            <Button disabled={sendOtpPending} type="submit">
              {sendOtpPending ? (
                <>
                  <Spinner /> Sending
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </FieldGroup>
        </form>
      )}

      {step === "otp" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            otpForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <otpForm.Field name="otp">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <OtpInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    isInvalid={isInvalid}
                    errors={field.state.meta.errors}
                  />
                );
              }}
            </otpForm.Field>

            <Button type="submit">Verify OTP</Button>

            <Button
              type="button"
              variant="outline"
              disabled={sendOtpPending}
              onClick={() => {
                setStep("email");
                otpForm.reset();
              }}
            >
              Change Email
            </Button>
          </FieldGroup>
        </form>
      )}

      {step === "password" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            passwordForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <passwordForm.Field name="newPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="new-password"
                        className="pr-10"
                        aria-invalid={isInvalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </passwordForm.Field>

            <passwordForm.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm New Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="new-password"
                        className="pr-10"
                        aria-invalid={isInvalid}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </passwordForm.Field>

            <Button disabled={resetPasswordPending} type="submit">
              {resetPasswordPending ? (
                <>
                  <Spinner /> Resetting
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={resetPasswordPending}
              onClick={() => {
                setStep("otp");
                passwordForm.reset();
              }}
            >
              Back
            </Button>
          </FieldGroup>
        </form>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
