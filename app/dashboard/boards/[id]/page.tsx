import BoardDetails from "@/components/layouts/dashboard/BoardDetails";

export default async function BoardDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BoardDetails boardId={id} />;
}
