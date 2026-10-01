import {
  ACCEPTED_PROFILE_IMAGE,
  MAX_PROFILE_IMAGE_SIZE,
} from "@/constants";
import type { UpdateProfilePayload } from "@/types";
import z from "zod";

/* ==========================================
   PROFILE FORM
   THE SAME RULES THE BACKEND ENFORCES SO THE
   USER SEES THE PROBLEM BEFORE SENDING
========================================== */

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be atleast 3 characters long")
    .max(60, "Name must be at most 60 characters long"),

  phone: z
    .string()
    .trim()
    .regex(
      /^01[3-9]\d{8}$/,
      "Please provide a valid Bangladeshi phone number",
    ),
});

export type ProfileFormValues = z.input<typeof profileSchema>;

export const toUpdateProfilePayload = (
  values: ProfileFormValues,
): UpdateProfilePayload => ({
  name: values.name.trim(),
  phone: values.phone.trim(),
});

//  CLOUDINARY ACCEPTS THESE FOUR TYPES AND THE UPLOAD
//  MIDDLEWARE REFUSES ANYTHING LARGER THAN 5 MB

const ACCEPTED_IMAGE_TYPES = ACCEPTED_PROFILE_IMAGE.split(",");

export const validateProfileImage = (file: File): string | null => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPG, PNG, WebP or GIF image";
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    return `${file.name} is larger than 5 MB`;
  }

  return null;
};
