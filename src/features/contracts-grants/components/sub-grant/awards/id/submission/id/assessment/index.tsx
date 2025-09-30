"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Send } from "lucide-react";
import {
  useGetAssessmentCriteria,
  useGetAssessmentBySubmission,
  useCreateAssessment,
  useUpdateAssessment,
  useSubmitAssessment,
} from "@/features/contracts-grants/controllers/assessmentController";
import { TAssessmentFormData, TAssessmentCreateUpdateFormData } from "@/features/contracts-grants/types/contract-management/sub-grant/assessment";
import { PreAwardQuestionData } from "@/features/modules/types/cg";

const assessmentSchema = z.object({
  overall_comments: z.string().optional(),
  recommendation: z.enum(["APPROVE", "REJECT", "CONDITIONALLY_APPROVE", "NEEDS_REVISION"]),
  scores: z.array(
    z.object({
      criteria: z.string().min(1, "Criteria is required"),
      score: z.number().min(0, "Score must be at least 0"),
      comments: z.string().optional(),
    })
  ).optional(),
});

export default function AssessmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const submissionId = params?.id as string;

  const { data: criteriaData, isLoading: criteriaLoading, error: criteriaError } = useGetAssessmentCriteria();
  // Temporarily disable assessment backend calls since endpoints don't exist yet
  const existingAssessment = null;
  const isCreating = false;
  const isUpdating = false;
  const isSubmittingAssessment = false;

  const criteria = criteriaData?.data || [];
  const assessment = null; // existingAssessment?.data;
  const isEditing = false; // !!assessment;
  const isReadOnly = false; // assessment?.status === "SUBMITTED" || assessment?.status === "REVIEWED" ||
                    // assessment?.status === "APPROVED" || assessment?.status === "REJECTED";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TAssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      overall_comments: "",
      recommendation: "APPROVE",
      scores: criteria.map((criterion) => ({
        criteria: criterion.id,
        score: 0,
        comments: "",
      })),
    },
  });

  const watchedScores = watch("scores") || [];
  const totalScore = watchedScores.reduce((sum, score) => sum + (score.score || 0), 0);
  // Use weight if available, otherwise default to 10 points per question
  const maxPossibleScore = criteria.reduce((sum, criterion) => sum + (criterion.weight || 10), 0);
  const percentageScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

  const onSave = async (data: TAssessmentFormData) => {
    try {
      // For now, just log the assessment data since backend endpoints don't exist yet
      console.log("Assessment data to save:", {
        ...data,
        submission: submissionId,
        totalScore,
        percentageScore,
      });
      toast.success("Assessment form completed! (Backend integration pending)");
    } catch (error: any) {
      toast.error("Failed to save assessment");
    }
  };

  const onSubmitAssessment = async () => {
    try {
      setIsSubmitting(true);
      // For now, just log the submission
      console.log("Assessment submitted for submission:", submissionId);
      toast.success("Assessment would be submitted! (Backend integration pending)");
    } catch (error: any) {
      toast.error("Failed to submit assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    if (!maxScore) return "text-gray-500";
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "APPROVE":
        return "text-green-600 bg-green-50 border-green-200";
      case "CONDITIONALLY_APPROVE":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "NEEDS_REVISION":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "REJECT":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (criteriaLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading assessment criteria...</p>
      </div>
    );
  }

  if (criteriaError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading assessment criteria. Please check if pre-award questions are configured.</p>
      </div>
    );
  }

  if (!criteria.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No assessment criteria found. Please configure pre-award questions first.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pre-Award Assessment</h1>
        <div className="px-3 py-1 rounded-full text-sm font-medium border text-gray-600 bg-gray-50 border-gray-200">
          DRAFT
        </div>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        {/* Score Summary */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Score Summary</h3>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(totalScore, maxPossibleScore)}`}>
                {totalScore} / {maxPossibleScore}
              </div>
              <div className={`text-sm ${getScoreColor(totalScore, maxPossibleScore)}`}>
                {percentageScore.toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>

        {/* Assessment Criteria */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Assessment Criteria</h3>
          <div className="space-y-4">
            {criteria.map((criterion, index) => (
              <div key={criterion.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{criterion.question}</h4>
                    {criterion.description && (
                      <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Max: {criterion.weight || 10} points
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`score-${index}`}>Score</Label>
                    <Input
                      id={`score-${index}`}
                      type="number"
                      min="0"
                      max={criterion.weight || 10}
                      disabled={isReadOnly}
                      {...register(`scores.${index}.score`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.scores?.[index]?.score && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.scores[index]?.score?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`comments-${index}`}>Comments (Optional)</Label>
                    <Textarea
                      id={`comments-${index}`}
                      rows={2}
                      disabled={isReadOnly}
                      {...register(`scores.${index}.comments`)}
                    />
                  </div>
                </div>

                <input
                  type="hidden"
                  {...register(`scores.${index}.criteria`)}
                  value={criterion.id}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Overall Assessment */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Overall Assessment</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recommendation">Recommendation</Label>
              <Select
                onValueChange={(value) =>
                  setValue("recommendation", value as any)
                }
                defaultValue={watch("recommendation")}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVE">Approve</SelectItem>
                  <SelectItem value="CONDITIONALLY_APPROVE">Conditionally Approve</SelectItem>
                  <SelectItem value="NEEDS_REVISION">Needs Revision</SelectItem>
                  <SelectItem value="REJECT">Reject</SelectItem>
                </SelectContent>
              </Select>
              {errors.recommendation && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.recommendation.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="overall_comments">Overall Comments (Optional)</Label>
              <Textarea
                id="overall_comments"
                rows={4}
                disabled={isReadOnly}
                {...register("overall_comments")}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="flex gap-3 justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            <Button
              type="button"
              onClick={onSubmitAssessment}
              disabled={isSubmittingAssessment || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {(isSubmittingAssessment || isSubmitting) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <Send className="w-4 h-4 mr-2" />
              Submit Assessment
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}