import { CheckIcon } from "lucide-react";
import { cn } from "cn";
import type { ShipmentStatus } from "@/types";

/* ==========================================
   HAPPY PATH ORDER
========================================== */

const timelineSteps: { status: ShipmentStatus; label: string }[] = [
  { status: "PENDING", label: "Parcel Received" },
  { status: "PICKUP_SCHEDULED", label: "Pickup Scheduled" },
  { status: "PICKED_UP", label: "Picked Up" },
  { status: "AT_ORIGIN_HUB", label: "At Origin Hub" },
  { status: "TRANSIT", label: "In Transit" },
  { status: "AT_DESTINATION_HUB", label: "Arrived At Hub" },
  { status: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
  { status: "DELIVERED", label: "Delivered" },
];

const isClosedStatus = (status: ShipmentStatus) =>
  status === "CANCELLED" || status === "FAILED_DELIVERY";

export function ShipmentTimeline({ status }: { status: ShipmentStatus }) {
  //  A CLOSED SHIPMENT NEVER PROGRESSES ANY FURTHER

  if (isClosedStatus(status)) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <p className="font-medium text-destructive">
          This shipment is {status === "CANCELLED" ? "cancelled" : "failed"}.
        </p>
        <p className="text-muted-foreground">
          {status === "CANCELLED"
            ? "The parcel will not be delivered. Contact your hub for more information."
            : "The delivery attempt was unsuccessful. Please contact the destination hub."}
        </p>
      </div>
    );
  }

  const currentIndex = timelineSteps.findIndex((step) => step.status === status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:gap-2">
      {timelineSteps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step.status}
            className="flex flex-1 gap-3 sm:flex-col sm:gap-1.5"
          >
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                  isDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted text-muted-foreground",
                  isCurrent && "ring-3 ring-primary/25",
                )}
              >
                {isDone ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
              {index < timelineSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-px flex-1 sm:h-px sm:w-full",
                    index < currentIndex ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "pb-4 text-xs leading-tight sm:pb-0",
                isCurrent
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
