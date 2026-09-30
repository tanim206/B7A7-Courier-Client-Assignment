import { ShipmentDetails } from "@/components/module/shipment/shipment-details";

export default async function AdminShipmentDetailsPage({
  params,
}: {
  params: Promise<{ shipmentId: string }>;
}) {
  const { shipmentId } = await params;

  return (
    <div className="p-4 md:p-6">
      <ShipmentDetails
        shipmentId={shipmentId}
        backHref="/dashboard/admin/shipments"
        backLabel="Back to all shipments"
      />
    </div>
  );
}
