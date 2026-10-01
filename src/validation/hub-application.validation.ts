import z from "zod";
import { DIVISIONS } from "./shipment.validation";
import { MAX_APPLICATION_FILES, MAX_APPLICATION_FILE_SIZE } from "@/constants";
import type { ApplyHubApplicationPayload } from "@/types";

/* ==========================================
   HUB APPLICATION FORM
   ========================================== */

//  THE BACKEND DOES NOT VALIDATE THIS BODY, SO THE CLIENT IS
//  THE ONLY THING STOPPING AN EMPTY FIELD BECOMING A 500

export const hubApplicationSchema = z.object({
  hubId: z.string().trim().min(1, "Please choose the hub you want to join"),

  phone: z
    .string()
    .trim()
    .regex(
      /^01[3-9]\d{8}$/,
      "Please provide a valid Bangladeshi phone number",
    ),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address is too long"),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(80, "City is too long"),

  district: z
    .string()
    .trim()
    .min(2, "District must be at least 2 characters")
    .max(80, "District is too long"),

  division: z
    .string()
    .trim()
    .min(2, "Division is required")
    .refine(
      (value) =>
        (DIVISIONS as readonly string[]).includes(
          value as (typeof DIVISIONS)[number],
        ),
      { message: "Please select a valid division" },
    ),
});

export type HubApplicationFormValues = z.input<typeof hubApplicationSchema>;

export const toApplyHubApplicationPayload = (
  values: HubApplicationFormValues,
  files: File[] = [],
): ApplyHubApplicationPayload => ({
  hubId: values.hubId,
  phone: values.phone.trim(),
  address: values.address.trim(),
  city: values.city.trim(),
  district: values.district.trim(),
  division: values.division,
  ...(files.length ? { files } : {}),
});

//  THE FILE INPUT HAS NO SERVER-SIDE LIMIT, SO IT IS ENFORCED HERE

export const validateApplicationFiles = (files: File[]): string | null => {
  if (files.length > MAX_APPLICATION_FILES) {
    return `You can attach at most ${MAX_APPLICATION_FILES} files`;
  }

  const oversized = files.find(
    (file) => file.size > MAX_APPLICATION_FILE_SIZE,
  );

  if (oversized) {
    return `${oversized.name} is larger than 5 MB`;
  }

  return null;
};