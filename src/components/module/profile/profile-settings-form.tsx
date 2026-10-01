"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { CameraIcon, SaveIcon, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetMe, useUpdateProfile } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { profileImageRoute } from "@/routes";
import { profileSchema, toUpdateProfilePayload } from "@/validation";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

/* ==========================================
   PROFILE SETTINGS
   THE PHOTO IS NOT PART OF THIS FORM, IT LIVES
   ON ITS OWN PAGE SO A FAILED IMAGE UPLOAD NEVER
   TOUCHES THE NAME OR THE PHONE
========================================== */

export default function ProfileSettingsForm() {
  const { data, isPending, isError } = useGetMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const user = data?.data;

  //  THE FIELDS ARE FILLED ONCE SO A BACKGROUND REFETCH
  //  NEVER TYPES OVER WHAT THE USER IS WRITING

  const filledFor = useRef<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },

    validators: {
      onSubmit: profileSchema,
    },

    onSubmit: ({ value }) => {
      updateProfile(toUpdateProfilePayload(value), {
        onSuccess: () => {
          toast.add({
            title: "Profile updated",
            description: "Your name and phone number have been saved.",
            type: "success",
          });
        },

        onError: (error: unknown) => {
          toast.add({
            title: "Profile could not be updated",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      });
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  if (filledFor.current !== user.id) {
    filledFor.current = user.id;
    form.setFieldValue("name", user.name);
    form.setFieldValue("phone", user.phone);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Keep the details your hubs and customers see up to date.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Profile photo</CardTitle>
          <CardDescription>
            A square picture works best, the older one is replaced for you.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {user.imageUrl ? (
            // biome-ignore lint/performance/noImgElement: remote avatar
            <img
              src={user.imageUrl}
              alt={user.name}
              className="size-20 rounded-full object-cover ring-1 ring-foreground/10"
            />
          ) : (
            <span className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground ring-1 ring-foreground/10">
              {initialsOf(user.name) || <UserIcon className="size-8" />}
            </span>
          )}

          <div className="flex flex-col items-start gap-1">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <Link href={profileImageRoute}>
                  <CameraIcon />
                  Change photo
                </Link>
              }
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP or GIF up to 5 MB.
            </p>
          </div>
        </CardContent>
      </Card>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Personal details</CardTitle>
            <CardDescription>
              Your email is your sign in identity so it cannot be edited here.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="Your name"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                      <Input
                        id={field.name}
                        inputMode="numeric"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="01700000000"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <FieldDescription>
                        This number is used for delivery updates.
                      </FieldDescription>
                    </Field>
                  );
                }}
              </form.Field>

              <Field>
                <FieldLabel htmlFor="settingsEmail">Email</FieldLabel>
                <Input
                  id="settingsEmail"
                  type="email"
                  value={user.email}
                  readOnly
                  disabled
                />
              </Field>
            </FieldGroup>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
                disabled={isUpdating}
              >
                Reset
              </Button>

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Spinner /> : <SaveIcon />}
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <p className="-mt-2 text-center text-xs text-muted-foreground">
        Need to change your password?{" "}
        <Link
          href="/forgot-password"
          className="font-medium underline underline-offset-4"
        >
          Reset your password
        </Link>
      </p>
    </div>
  );
}
