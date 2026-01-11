"use client";

import { use } from "react";
import SupervisionEvaluationDetails from "@/features/programs/components/evaluation/SupervisionEvaluationDetails";

interface SupervisionEvaluationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SupervisionEvaluationDetailPage({
  params
}: SupervisionEvaluationDetailPageProps) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <SupervisionEvaluationDetails evaluationId={id} />
      </div>
    </div>
  );
}