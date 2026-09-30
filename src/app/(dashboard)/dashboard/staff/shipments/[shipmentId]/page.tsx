import RoleGuard from "@/auth/role-guard";
import { ShipmentDetails } from "@/components/module/shipment/shipment-details";

export default async function StaffShipmentDetailsPage({
  params,
}: {
  params: Promise<{ shipmentId: string }>;
}) {
  const { shipmentId } = await params;

  return (
    <RoleGuard roles={["STAFF", "ADMIN", "SUPER_ADMIN"]}>
      <div className="p-4 md:p-6">
        <ShipmentDetails
          shipmentId={shipmentId}
          backHref="/dashboard/staff/shipments"
          backLabel="Back to shipments"
        />
      </div>
    </RoleGuard>
  );
}
