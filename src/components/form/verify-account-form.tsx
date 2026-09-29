"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import OtpInput, { OTP_LENGTH } from "./otp-input";
import { useVerifyUser } from "@/hooks";
import type { ApiError, ApiResponse } from "@/types";

const RESEND_COOLDOWN = 120;

type VerifyResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: unknown;
}>;

export default function VerifyAccountForm({
  mode = "customer",
}: {
  mode: "customer" | "staff";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: verifyUser, isPending: verifyPending } = useVerifyUser();

  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOTP = () => {
    if (otp.length !== OTP_LENGTH) {
      setIsInvalid(true);
      return;
    }

    const verifyData = {
      email,
      otp,
    };

    verifyUser(verifyData, {
      onSuccess: (res: VerifyResponse) => {
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
          title: "Verification Successful",
          description:
            mode === "customer"
              ? "An admin will approve your account. This may take time. Please check your email in few days"
              : "Welcome onboard",
          type: "success",
        });
        router.push("/");
      },
      onError: (err: ApiError) => {
        toast.add({
          title: "Verification failure",
          description:
            err?.data?.message ||
            err?.message ||
            "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };

  if (!email) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Account</CardTitle>
        <CardDescription>
          Please provide the OTP we send you in your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOTP();
          }}
        >
          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (isInvalid) {
                setIsInvalid(false);
              }
            }}
            isInvalid={isInvalid}
            errors={[{ message: "Invalid Code. Please try again" }]}
            description={`Resend in ${resendTimer}`}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button disabled={resendTimer > 0}>Resend</Button>
        <Button type="submit" form="otp-form" disabled={verifyPending}>
          {verifyPending ? (
            <>
              <Spinner /> Verifying
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
