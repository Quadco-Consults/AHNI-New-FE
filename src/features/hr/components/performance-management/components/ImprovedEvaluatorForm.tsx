"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { useRouter } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";
import {
  useUpdatePerformanceAssesment,
  useGetPerformanceAssesment
} from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { useGetCompetencies } from "@/features/hr/controllers/competenciesController";
import { toast } from "sonner";
import { Label } from "components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useMemo, useEffect } from "react";

// Rating scale: 1-5
const RATING_OPTIONS = [
  { value: 1, label: "1 - Needs Improvement", color: "bg-red-500" },
  { value: 2, label: "2 - Below Expectations", color: "bg-orange-500" },
  { value: 3, label: "3 - Meets Expectations", color: "bg-yellow-500" },
  { value: 4, label: "4 - Exceeds Expectations", color: "bg-blue-500" },
  { value: 5, label: "5 - Outstanding", color: "bg-green-500" },
];

const EvaluationSchema = z.object({
  goal_ratings: z.array(
    z.object({
      goal_id: z.string(),
      rating: z.number().min(1).max(5),
      comments: z.string().optional(),
    })
  ),
  competency_ratings: z.array(
    z.object({
      competency_id: z.string(),
      rating: z.number().min(1).max(5),
      comments: z.string().optional(),
    })
  ),
  overall_comments: z.string().optional(),
});

type EvaluationFormData = z.infer<typeof EvaluationSchema>;

interface ImprovedEvaluatorFormProps {
  assessmentId: string;
  evaluatorId: string;
}

const ImprovedEvaluatorForm: React.FC<ImprovedEvaluatorFormProps> = ({
  assessmentId,
  evaluatorId
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch the assessment to get goals and employee details
  const { data: assessmentData, isLoading: isLoadingAssessment } = useGetPerformanceAssesment(
    assessmentId,
    !!assessmentId
  );

  // Fetch competencies based on employee's job title
  const assessment = assessmentData?.data;
  const employee = typeof assessment?.employee === 'object'
    ? assessment.employee
    : null;

  const jobTitle = employee?.job_title || "";

  const { data: competenciesData, isLoading: isLoadingCompetencies } = useGetCompetencies({
    enabled: !!assessmentId,
    active: true,
  });

  const { updatePerformanceAssesment, isLoading: isSubmitting } = useUpdatePerformanceAssesment(assessmentId);

  // Backend returns employee_goals, not goals
  const goals = assessment?.employee_goals || assessment?.goals || [];
  const competencies = competenciesData?.data?.results || [];

  console.log("🎯 Improved Evaluation Form:");
  console.log("  Assessment:", assessment);
  console.log("  Goals:", goals);
  console.log("  Competencies:", competencies);
  console.log("  Employee Job Title:", jobTitle);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(EvaluationSchema),
    defaultValues: {
      goal_ratings: [],
      competency_ratings: [],
      overall_comments: "",
    },
  });

  // Initialize form values when data loads
  useEffect(() => {
    if (goals.length > 0 || competencies.length > 0) {
      reset({
        goal_ratings: goals.map((goal) => ({
          goal_id: goal.id?.toString() || "",
          rating: 3,
          comments: "",
        })),
        competency_ratings: competencies.map((comp) => ({
          competency_id: comp.id?.toString() || "",
          rating: 3,
          comments: "",
        })),
        overall_comments: "",
      });
    }
  }, [goals, competencies, reset]);

  // Calculate overall rating based on weights
  const watchedGoalRatings = watch("goal_ratings");
  const watchedCompetencyRatings = watch("competency_ratings");

  const completionPercentage = useMemo(() => {
    const totalItems = (goals.length || 0) + (competencies.length || 0);
    if (totalItems === 0) return 0;

    const ratedGoals = watchedGoalRatings?.filter(r => r.rating > 0).length || 0;
    const ratedComps = watchedCompetencyRatings?.filter(r => r.rating > 0).length || 0;

    return ((ratedGoals + ratedComps) / totalItems) * 100;
  }, [goals, competencies, watchedGoalRatings, watchedCompetencyRatings]);

  const overallRating = useMemo(() => {
    let totalScore = 0;
    let totalWeight = 0;

    // Calculate goal scores (50% weight)
    if (goals.length > 0 && watchedGoalRatings?.length > 0) {
      const goalScore = watchedGoalRatings.reduce((sum, rating, idx) => {
        const goal = goals[idx];
        const weight = goal?.total_weight
          ? parseFloat(goal.total_weight.toString())
          : goal?.narratives?.reduce((s: number, n: any) => s + parseFloat(n.weight?.toString() || '0'), 0) || 0;
        return sum + (rating.rating * weight);
      }, 0);
      const goalTotalWeight = goals.reduce((sum, goal) => {
        const weight = goal?.total_weight
          ? parseFloat(goal.total_weight.toString())
          : goal?.narratives?.reduce((s: number, n: any) => s + parseFloat(n.weight?.toString() || '0'), 0) || 0;
        return sum + weight;
      }, 0);

      if (goalTotalWeight > 0) {
        totalScore += (goalScore / goalTotalWeight) * 50;
        totalWeight += 50;
      }
    }

    // Calculate competency scores (50% weight)
    if (competencies.length > 0 && watchedCompetencyRatings?.length > 0) {
      const compScore = watchedCompetencyRatings.reduce((sum, rating, idx) => {
        const comp = competencies[idx];
        const weight = typeof comp?.weight === 'number'
          ? comp.weight
          : parseFloat(comp?.weight?.toString() || '0');
        return sum + (rating.rating * weight);
      }, 0);
      const compTotalWeight = competencies.reduce((sum, comp) => {
        const weight = typeof comp?.weight === 'number'
          ? comp.weight
          : parseFloat(comp?.weight?.toString() || '0');
        return sum + weight;
      }, 0);

      if (compTotalWeight > 0) {
        totalScore += (compScore / compTotalWeight) * 50;
        totalWeight += 50;
      }
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }, [goals, competencies, watchedGoalRatings, watchedCompetencyRatings]);

  const onSubmit = async (data: EvaluationFormData) => {
    try {
      // Get employee ID from assessment
      const employeeId = typeof assessment?.employee === 'object'
        ? assessment.employee.id
        : assessment?.employee;

      // Prepare submission with both goals and competencies
      const submission: any = {
        ...assessment,
        assessment_id: assessmentId,
        evaluator_id: evaluatorId,
        employee: employeeId,
        description: assessment?.description,
        cycle_name: assessment?.cycle_name,
        status: "completed", // Mark as completed after submission
        start_date: assessment?.start_date,
        end_date: assessment?.end_date,
        goal_ratings: data.goal_ratings,
        competency_ratings: data.competency_ratings,
        overall_comments: data.overall_comments,
        final_rating: overallRating, // Include calculated rating
      };

      console.log("📤 Submitting evaluation:", submission);

      await updatePerformanceAssesment(submission);

      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ["performance-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["performance-assessment", assessmentId] });

      toast.success("Evaluation submitted successfully");
      router.push(HrRoutes.PERFORMANCE_MANAGEMENT);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit evaluation";
      toast.error(errorMessage);
      console.error("❌ Submission error:", error);
      console.error("Error response:", error?.response?.data);
    }
  };

  if (isLoadingAssessment || isLoadingCompetencies) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading assessment...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Assessment not found.</p>
      </div>
    );
  }

  const completionPercentage = useMemo(() => {
    const totalItems = (goals.length || 0) + (competencies.length || 0);
    if (totalItems === 0) return 0;

    const ratedGoals = watchedGoalRatings?.filter(r => r.rating > 0).length || 0;
    const ratedComps = watchedCompetencyRatings?.filter(r => r.rating > 0).length || 0;

    return ((ratedGoals + ratedComps) / totalItems) * 100;
  }, [goals, competencies, watchedGoalRatings, watchedCompetencyRatings]);

  return (
    <div className="form-container px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Performance Evaluation</h2>

        {/* Assessment Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Employee: </span>
                <span className="text-gray-900">
                  {assessment.employee_name ||
                   (typeof assessment.employee === 'object'
                    ? `${assessment.employee.legal_firstname || assessment.employee.first_name} ${assessment.employee.legal_lastname || assessment.employee.last_name}`
                    : assessment.employee)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Job Title: </span>
                <span className="text-gray-900">{assessment.employee_job_title || jobTitle || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Cycle: </span>
                <span className="text-gray-900">{assessment.cycle_name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Period: </span>
                <span className="text-gray-900">
                  {assessment.start_date ? new Date(assessment.start_date).toLocaleDateString() : "N/A"} to{" "}
                  {assessment.end_date ? new Date(assessment.end_date).toLocaleDateString() : "N/A"}
                </span>
              </div>
              {assessment.description && (
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Description: </span>
                  <span className="text-gray-900">{assessment.description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium">Evaluation Progress</Label>
            <span className="text-sm text-gray-600">{completionPercentage.toFixed(0)}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Overall Rating Preview */}
        {overallRating > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-yellow-900">Calculated Overall Rating:</span>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-lg px-4 py-1">
                  {overallRating.toFixed(2)} / 5.0
                </Badge>
                <span className="text-sm text-yellow-700">
                  {RATING_OPTIONS.find(opt => Math.round(overallRating) === opt.value)?.label.split(' - ')[1]}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">
              Goals ({goals.length})
            </TabsTrigger>
            <TabsTrigger value="competencies">
              Competencies ({competencies.length})
            </TabsTrigger>
            <TabsTrigger value="summary">
              Summary
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Rate Employee Goals</h3>
              <p className="text-sm text-gray-600 mt-1">
                Evaluate each goal based on achievement and quality of work
              </p>
            </div>

            {goals.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No goals assigned for this assessment period.
                </CardContent>
              </Card>
            ) : (
              goals.map((goal, index) => (
                <Card key={goal.id || index} className="border-l-4 border-l-blue-500">
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
                        Weight: {goal.total_weight
                          ? parseFloat(goal.total_weight.toString()).toFixed(0)
                          : goal.narratives?.reduce((sum, n) => sum + parseFloat(n.weight?.toString() || '0'), 0).toFixed(0) || 0}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`goal-rating-${index}`} className="font-semibold">
                        Rating (1-5) *
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
                                className={`flex-1 px-4 py-2 border rounded-md transition-all ${
                                  field.value === option.value
                                    ? `${option.color} text-white border-transparent shadow-md`
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
                          (opt) => opt.value === watchedGoalRatings?.[index]?.rating
                        )?.label}
                      </p>
                      {errors.goal_ratings?.[index]?.rating && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.goal_ratings[index]?.rating?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`goal-comments-${index}`}>Comments</Label>
                      <Controller
                        name={`goal_ratings.${index}.comments`}
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            id={`goal-comments-${index}`}
                            placeholder="Provide specific feedback on goal achievement, challenges, and recommendations..."
                            rows={3}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Rate Competencies</h3>
              <p className="text-sm text-gray-600 mt-1">
                Evaluate behavioral and technical competencies demonstrated during this period
              </p>
            </div>

            {competencies.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No competencies configured. Using default evaluation criteria.
                </CardContent>
              </Card>
            ) : (
              competencies.map((comp, index) => (
                <Card key={comp.id || index} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-base">{comp.name || comp.competency}</CardTitle>
                        {comp.description && (
                          <p className="text-sm text-gray-600 mt-1">{comp.description}</p>
                        )}
                        <Badge variant="secondary" className="mt-2">
                          {comp.category || comp.evaluation_category}
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        Weight: {typeof comp.weight === 'number'
                          ? comp.weight
                          : parseFloat(comp.weight?.toString() || '0')}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`comp-rating-${index}`} className="font-semibold">
                        Rating (1-5) *
                      </Label>
                      <Controller
                        name={`competency_ratings.${index}.rating`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex gap-2 mt-2">
                            {RATING_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => field.onChange(option.value)}
                                className={`flex-1 px-4 py-2 border rounded-md transition-all ${
                                  field.value === option.value
                                    ? `${option.color} text-white border-transparent shadow-md`
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
                          (opt) => opt.value === watchedCompetencyRatings?.[index]?.rating
                        )?.label}
                      </p>
                      {errors.competency_ratings?.[index]?.rating && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.competency_ratings[index]?.rating?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`comp-comments-${index}`}>Comments</Label>
                      <Controller
                        name={`competency_ratings.${index}.comments`}
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            id={`comp-comments-${index}`}
                            placeholder="Provide examples and specific observations related to this competency..."
                            rows={3}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Evaluation Summary</h3>
              <p className="text-sm text-gray-600 mt-1">
                Review your ratings and provide overall feedback
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Goals Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {goals.length > 0 && watchedGoalRatings?.length > 0
                      ? (watchedGoalRatings.reduce((sum, r) => sum + r.rating, 0) / watchedGoalRatings.length).toFixed(2)
                      : "N/A"}
                  </div>
                  <p className="text-sm text-gray-600">Average across {goals.length} goals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Competencies Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {competencies.length > 0 && watchedCompetencyRatings?.length > 0
                      ? (watchedCompetencyRatings.reduce((sum, r) => sum + r.rating, 0) / watchedCompetencyRatings.length).toFixed(2)
                      : "N/A"}
                  </div>
                  <p className="text-sm text-gray-600">Average across {competencies.length} competencies</p>
                </CardContent>
              </Card>
            </div>

            {/* Overall Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overall Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="overall_comments"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Provide overall feedback, strengths, areas for improvement, and recommendations for development..."
                      rows={6}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
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
            disabled={isSubmitting || completionPercentage < 100}
          >
            {isSubmitting ? "Submitting..." : "Submit Evaluation"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ImprovedEvaluatorForm;
