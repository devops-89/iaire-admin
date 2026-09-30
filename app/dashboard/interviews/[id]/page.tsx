import InterviewDetails from "@/components/layouts/dashboard/training/InterviewDetails";

export default async function InterviewDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InterviewDetails teacherId={id} />;
}
