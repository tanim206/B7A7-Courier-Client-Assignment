"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Loader2Icon, PackagePlusIcon } from "lucide-react";
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
import { CustomerSearchSelect } from "@/components/module/shipment/customer-search-select";
import { useActiveHubs, useCreateShipment, useDeliveryChargeQuote } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createShipmentSchema,
  DIVISIONS,
  toCreateShipmentPayload,
} from "@/validation";
import type { CustomerOption } from "@/types";

export default function ShipmentCreateForm() {
  const router = useRouter();

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [destinationHubId, setDestinationHubId] = useState("");
  const [weight, setWeight] = useState(0);

  const { data: hubsResponse, isPending: hubsPending } = useActiveHubs();
  const hubs = hubsResponse?.data ?? [];

  //  THE CHARGE IS ALWAYS CALCULATED BY THE BACKEND

  const {
    data: quoteResponse,
    isFetching: quotePending,
    error: quoteError,
  } = useDeliveryChargeQuote(destinationHubId, weight);

  const quote = quoteResponse?.data;
  const { mutate: createShipment, isPending: createPending } =
    useCreateShipment();

  const form = useForm({
    defaultValues: {
      senderId: "",
      destinationHubId: "",
      receiverName: "",
      receiverEmail: "",
      receiverPhone: "",
      receiverAddress: "",
      receiverCity: "",
      receiverDistrict: "",
      receiverDivision: "",
      parcelName: "",
      weight: "",
      description: "",
    },

    validators: {
      onSubmit: createShipmentSchema,
    },

    onSubmit: ({ value, formApi }) => {
      createShipment(toCreateShipmentPayload(value), {
        onSuccess: (response) => {
          const result = response.data;

          toast.add({
            title: "Shipment Created",
            description: `Shipment ${result.shipmentId} is ready for payment.`,
            type: "success",
          });

          formApi.reset();

          setSelectedCustomer(null);
          setDestinationHubId("");
          setWeight(0);

          if (result.paymentUrl) {
            router.push(
              `/dashboard/shipments/payment?url=${encodeURIComponent(result.paymentUrl)}&shipmentId=${result.shipmentId}&status=pending`,
            );
            return;
          }

          //  NO URL MEANS BKASH REFUSED THE SESSION, EXPLAIN WHY

          toast.add({
            title: "Shipment created, payment not started",
            description: result.paymentError,
            type: "error",
          });

          router.push(
            `/dashboard/staff/shipments/${result.shipmentId}?payment=unavailable`,
          );
        },
        onError: (error: unknown) => {
          toast.add({
            title: "Shipment could not be created",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      });
    },
  });

  //  KEEPS THE SENDER ID IN SYNC WITH THE SEARCHABLE SELECTOR

  useEffect(() => {
    form.setFieldValue("senderId", selectedCustomer?.id ?? "");
  }, [selectedCustomer, form]);

  const chargeSummary = useMemo(() => {
    if (!quote) {
      return null;
    }

    return {
      base: quote.baseCharge,
      extraKg: quote.extraKg,
      extraKgCharge: quote.extraKgCharge,
      total: quote.totalCharge,
    };
  }, [quote]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="grid gap-5 lg:grid-cols-3"
    >
      <div className="space-y-5 lg:col-span-2">
        {/*  SENDER + PARCEL  */}

        <Card>
          <CardHeader>
            <CardTitle>Sender &amp; Parcel</CardTitle>
            <CardDescription>
              The sender is always an existing customer of your hub.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Sender</FieldLegend>

                <form.Field name="senderId">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Customer</FieldLabel>
                        <CustomerSearchSelect
                          value={selectedCustomer}
                          onChange={setSelectedCustomer}
                          invalid={isInvalid}
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
                <FieldLegend variant="label">Parcel</FieldLegend>

                <form.Field name="parcelName">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Parcel Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          placeholder="e.g. Electronics box"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="weight">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Weight (KG)</FieldLabel>
                        <Input
                          id={field.name}
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.1"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.target.value);
                            setWeight(Number(event.target.value) || 0);
                          }}
                          placeholder="e.g. 2.5"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="description">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Description (Optional)
                        </FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          placeholder="Anything the courier should know"
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
            </FieldGroup>
          </CardContent>
        </Card>

        {/*  ROUTING  */}

        <Card>
          <CardHeader>
            <CardTitle>Routing</CardTitle>
            <CardDescription>
              The origin hub is your hub. Choose where the parcel is delivered
              from.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.Field name="destinationHubId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Destination Hub
                      </FieldLabel>
                      <Select
                        id={field.name}
                        disabled={hubsPending}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.target.value);
                          setDestinationHubId(event.target.value);
                        }}
                        aria-invalid={isInvalid}
                      >
                        <option value="">
                          {hubsPending ? "Loading hubs..." : "Select a hub"}
                        </option>
                        {hubs.map((hub) => (
                          <option key={hub.id} value={hub.id}>
                            {hub.name} &middot; {hub.city}
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
            </FieldGroup>
          </CardContent>
        </Card>

        {/*  RECEIVER  */}

        <Card>
          <CardHeader>
            <CardTitle>Receiver</CardTitle>
            <CardDescription>
              These details are saved on the shipment so the hub can always
              reach the receiver.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-5 sm:grid-cols-2">
                <form.Field name="receiverName">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Receiver Name
                        </FieldLabel>
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

                <form.Field name="receiverPhone">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Receiver Phone
                        </FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          placeholder="01XXXXXXXXX"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="receiverEmail">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Receiver Email
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="email"
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

              <form.Field name="receiverAddress">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Receiver Address
                      </FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="House, road, area"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <div className="grid gap-5 sm:grid-cols-3">
                <form.Field name="receiverCity">
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

                <form.Field name="receiverDistrict">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          District
                        </FieldLabel>
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

                <form.Field name="receiverDivision">
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
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      {/*  SUMMARY  */}

      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Charge</CardTitle>
            <CardDescription>
              Calculated by the server from the destination hub and weight.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Destination</dt>
                <dd className="text-right font-medium">
                  {quote?.destinationHub.name ?? "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Division</dt>
                <dd className="text-right font-medium">
                  {quote?.division ?? "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Weight</dt>
                <dd className="text-right font-medium">
                  {weight > 0 ? `${weight} KG` : "—"}
                </dd>
              </div>

              {chargeSummary && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Base charge</dt>
                    <dd className="text-right font-medium">
                      {chargeSummary.base} BDT
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">
                      Extra weight ({chargeSummary.extraKg} KG)
                    </dt>
                    <dd className="text-right font-medium">
                      {chargeSummary.extraKg * chargeSummary.extraKgCharge} BDT
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t pt-2 text-base">
                    <dt className="font-medium">Total</dt>
                    <dd className="text-right font-semibold">
                      {chargeSummary.total} BDT
                    </dd>
                  </div>
                </>
              )}
            </dl>

            {(quotePending || createPending) && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                {quotePending ? <Spinner /> : <Loader2Icon className="size-3 animate-spin" />}
                {quotePending ? "Updating charge..." : "Creating shipment..."}
              </p>
            )}

            {quoteError && (
              <p className="text-xs text-destructive">
                We could not calculate the delivery charge. Please check the
                destination hub and weight.
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={createPending || !chargeSummary}
            >
              {createPending ? (
                <>
                  <Spinner /> Creating
                </>
              ) : (
                <>
                  <PackagePlusIcon /> Create &amp; Pay with bKash
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              The shipment is saved first, then the customer is redirected to
              bKash. If bKash is unavailable the shipment stays unpaid and can
              be retried.
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
