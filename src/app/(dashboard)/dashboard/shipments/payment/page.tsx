import { PaymentResult } from "@/components/module/shipment/payment-result";

/* ==========================================
   TARGET OF THE BKASH REDIRECT
   READING searchParams ON THE SERVER AVOIDS
   THE CLIENT-SIDE SUSPENSE BOUNDARY.
========================================== */

type SearchParams = Record<string, string | string[] | undefined>;

const readParam = (params: SearchParams, key: string) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

export default async function ShipmentPaymentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <PaymentResult
      status={readParam(params, "status")}
      shipmentId={readParam(params, "shipmentId")}
      amount={readParam(params, "amount")}
      trxId={readParam(params, "trxID")}
      canRetry={readParam(params, "canRetryPayment") === "true"}
      paymentUrl={readParam(params, "url")}
      message={readParam(params, "message")}
    />
  );
}
