"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { useRouter, useParams } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";
import { useSubmitEvaluation, useGetPerformanceAssesment } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { toast } from "sonner";
import { Label } from "components/ui/label";
import { EvaluationSubmission } from "@/features/hr/types/performance-assesment";
import { useQueryClient } from "@tanstack/react-query";

// Rating scale: 1-5
const RATING_OPTIONS = [
  { value: 1, label: "1 - Needs Improvement" },
  { value: 2, label: "2 - Below Expectations" },
  { value: 3, label: "3 - Meets Expectations" },
  { value: 4, label: "4 - Exceeds Expectations" },
  { value: 5, label: "5 - Outstanding" },
];

const EvaluationSchema = z.object({
  goal_ratings: z.array(
    z.object({
      goal_id: z.string(),
      rating: z.number().min(1).max(5),
      comments: z.string().optional(),
    })
  ),
});

type EvaluationFormData = z.infer<typeof EvaluationSchema>;

interface EvaluatorFormProps {
  assessmentId: string;
  evaluatorId: string;
}

const EvaluatorForm: React.FC<EvaluatorFormProps> = ({ assessmentId, evaluatorId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch the assessment to get goals
  const { data: assessmentData, isLoading: isLoadingAssessment } = useGetPerformanceAssesment(
    assessmentId,
    !!assessmentId
  );

  const { submitEvaluation, isLoading: isSubmitting } = useSubmitEvaluation(assessmentId);

  const assessment = (assessmentData?.data?.data || assessmentData?.data) as any;
  // Backend returns employee_goals, not goals
  const goals = assessment?.employee_goals || assessment?.goals || [];

  console.log("Evaluation Form - Assessment:", assessment);
  console.log("Evaluation Form - Goals:", goals);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(EvaluationSchema),
    defaultValues: {
      goal_ratings: goals.map((goal) => ({
        goal_id: goal.id?.toString() || "",
        rating: 3,
        comments: "",
      })),
    },
  });

  const onSubmit = async (data: EvaluationFormData) => {
    try {
      // Submit evaluation with evaluator ID and ratings
      const submission = {
        evaluator_id: evaluatorId,
        goal_ratings: data.goal_ratings,
      };

      console.log("Submitting evaluation:", submission);

      await submitEvaluation(submission);

      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ["performance-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["performance-assessment", assessmentId] });

      toast.success("Evaluation submitted successfully");
      router.push(HrRoutes.PERFORMANCE_MANAGEMENT);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit evaluation";
      toast.error(errorMessage);
      console.error("Submission error:", error);
      console.error("Error response:", error?.response?.data);
    }
  };

  if (isLoadingAssessment) {
    return <div className="flex justify-center py-10">Loading assessment...</div>;
  }

  if (!assessment || goals.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">No goals found for this assessment.</p>
      </div>
    );
  }

  return (
    <div className="form-container px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Performance Evaluation</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Employee: </span>
            {typeof assessment.employee === 'object'
              ? `${assessment.employee.legal_firstname} ${assessment.employee.legal_lastname}`
              : assessment.employee}
          </div>
          <div>
            <span className="font-semibold">Cycle: </span>
            {assessment.cycle_name}
          </div>
          <div>
            <span className="font-semibold">Period: </span>
            {assessment.start_date} to {assessment.end_date}
          </div>
          <div>
            <span className="font-semibold">Description: </span>
            {assessment.description}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-yellow-darker">Rate Employee Goals</h3>

          {goals.map((goal, index) => (
            <Card key={goal.id || index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base">{goal.title || "Untitled Goal"}</CardTitle>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    )}

                    {/* Narratives/Tasks */}
                    {goal.narratives && goal.narratives.length > 0 && (
                      <div className="mt-3 pl-2 border-l-2 border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">Tasks:</p>
                        <ul className="space-y-1">
                          {goal.narratives.map((narrative, idx) => (
                            <li key={idx} className="text-xs flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              <span className="flex-1">{narrative.description}</span>
                              <Badge variant="secondary" className="text-xs h-4">
                                {parseFloat(narrative.weight?.toString() || '0').toFixed(0)}%
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">
                    Weight: {goal.total_weight ? parseFloat(goal.total_weight.toString()).toFixed(0) :
                             goal.narratives?.reduce((sum, n) => sum + parseFloat(n.weight?.toString() || '0'), 0).toFixed(0) || 0}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`rating-${index}`} className="font-semibold">
                    Rating (1-5)
                  </Label>
                  <Controller
                    name={`goal_ratings.${index}.rating`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2 mt-2">
                        {RATING_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={`flex-1 px-4 py-2 border rounded-md transition-colors ${
                              field.value === option.value
                                ? "bg-primary text-white border-primary"
                                : "bg-white hover:bg-gray-50 border-gray-300"
                            }`}
                            title={option.label}
                          >
                            {option.value}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {RATING_OPTIONS.find(
                      (opt) => opt.value === control._formValues.goal_ratings?.[index]?.rating
                    )?.label}
                  </p>
                  {errors.goal_ratings?.[index]?.rating && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.goal_ratings[index]?.rating?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`comments-${index}`}>Comments</Label>
                  <Controller
                    name={`goal_ratings.${index}.comments`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id={`comments-${index}`}
                        placeholder="Provide feedback on this goal..."
                        rows={3}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(HrRoutes.PERFORMANCE_MANAGEMENT)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Evaluation"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EvaluatorForm;
