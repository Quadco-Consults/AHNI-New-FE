"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

// Rating scale: 1-5
const RATING_OPTIONS = [
  { value: 1, label: "1 - Needs Improvement", color: "bg-red-500" },
  { value: 2, label: "2 - Below Expectations", color: "bg-orange-500" },
  { value: 3, label: "3 - Meets Expectations", color: "bg-yellow-500" },
  { value: 4, label: "4 - Exceeds Expectations", color: "bg-blue-500" },
  { value: 5, label: "5 - Outstanding", color: "bg-green-500" },
];

// Updated schema to support narrative-level ratings
const EvaluationSchema = z.object({
  goal_ratings: z.array(
    z.object({
      goal_id: z.string(),
      narratives: z.array(
        z.object({
          narrative_id: z.string().optional(),
          description: z.string(),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      ),
      manager_comment: z.string().optional(),
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
  const assessment = assessmentData?.data as any; // Type assertion to fix property access
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

  // Debug data structure (check competency IDs)
  useEffect(() => {
    if (competencies.length > 0) {
      console.log("🔍 Competency Debug:");
      competencies.forEach((comp: any, index: number) => {
        console.log(`  - Competency ${index}:`, {
          id: comp.id,
          name: comp.name,
          category: comp.category,
          weight: comp.weight
        });
      });
    }
  }, [competencies.length]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(EvaluationSchema),
    defaultValues: {
      goal_ratings: [],
      competency_ratings: [],
      overall_comments: "",
    },
  });

  // Track if form has been initialized to prevent excessive resets
  const isFormInitialized = useRef(false);

  // State to trigger completion recalculation
  const [completionTrigger, setCompletionTrigger] = useState(0);

  // Initialize form values when data loads (only once)
  useEffect(() => {
    console.log("🔄 FORM INIT EFFECT RUNNING:");
    console.log("  - Goals length:", goals.length);
    console.log("  - Competencies length:", competencies.length);
    console.log("  - isFormInitialized:", isFormInitialized.current);
    console.log("  - isLoadingAssessment:", isLoadingAssessment);
    console.log("  - isLoadingCompetencies:", isLoadingCompetencies);

    // Only initialize when we have both goals AND competencies loaded, and not already initialized
    if (!isFormInitialized.current &&
        !isLoadingAssessment &&
        !isLoadingCompetencies &&
        goals.length > 0) { // Remove competencies.length > 0 requirement for now

      console.log("🔄 FORM RESET TRIGGERED:");

      const formData = {
        goal_ratings: goals.map((goal: any) => ({
          goal_id: goal.id?.toString() || "",
          narratives: (goal.narratives || []).map((narrative: any) => ({
            narrative_id: narrative.id?.toString() || "",
            description: narrative.description || "",
            rating: 0, // Start with 0, user must select
            comment: "",
          })),
          manager_comment: "",
        })),
        competency_ratings: competencies.map((comp: any, index: number) => ({
          competency_id: comp.id?.toString() || `default-${index}`, // Better fallback ID
          rating: 0, // Changed from 3 to 0 to match validation expectations
          comments: "",
        })),
        overall_comments: "",
      };

      console.log("  - Form data being set:", formData);
      reset(formData);
      isFormInitialized.current = true;
    }
  }, [goals.length, competencies.length, isLoadingAssessment, isLoadingCompetencies, reset]);

  // Calculate overall rating based on weights
  const watchedGoalRatings = watch("goal_ratings");
  const watchedCompetencyRatings = watch("competency_ratings");

  // Debug form value changes (reduced logging)
  useEffect(() => {
    if (watchedGoalRatings && watchedGoalRatings.length > 0) {
      console.log("📝 GOAL RATINGS CHANGED:", watchedGoalRatings);
    }
    if (watchedCompetencyRatings && watchedCompetencyRatings.length > 0) {
      console.log("📝 COMPETENCY RATINGS CHANGED:", watchedCompetencyRatings);
    }
  }, [watchedGoalRatings, watchedCompetencyRatings]);

  const completionPercentage = useMemo(() => {
    // Add a small delay to ensure form state has updated
    const calculateCompletion = () => {
      // Count total narratives across all goals
      const totalNarratives = goals.reduce((sum: number, goal: any) => sum + (goal.narratives?.length || 0), 0);
      const totalCompetencies = competencies.length || 0;
      const totalItems = totalNarratives + totalCompetencies;

      console.log("📊 Completion Calculation (Trigger:", completionTrigger, "):");
      console.log("  - Total narratives:", totalNarratives);
      console.log("  - Total competencies:", totalCompetencies);
      console.log("  - Total items:", totalItems);

      if (totalItems === 0) return 100; // If no items to rate, consider complete

    // Count rated narratives
    console.log("🔍 DETAILED RATING CHECK:");
    console.log("  - watchedGoalRatings structure:", watchedGoalRatings);
    console.log("  - watchedCompetencyRatings structure:", watchedCompetencyRatings);

    const ratedNarratives = watchedGoalRatings?.reduce((sum: number, goalRating: any) => {
      console.log(`  - Processing goal rating:`, goalRating);
      const narrativeRatings = goalRating.narratives?.filter((n: any) => {
        console.log(`    - Narrative: description="${n.description}", rating=${n.rating}`);
        return n.rating > 0;
      }).length || 0;
      console.log(`    - Goal ${goalRating.goal_id} narratives rated:`, narrativeRatings);
      return sum + narrativeRatings;
    }, 0) || 0;

    const ratedComps = watchedCompetencyRatings?.filter((r: any) => {
      console.log(`    - Competency ${r.competency_id}: rating=${r.rating}, isRated=${r.rating > 0}`);
      return r.rating > 0;
    }).length || 0;

    console.log("  - Rated narratives:", ratedNarratives);
    console.log("  - Rated competencies:", ratedComps);

      const percentage = ((ratedNarratives + ratedComps) / totalItems) * 100;
      console.log("  - Completion:", percentage, "%");

      return Math.round(percentage); // Round to avoid floating point issues
    };

    return calculateCompletion();
  }, [goals, competencies, watchedGoalRatings, watchedCompetencyRatings, completionTrigger]);

  const overallRating = useMemo(() => {
    let totalScore = 0;
    let totalWeight = 0;

    // Calculate goal scores using narrative-level ratings
    if (goals.length > 0 && watchedGoalRatings?.length > 0) {
      watchedGoalRatings.forEach((goalRating, goalIdx) => {
        const goal = goals[goalIdx];
        if (!goal || !goalRating.narratives) return;

        goalRating.narratives.forEach((narrativeRating, narrativeIdx) => {
          const narrative = goal.narratives?.[narrativeIdx];
          if (!narrative) return;

          const weight = parseFloat(narrative.weight?.toString() || '0');
          if (narrativeRating.rating > 0) {
            totalScore += narrativeRating.rating * weight;
            totalWeight += weight;
          }
        });
      });
    }

    // Calculate competency scores (if applicable)
    if (competencies.length > 0 && watchedCompetencyRatings?.length > 0) {
      const compScore = watchedCompetencyRatings.reduce((sum: number, rating: any, idx: number) => {
        const comp = competencies[idx];
        const weight = typeof comp?.weight === 'number'
          ? comp.weight
          : parseFloat((comp?.weight as any)?.toString() || '0');
        return sum + (rating.rating * weight);
      }, 0);
      const compTotalWeight = competencies.reduce((sum: number, comp: any) => {
        const weight = typeof comp?.weight === 'number'
          ? comp.weight
          : parseFloat((comp?.weight as any)?.toString() || '0');
        return sum + weight;
      }, 0);

      if (compTotalWeight > 0) {
        totalScore += compScore;
        totalWeight += compTotalWeight;
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

      // Debug: console.log("📤 Submitting evaluation:", submission);

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

          {/* Warning message when 0% complete */}
          {completionPercentage === 0 && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <span className="text-sm font-medium">
                  Please select ratings for all narratives and competencies to enable submission
                </span>
              </div>
            </div>
          )}
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
        <div className="space-y-8">
          {/* Reviews Section - Goals with Narratives Table */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>

            {goals.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No goals assigned for this assessment period.
                </CardContent>
              </Card>
            ) : (
              goals.map((goal: any, goalIndex: number) => {
                const goalTotalWeight = goal.narratives?.reduce(
                  (sum: number, n: any) => sum + parseFloat(n.weight?.toString() || '0'),
                  0
                ) || 0;

                return (
                  <div key={goal.id || goalIndex} className="mb-8">
                    {/* Goal Header with yellow background */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-t-lg px-4 py-3">
                      <h4 className="text-base font-semibold text-yellow-900">
                        {goal.title || "Untitled Goal"} (Weight: {goalTotalWeight.toFixed(1)})
                      </h4>
                    </div>

                    {/* Table for narratives */}
                    <div className="border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                              Evaluation Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                              Competencies
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b w-24">
                              Weight
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b w-32">
                              Rating
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                              Comment
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {goal.narratives && goal.narratives.length > 0 ? (
                            goal.narratives.map((narrative: any, narrativeIndex: number) => {
                              const currentRating = watchedGoalRatings?.[goalIndex]?.narratives?.[narrativeIndex]?.rating || 0;
                              const needsRating = currentRating === 0;

                              return (
                              <tr key={narrativeIndex} className={`hover:bg-gray-50 ${needsRating ? 'bg-yellow-50' : ''}`}>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {goal.title || "Untitled Goal"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {narrative.description || "No description"}
                                  {needsRating && <span className="ml-2 text-orange-500 font-bold">*</span>}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <Badge variant="secondary">
                                    {parseFloat(narrative.weight?.toString() || '0').toFixed(0)}%
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <Controller
                                    name={`goal_ratings.${goalIndex}.narratives.${narrativeIndex}.rating`}
                                    control={control}
                                    render={({ field }) => (
                                      <Select
                                        value={field.value?.toString() || "0"}
                                        onValueChange={(value) => {
                                          console.log(`🎯 Narrative Rating Changed: Goal ${goalIndex}, Narrative ${narrativeIndex}, Value: ${value}`);
                                          field.onChange(parseInt(value));
                                          // Trigger completion recalculation
                                          setTimeout(() => setCompletionTrigger(prev => prev + 1), 100);
                                        }}
                                      >
                                        <SelectTrigger className={`w-full ${needsRating ? 'border-orange-400 border-2' : ''}`}>
                                          <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0" disabled>
                                            Select rating
                                          </SelectItem>
                                          {RATING_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                              {option.value} - {option.label.split(' - ')[1]}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <Controller
                                    name={`goal_ratings.${goalIndex}.narratives.${narrativeIndex}.comment`}
                                    control={control}
                                    render={({ field }) => (
                                      <Textarea
                                        {...field}
                                        placeholder="Add comment..."
                                        rows={2}
                                        className="text-sm"
                                      />
                                    )}
                                  />
                                </td>
                              </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                                No narratives/tasks assigned for this goal.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Manager Comments Section */}
                      <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                        <Label htmlFor={`manager-comment-${goalIndex}`} className="text-sm font-semibold text-gray-700 mb-2 block">
                          Manager Comments
                        </Label>
                        <Controller
                          name={`goal_ratings.${goalIndex}.manager_comment`}
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id={`manager-comment-${goalIndex}`}
                              placeholder="Provide overall feedback for this goal area..."
                              rows={3}
                              className="bg-white"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Competencies Section (if any) */}
          {competencies.length > 0 && (
            <div className="mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-t-lg px-4 py-3">
                <h4 className="text-base font-semibold text-yellow-900">
                  Additional Competencies
                </h4>
              </div>

              <div className="border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                        Evaluation Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                        Competencies
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b w-24">
                        Weight
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b w-32">
                        Rating
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {competencies.map((comp, index) => (
                      <tr key={comp.id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {comp.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {comp.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="secondary">
                            {comp.weight}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Controller
                            name={`competency_ratings.${index}.rating`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value?.toString() || "0"}
                                onValueChange={(value) => {
                                  console.log(`🎯 Competency Rating Changed: Index ${index}, Value: ${value}`);
                                  field.onChange(parseInt(value));
                                  // Trigger completion recalculation
                                  setTimeout(() => setCompletionTrigger(prev => prev + 1), 100);
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0" disabled>
                                    Select rating
                                  </SelectItem>
                                  {RATING_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value.toString()}>
                                      {option.value} - {option.label.split(' - ')[1]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Controller
                            name={`competency_ratings.${index}.comments`}
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Add comment..."
                                rows={2}
                                className="text-sm"
                              />
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Overall Rating Section */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Overall Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Label className="text-sm font-medium">Overall:</Label>
                <Badge variant="default" className="text-lg px-4 py-1">
                  {overallRating > 0 ? overallRating.toFixed(2) : "N/A"}
                </Badge>
                {overallRating > 0 && (
                  <span className="text-sm text-gray-600">
                    {RATING_OPTIONS.find(opt => Math.round(overallRating) === opt.value)?.label}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-end gap-4 mt-8">
          {/* Debug completion percentage */}
          <div className="text-xs text-gray-500">
            Debug: Completion = {completionPercentage}%, Submit disabled = {isSubmitting || completionPercentage < 100}
          </div>

          {completionPercentage < 100 && (
            <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded px-4 py-2">
              ⚠️ Please rate all narratives and competencies to enable submission ({completionPercentage.toFixed(0)}% complete)
            </div>
          )}
          <div className="flex gap-4">
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
              className="bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={completionPercentage < 100 ? `Complete all ratings to submit (${completionPercentage.toFixed(0)}% done)` : "Submit assessment"}
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ImprovedEvaluatorForm;
