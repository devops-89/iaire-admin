import BoardDetails from "@/components/layouts/dashboard/BoardDetails";

export default function BoardDetailsPage({ params }: { params: { id: string } }) {
  return <BoardDetails boardId={params.id} />;
}
