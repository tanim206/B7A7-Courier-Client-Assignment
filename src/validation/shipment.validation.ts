import z from "zod";

export const DIVISIONS = [
  "Barishal",
  "Chattogram",
  "Dhaka",
  "Khulna",
  "Rangpur",
  "Rajshahi",
  "Sylhet",
] as const;

export const createShipmentSchema = z.object({
  senderId: z
    .string()
    .min(1, "Please select a customer")
    .uuid("Please select a valid customer"),

  destinationHubId: z
    .string()
    .min(1, "Please select a destination hub")
    .uuid("Please select a valid destination hub"),

  receiverName: z
    .string()
    .trim()
    .min(2, "Receiver name must be at least 2 characters")
    .max(100, "Receiver name is too long"),

  receiverEmail: z.email("Please provide a valid receiver email"),

  receiverPhone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),

  receiverAddress: z
    .string()
    .trim()
    .min(5, "Receiver address must be at least 5 characters")
    .max(300, "Receiver address is too long"),

  receiverCity: z
    .string()
    .trim()
    .min(2, "Receiver city must be at least 2 characters")
    .max(80, "Receiver city is too long"),

  receiverDistrict: z
    .string()
    .trim()
    .min(2, "Receiver district must be at least 2 characters")
    .max(80, "Receiver district is too long"),

  receiverDivision: z
    .string()
    .trim()
    .min(2, "Receiver division must be at least 2 characters")
    .refine(
      (value) =>
        (DIVISIONS as readonly string[]).includes(
          value as (typeof DIVISIONS)[number],
        ),
      { message: "Please select a valid receiver division" },
    ),

  parcelName: z
    .string()
    .trim()
    .min(2, "Parcel name must be at least 2 characters")
    .max(120, "Parcel name is too long"),

  weight: z
    .string()
    .trim()
    .min(1, "Please enter the parcel weight")
    .refine(
      (value) => Number(value) > 0,
      "Parcel weight must be greater than 0",
    )
    .refine(
      (value) => Number(value) <= 1000,
      "Parcel weight cannot be more than 1000 kg",
    ),

  //  EMPTY IS ALLOWED, THE PAYLOAD BUILDER OMITS IT

  description: z.string().trim().max(500, "Description is too long"),
});

export type CreateShipmentFormValues = z.input<typeof createShipmentSchema>;

//  CONVERTS THE FORM VALUES INTO THE API PAYLOAD

export const toCreateShipmentPayload = (values: CreateShipmentFormValues) => ({
  senderId: values.senderId,
  destinationHubId: values.destinationHubId,

  receiverName: values.receiverName.trim(),
  receiverEmail: values.receiverEmail.trim(),
  receiverPhone: values.receiverPhone.trim(),
  receiverAddress: values.receiverAddress.trim(),
  receiverCity: values.receiverCity.trim(),
  receiverDistrict: values.receiverDistrict.trim(),
  receiverDivision: values.receiverDivision,

  parcelName: values.parcelName.trim(),
  weight: Number(values.weight),

  ...(values.description?.trim()
    ? { description: values.description.trim() }
    : {}),
});
