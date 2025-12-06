import SupervisionEvaluationDetails from "@/features/programs/components/evaluation/SupervisionEvaluationDetails";

interface SupervisionEvaluationDetailPageProps {
  params: { id: string };
}

export default function SupervisionEvaluationDetailPage({
  params
}: SupervisionEvaluationDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <SupervisionEvaluationDetails evaluationId={params.id} />
      </div>
    </div>
  );
}