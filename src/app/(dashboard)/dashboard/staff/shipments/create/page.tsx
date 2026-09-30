import RoleGuard from "@/auth/role-guard";
import ShipmentCreateForm from "@/components/form/shipment-create-form";

export default function StaffShipmentCreatePage() {
  return (
    <RoleGuard roles={["STAFF"]}>
      <div className="flex flex-col gap-5 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Create Shipment
          </h1>
          <p className="text-sm text-muted-foreground">
            Register a parcel, check the delivery charge and collect the payment
            through bKash.
          </p>
        </header>

        <ShipmentCreateForm />
      </div>
    </RoleGuard>
  );
}
