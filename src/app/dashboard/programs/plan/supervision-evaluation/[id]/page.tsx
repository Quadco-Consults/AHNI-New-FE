import SupervisionEvaluationDetail from "@/features/programs/components/evaluation/SupervisionEvaluationDetail";

interface SupervisionEvaluationDetailPageProps {
  params: { id: string };
}

export default function SupervisionEvaluationDetailPage({
  params
}: SupervisionEvaluationDetailPageProps) {
  return <SupervisionEvaluationDetail evaluationId={params.id} />;
}