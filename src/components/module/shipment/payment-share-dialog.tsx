"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  Share2Icon,
  TriangleAlertIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useCopyToClipboard, useRetryPayment } from "@/hooks"
import { getApiErrorMessage } from "@/lib/api-error"
import { buildQrImageUrl } from "@/lib/qr"

/* ==========================================
   PAYMENT QR
   THE DETAILS RESPONSE DOES NOT CARRY A
   PAYMENT URL, SO OPENING THIS DIALOG ASKS
   THE API FOR A FRESH BKASH LINK EVERY TIME

   THE QR ONLY EXISTS WHILE THE DIALOG IS OPEN
   SO A STALE OR REUSED LINK IS NEVER SHOWN
   ========================================== */

const QR_SIZE = 320

interface IProps {
  shipmentId: string;
  amount?: string;
  currency?: string;
}

/*  A DESKTOP BROWSER OFTEN HAS NO SHARE SHEET SO
    THE BUTTON ONLY RENDERS WHEN ONE EXISTS,
    COPY LINK ALWAYS STAYS AS THE FALLBACK  */

const canUseNativeShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function"

export function PaymentShareDialog({ shipmentId, amount, currency }: IProps) {
  const [open, setOpen] = React.useState(false)
  const [paymentUrl, setPaymentUrl] = React.useState<string | null>(null)
  const [linkError, setLinkError] = React.useState<string | null>(null)
  const [supportsShare, setSupportsShare] = React.useState(false)

  const { mutate: retryPayment, isPending } = useRetryPayment()
  const { copiedValue, copy } = useCopyToClipboard()

  React.useEffect(() => {
    setSupportsShare(canUseNativeShare())
  }, [])

  const qrImageUrl = React.useMemo(
    () => (open ? buildQrImageUrl(paymentUrl, QR_SIZE) : null),
    [open, paymentUrl]
  )

  const isCopied = paymentUrl !== null && copiedValue === paymentUrl

  const requestLink = () => {
    setPaymentUrl(null)
    setLinkError(null)

    retryPayment(shipmentId, {
      onSuccess: (response) => {
        const url = response.data.paymentUrl?.trim()

        if (!url) {
          setLinkError(
            response.data.paymentError ||
              "The payment session could not be created. Please try again in a moment."
          )
          return
        }

        setPaymentUrl(url)
      },
      onError: (error: unknown) => setLinkError(getApiErrorMessage(error)),
    })
  }

  /*  EVERY OPEN ASKS FOR A NEW LINK SO THE RECEIVER
      NEVER SCANS A SESSION THAT HAS ALREADY BEEN
      USED OR EXPIRED  */

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (nextOpen) {
      requestLink()
    }
  }

  const handleCopy = async () => {
    if (!paymentUrl) return

    const copied = await copy(paymentUrl)

    toast.add({
      title: copied ? "Payment link copied" : "Could not copy the link",
      description: copied
        ? "Send it to the payer, they can open it in the bKash app."
        : "Copy the link from the text box above instead.",
      type: copied ? "success" : "error",
    })
  }

  const handleShare = async () => {
    if (!paymentUrl) return

    try {
      await navigator.share({
        title: `Pay for shipment ${shipmentId}`,
        text: amount
          ? `Delivery charge ${amount} ${currency ?? "BDT"} for shipment ${shipmentId}`
          : `Payment link for shipment ${shipmentId}`,
        url: paymentUrl,
      })
    } catch {
      /*  THE USER CLOSED THE SHARE SHEET, THAT IS NOT
          AN ERROR AND NEEDS NO TOAST  */
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" disabled={isPending} />
        }
      >
        <Share2Icon /> Share payment
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan to pay with bKash</DialogTitle>
          <DialogDescription>
            {amount
              ? `${amount} ${currency ?? "BDT"} for shipment ${shipmentId}.`
              : `Payment link for shipment ${shipmentId}.`}{" "}
            Open the bKash app and scan the code.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-2">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Spinner className="size-6" />
            </div>
          ) : qrImageUrl ? (
            <div className="flex flex-col items-center gap-3">
              {/* biome-ignore lint/performance/noImgElement: remote qr image */}
              <img
                src={qrImageUrl}
                alt={`bKash payment QR code for shipment ${shipmentId}`}
                width={QR_SIZE}
                height={QR_SIZE}
                className="size-64 rounded-lg bg-white p-2 ring-1 ring-foreground/10"
              />
              <p className="text-xs text-muted-foreground">
                The link works once, for a single payment.
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
              <TriangleAlertIcon className="size-8 text-destructive" />
              <p className="text-sm font-medium">
                The payment link could not be created
              </p>
              <p className="text-xs text-muted-foreground">
                {linkError ?? "Please try again in a moment."}
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={requestLink}
              >
                Try again
              </Button>
            </div>
          )}
        </div>

        {paymentUrl && (
          <>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Payment link</p>
              <p className="font-mono text-xs break-all select-all">
                {paymentUrl}
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCopy}>
                {isCopied ? <CheckIcon /> : <CopyIcon />}
                {isCopied ? "Copied" : "Copy link"}
              </Button>

              {supportsShare && (
                <Button onClick={handleShare}>
                  <Share2Icon /> Share
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}