"use client";

import GoBack from "components/GoBack";
import VendorEvaluationScoringForm from "../VendorEvaluationScoringForm";
import VendorsEvaluaionAndPerformanceAPI from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { useRouter, useParams } from "next/navigation";
import { Loading } from "components/Loading";
import { toast } from "sonner";

const InterviewForm = () => {
  const params = useParams();
  const router = useRouter();

  const { data: vendorEvaluationData, isLoading } =
    VendorsEvaluaionAndPerformanceAPI.useGetSingleVendorEvaluation(
      params?.id as string
    );

  const {
    submitVendorEvaluation: submitEvaluation,
    isLoading: isSubmitting,
  } = VendorsEvaluaionAndPerformanceAPI.useSubmitVendorEvaluation(
    params?.id as string
  );

  const handleSubmit = async (evaluationData: any) => {
    // Map the new scoring form data to the backend expected format
    const payload = {
      evaluators: vendorEvaluationData?.data?.evaluators,
      supervisors: vendorEvaluationData?.data?.supervisors,
      total_score: evaluationData.total_score,
      evaluator_recommendation: evaluationData.evaluator_recommendation,
      criteria_scores: evaluationData.criteria.map((criterion: any, index: number) => {
        // Map criteria names to backend field names
        const criteriaNameMap: Record<string, string> = {
          "Quality of Goods/Services": "quality",
          "Timeliness of Delivery": "delivery_leadtime",
          "Communication & Responsiveness": "responsiveness",
          "Compliance with Contract Terms": "professionalism",
          "Overall Satisfaction": "overall_satisfaction",
        };

        return {
          criteria: criteriaNameMap[criterion.name] || `criteria_${index}`,
          value: criterion.score,
          comments: criterion.comments,
        };
      }),
      comments: evaluationData.general_comments,
      status: "COMPLETED",
    };

    try {
      await submitEvaluation(payload);
      toast.success("Vendor evaluation submitted successfully!");
      router.back();
    } catch (error) {
      console.error("Evaluation submission error:", error);
      toast.error("Failed to submit evaluation. Please try again.");
      throw error; // Re-throw to let the scoring form handle it
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <GoBack />
        <Loading />
      </div>
    );
  }

  const vendorName = vendorEvaluationData?.data?.vendor?.name || "Unknown Vendor";
  const service = vendorEvaluationData?.data?.service || "General Service";

  return (
    <div className="flex flex-col gap-4">
      <GoBack />
      <VendorEvaluationScoringForm
        vendorName={vendorName}
        service={service}
        evaluationId={params?.id as string}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
};

export default InterviewForm;
