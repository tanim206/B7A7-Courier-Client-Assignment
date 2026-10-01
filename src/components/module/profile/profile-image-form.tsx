"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ImageIcon,
  SaveIcon,
  Trash2Icon,
  User as UserIcon,
} from "lucide-react";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ACCEPTED_PROFILE_IMAGE } from "@/constants";
import { useGetMe, useUploadProfileImage } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { settingsRouteByRole } from "@/routes";
import { validateProfileImage } from "@/validation";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

/* ==========================================
   PROFILE PHOTO
   THE PICTURE GETS ITS OWN URL SO THE NAME AND
   THE PHONE FORM STAYS UNTOUCHED WHILE A LARGE
   IMAGE IS UPLOADED
========================================== */

export default function ProfileImageForm() {
  const { data, isPending, isError } = useGetMe();
  const { mutate: uploadImage, isPending: isUploading } =
    useUploadProfileImage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const user = data?.data;

  //  THE PREVIEW IS A LOCAL OBJECT URL SO IT MUST BE
  //  RELEASED WHEN THE PICTURE CHANGES OR THE PAGE CLOSES

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;

    event.target.value = "";

    if (!selected) {
      return;
    }

    const fileError = validateProfileImage(selected);

    if (fileError) {
      toast.add({
        title: "Image rejected",
        description: fileError,
        type: "error",
      });
      return;
    }

    setFile(selected);
  };

  const handleSave = () => {
    if (!file) {
      return;
    }

    uploadImage(file, {
      onSuccess: () => {
        setFile(null);

        toast.add({
          title: "Photo updated",
          description: "Your new profile photo is live.",
          type: "success",
        });
      },

      onError: (error: unknown) => {
        toast.add({
          title: "Photo could not be uploaded",
          description: getApiErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-4"
        nativeButton={false}
        render={
          <Link href={settingsRouteByRole[user.role]}>
            <ArrowLeftIcon />
            Back to settings
          </Link>
        }
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Profile photo</CardTitle>
          <CardDescription>
            Pick a clear picture of yourself, the previous one is deleted for
            you once the new one is stored.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative">
            {preview ? (
              // biome-ignore lint/performance/noImgElement: local object url
              <img
                src={preview}
                alt="Selected profile photo"
                className="size-32 rounded-full object-cover ring-1 ring-foreground/10"
              />
            ) : user.imageUrl ? (
              // biome-ignore lint/performance/noImgElement: remote avatar
              <img
                src={user.imageUrl}
                alt={user.name}
                className="size-32 rounded-full object-cover ring-1 ring-foreground/10"
              />
            ) : (
              <span className="flex size-32 items-center justify-center rounded-full bg-muted text-3xl font-semibold text-muted-foreground ring-1 ring-foreground/10">
                {initialsOf(user.name) || <UserIcon className="size-10" />}
              </span>
            )}

            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                <Spinner className="size-6" />
              </span>
            )}
          </div>

          <FieldGroup className="w-full max-w-md">
            <Field>
              <FieldLabel htmlFor="profileImage" className="sr-only">
                Profile photo
              </FieldLabel>
              <Input
                id="profileImage"
                type="file"
                accept={ACCEPTED_PROFILE_IMAGE}
                onChange={handleFileChange}
              />
              <FieldDescription>
                {file
                  ? `${file.name} is ready, ${(file.size / 1024 / 1024).toFixed(2)} MB.`
                  : "JPG, PNG, WebP or GIF up to 5 MB."}
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div className="flex flex-wrap justify-center gap-2">
            {file && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <Trash2Icon />
                Discard
              </Button>
            )}

            <Button type="button" onClick={handleSave} disabled={!file || isUploading}>
              {isUploading ? <Spinner /> : <SaveIcon />}
              Save photo
            </Button>
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="size-3.5" />
            Your photo is only visible to you and the staff handling your
            shipments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
