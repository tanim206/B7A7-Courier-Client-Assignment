"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { OTP_LENGTH } from "@/constants";

export { OTP_LENGTH };

type OtpInputProps = {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
  errors?: Array<{ message?: string } | undefined>;
  description?: string;
};

export default function OtpInput({
  id = "otp",
  name = "otp",
  label = "OTP",
  value,
  onChange,
  onBlur,
  isInvalid = false,
  errors,
  description,
}: OtpInputProps) {
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputOTP
        maxLength={OTP_LENGTH}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        name={name}
        id={id}
        pattern={REGEXP_ONLY_DIGITS}
        autoComplete="off"
      >
        <InputOTPGroup>
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {isInvalid && <FieldError errors={errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
