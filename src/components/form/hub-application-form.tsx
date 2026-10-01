"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Building2Icon,
  CircleCheckIcon,
  FileTextIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
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
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import OtpInput from "@/components/form/otp-input";
import { ApplicationStatusBadge } from "@/components/module/admin/admin-badges";
import {
  useActiveHubs,
  useApplyHubApplication,
  useGetMe,
  useVerifyHubApplication,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  DIVISIONS,
  hubApplicationSchema,
  otpSchema,
  toApplyHubApplicationPayload,
  validateApplicationFiles,
} from "@/validation";
import {
  ACCEPTED_APPLICATION_FILES,
  MAX_APPLICATION_FILES,
} from "@/constants";
import type { HubApplication, ShipmentHub } from "@/types";

type Step = "form" | "verify" | "submitted";

export default function HubApplicationForm() {
  const [step, setStep] = useState<Step>("form");
  const [selectedHub, setSelectedHub] = useState<ShipmentHub | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState<HubApplication | null>(null);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const { data: meData } = useGetMe();
  const me = meData?.data;

  const { data: hubsData, isPending: hubsPending } = useActiveHubs();
  const hubs = hubsData?.data ?? [];

  const { mutate: applyHubApplication, isPending: applyPending } =
    useApplyHubApplication();
  const { mutate: verifyApplication, isPending: verifyPending } =
    useVerifyHubApplication();

  const form = useForm({
    defaultValues: {
      hubId: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      division: "",
    },

    validators: {
      onSubmit: hubApplicationSchema,
    },

    onSubmit: ({ value }) => {
      const fileError = validateApplicationFiles(files);

      if (fileError) {
        toast.add({
          title: "Attachment rejected",
          description: fileError,
          type: "error",
        });
        return;
      }

      applyHubApplication(toApplyHubApplicationPayload(value, files), {
        onSuccess: (response) => {
          const newApplicationId = response.data?.hubApplicationId;

          if (!newApplicationId) {
            toast.add({
              title: "Application could not be created",
              description: "The server did not return an application id.",
              type: "error",
            });
            return;
          }

          setApplicationId(newApplicationId);
          setStep("verify");

          toast.add({
            title: "Application submitted",
            description: `We emailed a 6 digit code to ${me?.email ?? "your email"}.`,
            type: "success",
          });
        },

        onError: (error: unknown) => {
          toast.add({
            title: "Application could not be submitted",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      });
    },
  });

  //  THE CONTACT DETAILS START FROM THE PROFILE

  useEffect(() => {
    if (me?.phone) {
      form.setFieldValue("phone", me.phone);
    }
  }, [me, form]);

  //  CHOOSING A HUB FILLS THE LOCATION SO THE APPLICANT ONLY
  //  CORRECTS WHAT IS ACTUALLY DIFFERENT

  useEffect(() => {
    form.setFieldValue("hubId", selectedHub?.id ?? "");

    if (!selectedHub) {
      return;
    }

    form.setFieldValue("city", selectedHub.city);
    form.setFieldValue("district", selectedHub.district);
    form.setFieldValue("division", selectedHub.division);
  }, [selectedHub, form]);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const fileError = validateApplicationFiles([...files, ...selected]);

    event.target.value = "";

    if (fileError) {
      toast.add({
        title: "Attachment rejected",
        description: fileError,
        type: "error",
      });
      return;
    }

    setFiles([...files, ...selected]);
  };

  const handleVerify = () => {
    const parsed = otpSchema.safeParse({ otp });

    if (!parsed.success) {
      setOtpError(parsed.error.issues[0]?.message ?? "Please enter the code");
      return;
    }

    setOtpError(null);

    verifyApplication(
      { applicationId, otp },
      {
        onSuccess: (response) => {
          setApplication(response.data ?? null);
          setStep("submitted");

          toast.add({
            title: "Application verified",
            description:
              "It is now waiting for an admin to review your application.",
            type: "success",
          });
        },

        onError: (error: unknown) => {
          toast.add({
            title: "Verification failed",
            description: getApiErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  /* ==========================================
     VERIFY STEP
     ========================================== */

  if (step === "verify") {
    return (
      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SendIcon className="size-4" /> Verify your application
          </CardTitle>
          <CardDescription>
            We emailed a 6 digit code to {me?.email}. The application stays in
            draft until the code is submitted.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="hub-application-verify-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleVerify();
            }}
          >
            <FieldGroup>
              <OtpInput
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setOtpError(null);
                }}
                isInvalid={Boolean(otpError)}
                errors={[{ message: otpError ?? undefined }]}
                description="The code expires after one hour."
              />
            </FieldGroup>
          </form>
        </CardContent>

        <div className="flex justify-end gap-2 px-6 pb-6">
          <Button type="submit" form="hub-application-verify-form" disabled={verifyPending}>
            {verifyPending ? <Spinner /> : <CircleCheckIcon />}
            Verify application
          </Button>
        </div>
      </Card>
    );
  }

  /* ==========================================
     SUBMITTED STEP
     ========================================== */

  if (step === "submitted" && application) {
    return (
      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleCheckIcon className="size-4 text-chart-2" /> Application
            received
          </CardTitle>
          <CardDescription>
            An admin reviews every application. You will get an email as soon as
            it is approved or rejected.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <ApplicationStatusBadge status={application.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Hub</dt>
              <dd className="text-right font-medium">
                {application.hub.name} ({application.hub.hubCode})
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Applied from</dt>
              <dd className="text-right font-medium">
                {application.city}, {application.division}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    );
  }

  /* ==========================================
     FORM STEP
     ========================================== */

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
          <CardTitle className="flex items-center gap-2">
            <Building2Icon className="size-4" /> Hub
          </CardTitle>
          <CardDescription>
            Only active hubs are listed. The hub you pick is the one you will
            work for once the application is approved.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <form.Field name="hubId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Apply to hub</FieldLabel>
                    <Select
                      id={field.name}
                      disabled={hubsPending || hubs.length === 0}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        setSelectedHub(
                          hubs.find((hub) => hub.id === event.target.value) ??
                            null,
                        )
                      }
                      aria-invalid={isInvalid}
                    >
                      <option value="">
                        {hubsPending
                          ? "Loading hubs..."
                          : hubs.length === 0
                            ? "No active hub is available"
                            : "Select a hub"}
                      </option>
                      {hubs.map((hub) => (
                        <option key={hub.id} value={hub.id}>
                          {hub.name} &middot; {hub.hubCode} &middot; {hub.city}
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

            {selectedHub && (
              <p className="text-sm text-muted-foreground">
                {selectedHub.name} &middot; {selectedHub.city},{" "}
                {selectedHub.district}, {selectedHub.division}
              </p>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>
            These details are stored on the application so the hub can reach you.
            Name and email come from your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="applicantName">Name</FieldLabel>
                <Input
                  id="applicantName"
                  value={me?.name ?? ""}
                  readOnly
                  disabled
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="applicantEmail">Email</FieldLabel>
                <Input
                  id="applicantEmail"
                  type="email"
                  value={me?.email ?? ""}
                  readOnly
                  disabled
                />
              </Field>
            </div>

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
                      onChange={(event) => field.handleChange(event.target.value)}
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
                      onChange={(event) => field.handleChange(event.target.value)}
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
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="size-4" /> Attachments
            <span className="text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </CardTitle>
          <CardDescription>
            Any document the hub may ask for, such as a national id or a trade
            licence.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldLegend variant="label">Files</FieldLegend>

              <Field>
                <FieldLabel htmlFor="applicationFiles" className="sr-only">
                  Attachments
                </FieldLabel>
                <Input
                  id="applicationFiles"
                  type="file"
                  multiple
                  accept={ACCEPTED_APPLICATION_FILES}
                  onChange={handleFilesChange}
                />
                <FieldDescription>
                  {files.length} of {MAX_APPLICATION_FILES} attached. Images and
                  PDF files up to 5 MB each.
                </FieldDescription>
              </Field>

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file) => (
                    <li
                      key={`${file.name}-${file.lastModified}`}
                      className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                    >
                      <span className="truncate">{file.name}</span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${file.name}`}
                        onClick={() =>
                          setFiles((current) =>
                            current.filter((item) => item !== file),
                          )
                        }
                      >
                        <XIcon />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </FieldSet>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={applyPending || hubsPending || hubs.length === 0}
        >
          {applyPending ? (
            <>
              <Spinner /> Submitting
            </>
          ) : (
            <>
              <SendIcon /> Submit application
            </>
          )}
        </Button>
      </div>
    </form>
  );
}