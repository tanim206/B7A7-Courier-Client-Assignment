import HubDetails from "@/components/module/admin/hub-details";

export default async function AdminHubDetailsRoute({
  params,
}: {
  params: Promise<{ hubId: string }>;
}) {
  const { hubId } = await params;

  return <HubDetails hubId={hubId} />;
}
