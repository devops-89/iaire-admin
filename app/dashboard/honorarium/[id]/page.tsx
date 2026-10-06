import HonorariumDetails from "@/components/layouts/dashboard/honorarium/HonorariumDetails";

export default async function HonorariumDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HonorariumDetails honorariumId={id} />;
}
