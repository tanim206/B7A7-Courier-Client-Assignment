"use client";

import { useForm } from "@tanstack/react-form";
import { SaveIcon } from "lucide-react";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useUpdateHub } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AdminHubDetail } from "@/types";
import {
  DIVISIONS,
  toUpdateHubPayload,
  updateHubSchema,
} from "@/validation";

export default function HubEditForm({ hub }: { hub: AdminHubDetail }) {
  const { mutate: updateHub, isPending } = useUpdateHub();

  const form = useForm({
    defaultValues: {
      //  THE HUB CODE IS THE PERMANENT IDENTITY, SO IT IS HELD ONLY
      //  TO SATISFY THE SHARED SCHEMA AND STRIPPED BEFORE SENDING

      hubCode: hub.hubCode,
      hubName: hub.name,
      email: hub.email ?? "",
      phone: hub.phone ?? "",
      address: hub.address,
      city: hub.city,
      district: hub.district,
      division: hub.division,
    },

    validators: {
      onSubmit: updateHubSchema,
    },

    onSubmit: ({ value }) => {
      updateHub(
        { hubId: hub.id, ...toUpdateHubPayload(value) },
        {
          onSuccess: () => {
            toast.add({
              title: "Hub updated",
              description: `${value.hubName} has been saved.`,
              type: "success",
            });
          },

          onError: (error: unknown) => {
            toast.add({
              title: "Hub could not be updated",
              description: getApiErrorMessage(error),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      <Card>
        <CardHeader>
          <CardTitle>Edit Hub</CardTitle>
          <CardDescription>
            The hub code {hub.hubCode} is permanent and cannot be changed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldLegend variant="label">Identity</FieldLegend>

              <form.Field name="hubName">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Hub Name</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend variant="label">Contact</FieldLegend>

              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email (optional)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="hub@example.com"
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
                      <FieldLabel htmlFor={field.name}>
                        Phone (optional)
                      </FieldLabel>
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
                    </Field>
                  );
                }}
              </form.Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend variant="label">Location</FieldLegend>

              <form.Field name="address">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <form.Field name="city">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>City</FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="district">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>District</FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="division">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Division</FieldLabel>
                        <Select
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                        >
                          <option value="">Select division</option>
                          {DIVISIONS.map((division) => (
                            <option key={division} value={division}>
                              {division}
                            </option>
                          ))}
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldSet>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : <SaveIcon />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
