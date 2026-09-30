import RoleGuard from "@/auth/role-guard";
import { ShipmentDetails } from "@/components/module/shipment/shipment-details";

export default async function ShipmentDetailsPage({
  params,
}: {
  params: Promise<{ shipmentId: string }>;
}) {
  const { shipmentId } = await params;

  return (
    <RoleGuard roles={["CUSTOMER", "STAFF", "ADMIN", "SUPER_ADMIN"]}>
      <div className="p-4 md:p-6">
        <ShipmentDetails
          shipmentId={shipmentId}
          backHref="/dashboard/shipments"
          backLabel="Back to my shipments"
        />
      </div>
    </RoleGuard>
  );
}
