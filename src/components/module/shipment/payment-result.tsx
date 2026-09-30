"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CircleCheckIcon,
  CircleXIcon,
  CreditCardIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRetryPayment } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

interface IProps {
  status?: string;
  shipmentId?: string;
  amount?: string;
  trxId?: string;
  canRetry?: boolean;
  paymentUrl?: string;
  message?: string;
}

type ViewState = "success" | "failure" | "cancel" | "pending";

const resolveState = (status?: string): ViewState => {
  if (status === "success") return "success";
  if (status === "cancel") return "cancel";
  if (status === "pending" || status === "failure") return status;
  return "pending";
};

const viewContent: Record<
  ViewState,
  { title: string; description: string; icon: React.ReactNode }
> = {
  success: {
    title: "Payment successful",
    description:
      "The payment was verified with bKash and the parcel is now scheduled for pickup.",
    icon: <CircleCheckIcon className="size-10 text-emerald-600" />,
  },
  failure: {
    title: "Payment failed",
    description:
      "bKash could not confirm the payment. No money was collected, you can safely try again.",
    icon: <CircleXIcon className="size-10 text-destructive" />,
  },
  cancel: {
    title: "Payment cancelled",
    description:
      "You cancelled the bKash checkout. The parcel is saved and the payment can be completed later.",
    icon: <TriangleAlertIcon className="size-10 text-amber-600" />,
  },
  pending: {
    title: "Complete your payment",
    description:
      "The parcel is saved. Continue to bKash to pay the delivery charge.",
    icon: <CreditCardIcon className="size-10 text-primary" />,
  },
};

export function PaymentResult({
  status,
  shipmentId,
  amount,
  trxId,
  canRetry,
  paymentUrl,
  message,
}: IProps) {
  const [targetUrl, setTargetUrl] = useState(paymentUrl ?? null);
  const { mutate: retryPayment, isPending: retryPending } = useRetryPayment();

  const view = resolveState(status);
  const content = viewContent[view];

  //  THE GATEWAY REASON IS SHOWN WHEN THERE IS ONE, ELSE THE FRIENDLY COPY

  const description = message?.trim()
    ? `${content.description} (${message.trim()})`
    : content.description;

  //  THE PAYER IS THE SENDER, AND THIS ROUTE IS OPEN TO EVERY ROLE
  //  SENDING A CUSTOMER TO THE STAFF PAGE WOULD SHOW AN EMPTY LIST

  const detailsHref = shipmentId
    ? `/dashboard/shipments/${shipmentId}`
    : "/dashboard/shipments";

  const canStartPayment =
    Boolean(shipmentId) && (view !== "success" || canRetry === false);

  return (
    <div className="flex justify-center p-4 md:p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <div className="flex justify-center">{content.icon}</div>
          <CardTitle className="text-xl">{content.title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {amount && (
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-2xl font-semibold">{amount} BDT</p>
            </div>
          )}

          {trxId && (
            <p className="text-center text-xs text-muted-foreground">
              Transaction ID: {trxId}
            </p>
          )}

          {shipmentId && (
            <p className="text-center text-xs text-muted-foreground">
              Shipment ID: {shipmentId}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {view === "success" && (
              <Button
                nativeButton={false}
                render={<Link href={detailsHref} />}
              >
                View shipment
              </Button>
            )}

            {canStartPayment && targetUrl && (
              <Button onClick={() => window.location.assign(targetUrl)}>
                Continue to bKash
              </Button>
            )}

            {canStartPayment && !targetUrl && (
              <Button
                disabled={retryPending}
                onClick={() =>
                  retryPayment(shipmentId as string, {
                    onSuccess: (response) => {
                      const url = response.data.paymentUrl;

                      if (url) {
                        setTargetUrl(url);
                        window.location.assign(url);
                        return;
                      }

                      toast.add({
                        title: "bKash is unavailable",
                        description:
                          response.data.paymentError ||
                          "The payment session could not be created. Please try again in a moment.",
                        type: "error",
                      });
                    },
                    onError: (error: unknown) =>
                      toast.add({
                        title: "Payment could not be started",
                        description: getApiErrorMessage(error),
                        type: "error",
                      }),
                  })
                }
              >
                {retryPending ? <Spinner /> : <CreditCardIcon />}
                Pay with bKash
              </Button>
            )}

            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={detailsHref} />}
            >
              {view === "success" ? "Close" : "View shipment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
