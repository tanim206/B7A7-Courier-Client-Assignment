import z from "zod";
import { DIVISIONS } from "./shipment.validation";
import type { CreateHubPayload, UpdateHubPayload } from "@/types";

/* ==========================================
   HUB FORM
   ========================================== */

export const createHubSchema = z.object({
  hubName: z
    .string()
    .trim()
    .min(2, "Hub name must be at least 2 characters")
    .max(120, "Hub name is too long"),

  hubCode: z
    .string()
    .trim()
    .min(2, "Hub code must be at least 2 characters")
    .max(20, "Hub code is too long")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Hub code can only contain letters, numbers and dashes",
    ),

  email: z.union([z.email("Please provide a valid hub email"), z.literal("")]),

  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^01[3-9]\d{8}$/.test(value),
      "Please provide a valid Bangladeshi phone number",
    ),

  address: z
    .string()
    .trim()
    .min(5, "Hub address must be at least 5 characters")
    .max(300, "Hub address is too long"),

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
    .min(2, "Division must be at least 2 characters")
    .refine(
      (value) =>
        (DIVISIONS as readonly string[]).includes(
          value as (typeof DIVISIONS)[number],
        ),
      { message: "Please select a valid division" },
    ),
});

export type CreateHubFormValues = z.input<typeof createHubSchema>;

export const toCreateHubPayload = (
  values: CreateHubFormValues,
): CreateHubPayload => ({
  hubName: values.hubName.trim(),
  hubCode: values.hubCode.trim().toUpperCase(),
  address: values.address.trim(),
  city: values.city.trim(),
  district: values.district.trim(),
  division: values.division,

  ...(values.email?.trim() ? { email: values.email.trim() } : {}),
  ...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
});

//  THE UPDATE PATCH IS BUILT FROM THE SAME FIELDS SO THE EDIT
//  FORM CAN REUSE ONE SCHEMA

export const updateHubSchema = createHubSchema;

export type UpdateHubFormValues = CreateHubFormValues;

export const toUpdateHubPayload = (
  values: UpdateHubFormValues,
): UpdateHubPayload => {
  //  HUB CODE IS THE PERMANENT IDENTITY AND CANNOT BE CHANGED

  const { hubCode: _hubCode, ...payload } = toCreateHubPayload(values);

  return payload;
};

//  RE-EXPORTED FROM THE SHIPMENT SCHEMA SO BOTH FORMS SHARE ONE LIST

export { DIVISIONS } from "./shipment.validation";
