import SchoolDetails from "@/components/layouts/dashboard/SchoolDetails";

export default async function SchoolDetailsPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  return <SchoolDetails schoolId={schoolId} />;
}
