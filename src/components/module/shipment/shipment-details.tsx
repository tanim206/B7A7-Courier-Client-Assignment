"use client";

import Link from "next/link";
import { ArrowLeftIcon, CreditCardIcon, PackageCheckIcon, PackageXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  PaymentStatusBadge,
  ShipmentStatusBadge,
} from "@/components/module/shipment/shipment-status-badge";
import { PaymentShareDialog } from "@/components/module/shipment/payment-share-dialog";
import { ShipmentTimeline } from "@/components/module/shipment/shipment-timeline";
import {
  useDeliverShipment,
  useGetMe,
  useReceiveShipment,
  useRetryPayment,
  useShipmentById,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Shipment } from "@/types";

interface IProps {
  shipmentId: string;
  backHref: string;
  backLabel: string;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium break-words">{value}</dd>
    </div>
  );
}

export function ShipmentDetails({ shipmentId, backHref, backLabel }: IProps) {
  const { data: me } = useGetMe();
  const role = me?.data?.role;

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useShipmentById(shipmentId);

  const { mutate: retryPayment, isPending: retryPending } = useRetryPayment();
  const { mutate: receiveShipment, isPending: receivePending } =
    useReceiveShipment();
  const { mutate: deliverShipment, isPending: deliverPending } =
    useDeliverShipment();

  const shipment: Shipment | undefined = response?.data;

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !shipment) {
    return (
      <Card>
        <CardContent className="space-y-3 py-10 text-center">
          <p className="text-sm font-medium">Shipment could not be loaded</p>
          <p className="text-sm text-muted-foreground">
            {getApiErrorMessage(error, "Shipment not found")}
          </p>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={backHref} />}
          >
            <ArrowLeftIcon /> {backLabel}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isStaff = role === "STAFF";
  const actions = response.data.actions;
  const isActionPending = retryPending || receivePending || deliverPending;

  //  THE PAYMENT BLOCKS SHARE ONE GATE, A COLLECTED
  //  PARCEL NO LONGER NEEDS A LINK TO PAY FOR

  const showsPaymentActions =
    (actions.canPay || isStaff) && shipment.payment?.status !== "PAID";

  const handlePay = (paymentUrl: string | null, paymentError?: string | null) => {
    if (!paymentUrl) {
      toast.add({
        title: "bKash is unavailable",
        description:
          paymentError ||
          "The payment session could not be created. Please try again in a moment.",
        type: "error",
      });
      return;
    }

    window.location.href = paymentUrl;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href={backHref} />}
        >
          <ArrowLeftIcon /> {backLabel}
        </Button>

        <div className="flex flex-wrap gap-2">
          {showsPaymentActions && (
            <>
              <Button
                disabled={isActionPending}
                onClick={() =>
                  retryPayment(shipment.id, {
                    onSuccess: (retryResponse) =>
                      handlePay(
                        retryResponse.data.paymentUrl,
                        retryResponse.data.paymentError,
                      ),
                    onError: (retryError: unknown) =>
                      toast.add({
                        title: "Payment could not be started",
                        description: getApiErrorMessage(retryError),
                        type: "error",
                      }),
                  })
                }
              >
                {retryPending ? <Spinner /> : <CreditCardIcon />}
                Pay with bKash
              </Button>

              <PaymentShareDialog
                shipmentId={shipment.id}
                amount={shipment.payment?.amount}
                currency={shipment.payment?.currency}
              />
            </>
          )}

          {isStaff && actions.canReceive && (
            <Button
              variant="secondary"
              disabled={isActionPending}
              onClick={() =>
                receiveShipment(shipment.id, {
                  onSuccess: () =>
                    toast.add({
                      title: "Parcel received",
                      description: "The parcel was marked as received.",
                      type: "success",
                    }),
                  onError: (receiveError: unknown) =>
                    toast.add({
                      title: "Parcel could not be received",
                      description: getApiErrorMessage(receiveError),
                      type: "error",
                    }),
                })
              }
            >
              {receivePending ? <Spinner /> : <PackageCheckIcon />}
              Mark as received
            </Button>
          )}

          {isStaff && actions.canDeliver && (
            <Button
              disabled={isActionPending}
              onClick={() =>
                deliverShipment(shipment.id, {
                  onSuccess: () =>
                    toast.add({
                      title: "Parcel delivered",
                      description: "The delivery was completed.",
                      type: "success",
                    }),
                  onError: (deliverError: unknown) =>
                    toast.add({
                      title: "Delivery could not be completed",
                      description: getApiErrorMessage(deliverError),
                      type: "error",
                    }),
                })
              }
            >
              {deliverPending ? <Spinner /> : <PackageXIcon />}
              Mark as delivered
            </Button>
          )}
        </div>
      </div>

      {/*  OVERVIEW  */}

      <Card>
        <CardHeader>
          <CardDescription>Shipment {shipment.id}</CardDescription>
          <CardTitle className="text-lg">
            {shipment.parcelName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <ShipmentStatusBadge status={shipment.status} />
            {shipment.payment && (
              <PaymentStatusBadge status={shipment.payment.status} />
            )}
          </div>

          <ShipmentTimeline status={shipment.status} />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/*  ROUTING  */}

        <Card>
          <CardHeader>
            <CardTitle>Routing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                From
              </p>
              <p className="text-sm font-medium">
                {shipment.originHub.name} ({shipment.originHub.hubCode})
              </p>
              <p className="text-xs text-muted-foreground">
                {shipment.originHub.city}, {shipment.originHub.division}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                To
              </p>
              <p className="text-sm font-medium">
                {shipment.destinationHub.name} (
                {shipment.destinationHub.hubCode})
              </p>
              <p className="text-xs text-muted-foreground">
                {shipment.destinationHub.city},{" "}
                {shipment.destinationHub.division}
              </p>
            </div>
          </CardContent>
        </Card>

        {/*  RECEIVER  */}

        <Card>
          <CardHeader>
            <CardTitle>Receiver</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <InfoRow label="Name" value={shipment.receiverName} />
              <InfoRow label="Phone" value={shipment.receiverPhone} />
              <InfoRow label="Email" value={shipment.receiverEmail} />
              <InfoRow label="Address" value={shipment.receiverAddress} />
              <InfoRow
                label="Location"
                value={`${shipment.receiverCity}, ${shipment.receiverDistrict}, ${shipment.receiverDivision}`}
              />
            </dl>
          </CardContent>
        </Card>

        {/*  SENDER  */}

        <Card>
          <CardHeader>
            <CardTitle>Sender</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <InfoRow label="Name" value={shipment.senderName} />
              <InfoRow label="Phone" value={shipment.senderPhone} />
              <InfoRow label="Email" value={shipment.senderEmail} />
              <InfoRow
                label="Parcel"
                value={
                  shipment.weight
                    ? `${shipment.parcelName} (${shipment.weight} KG)`
                    : shipment.parcelName
                }
              />
              {shipment.description && (
                <InfoRow label="Description" value={shipment.description} />
              )}
            </dl>
          </CardContent>
        </Card>

        {/*  PAYMENT  */}

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {shipment.payment ? (
              <dl className="space-y-2">
                <InfoRow
                  label="Amount"
                  value={`${shipment.payment.amount} ${shipment.payment.currency}`}
                />
                <InfoRow label="Method" value="bKash" />
                <InfoRow
                  label="Transaction ID"
                  value={shipment.payment.bkashTrxId ?? "Not completed yet"}
                />
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payment record found for this shipment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
