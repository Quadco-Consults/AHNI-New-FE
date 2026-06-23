"use client";

import { Separator } from "@/components/ui/separator";
import EvaluatorForm from "../components/EvaluatorForm";
import ImprovedEvaluatorForm from "../components/ImprovedEvaluatorForm";
import FormButton from "@/components/FormButton";
import { FileIcon, CheckCircle, CheckCircle2, FileDown, ClipboardList, Calendar, CalendarCheck, User, Target, Users, Send, Star, Mail, Briefcase, UserCheck, ClipboardCheck, Eye, File } from 'lucide-react';
import GoBack from "@/components/GoBack";
import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "next/navigation";
import { useGetPerformanceAssesment, useSubmitPerformanceAssesment } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { useGetEmployeeGoals } from "@/features/hr/controllers/goalsController";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { areAllEvaluationsComplete } from "@/features/hr/utils/performanceCalculations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { generatePerformanceAssessmentPDF, generateIndividualEvaluatorPDF } from "@/features/hr/utils/performanceAssessmentPDF";

const PerformanceDetails = () => {
  const params = useParams();
  const assessmentId = params?.id as string;
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Get current user ID
  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id || "";
      setCurrentUserId(userId);
      // Debug: console.log("Current User ID for evaluation:", userId);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // Fetch assessment details
  const { data: assessmentData, isLoading } = useGetPerformanceAssesment(
    assessmentId,
    !!assessmentId
  );

  // Debug the actual API response structure
  useEffect(() => {
    if (assessmentData) {
      console.log("🔍 ASSESSMENT API RESPONSE:");
      console.log("  - Raw assessmentData:", assessmentData);
      console.log("  - assessmentData.data:", assessmentData.data);
      console.log("  - Final rating from API:", (assessmentData.data as any)?.final_rating);
      console.log("  - Evaluators from API:", (assessmentData.data as any)?.evaluators);

      // Log individual evaluator data
      if ((assessmentData.data as any)?.evaluators) {
        (assessmentData.data as any).evaluators.forEach((ev: any, index: number) => {
          console.log(`  - Evaluator ${index}:`, {
            id: ev.id,
            status: ev.status,
            final_rating: ev.final_rating,
            goal_ratings: ev.goal_ratings,
            competency_ratings: ev.competency_ratings
          });
        });
      }
    }
  }, [assessmentData]);

  const assessment = assessmentData?.data?.data || assessmentData?.data;

  // Calculate final rating from completed evaluations if not provided by API
  const calculateFinalRating = (evaluators: any[]) => {
    console.log("🧮 Calculating final rating from evaluators:", evaluators);

    const completedEvaluators = evaluators.filter(ev => {
      const hasCompleted = ev.status === 'completed';
      const hasFinalRating = ev.final_rating !== null && ev.final_rating !== undefined && ev.final_rating > 0;

      console.log(`  - Evaluator ${ev.id}:`, {
        status: ev.status,
        final_rating: ev.final_rating,
        hasCompleted,
        hasFinalRating
      });

      return hasCompleted && hasFinalRating;
    });

    console.log("  - Completed evaluators with ratings:", completedEvaluators.length);

    if (completedEvaluators.length === 0) {
      console.log("  - No completed evaluators found, returning null");
      return null;
    }

    const totalRating = completedEvaluators.reduce((sum, ev) => {
      const rating = parseFloat(ev.final_rating.toString());
      console.log(`  - Adding rating: ${rating}`);
      return sum + rating;
    }, 0);

    const averageRating = totalRating / completedEvaluators.length;
    console.log(`  - Final calculated rating: ${averageRating} (${totalRating} / ${completedEvaluators.length})`);

    return averageRating;
  };

  // Get employee ID from assessment (with type casting)
  const employeeId = typeof (assessment as any)?.employee === 'object'
    ? (assessment as any).employee.id
    : (assessment as any)?.employee;

  // Fetch employee goals separately (workaround until backend includes them)
  const { data: employeeGoalsData } = useGetEmployeeGoals(
    employeeId || "",
    !!employeeId
  );

  // Calculate final rating if not provided by API
  const calculatedFinalRating = React.useMemo(() => {
    const evaluators = (assessment as any)?.evaluators;
    if (!evaluators || evaluators.length === 0) return null;

    return calculateFinalRating(evaluators);
  }, [(assessment as any)?.evaluators]);

  // Merge goals into assessment - backend returns employee_goals
  const assessmentWithGoals: any = React.useMemo(() => ({
    ...(assessment as any),
    goals: (assessment as any)?.employee_goals || employeeGoalsData?.data?.results || employeeGoalsData?.data || (assessment as any)?.goals || [],
    final_rating: (assessment as any)?.final_rating || calculatedFinalRating
  }), [assessment, employeeGoalsData, calculatedFinalRating]);

  // Debug: Log the full assessment data
  // console.log("📊 Full Assessment Data:", assessmentWithGoals);
  // console.log("📊 Employee Data:", assessmentWithGoals?.employee);
  // console.log("📊 Evaluators Data:", assessmentWithGoals?.evaluators);

  // Debug logging removed to prevent excessive console spam
  // Uncomment for debugging:
  // console.log("Assessment data:", assessment);
  // console.log("Employee data:", assessment?.employee);
  // console.log("Employee goals from backend:", assessment?.employee_goals);
  // console.log("Merged goals:", assessmentWithGoals?.goals);

  // Submit assessment hook
  const { submitPerformanceAssesment, isLoading: isSubmitting } = useSubmitPerformanceAssesment(assessmentId);

  // Find if current user is an evaluator
  const currentUserEvaluator = assessmentWithGoals?.evaluators?.find((ev: any) => {
    const evaluatorId = typeof ev.evaluator === 'object' ? ev.evaluator.id : ev.evaluator;
    return evaluatorId === currentUserId;
  });

  const canEvaluate = !!currentUserEvaluator && currentUserEvaluator.status !== 'completed';

  // Check if current user is the creator
  const isCreator = assessmentWithGoals?.created_by === currentUserId;

  // Check if all evaluations are complete
  const allEvaluationsComplete = areAllEvaluationsComplete(assessmentWithGoals?.evaluators || []);

  // Debug logging for submission logic removed to prevent console spam
  // Uncomment for debugging:
  // console.log("=== SUBMISSION LOGIC DEBUG ===");
  // console.log("Current User ID:", currentUserId);
  // console.log("Current User ID Type:", typeof currentUserId);
  // console.log("Assessment Created By:", assessmentWithGoals?.created_by);
  // console.log("Assessment Created By Type:", typeof assessmentWithGoals?.created_by);
  // console.log("Is Creator:", isCreator);
  // console.log("Evaluators:", assessmentWithGoals?.evaluators);
  // console.log("All Evaluations Complete:", allEvaluationsComplete);
  // console.log("Assessment Status:", assessmentWithGoals?.status);
  // console.log("Assessment full object:", assessmentWithGoals);

  // Can submit for evaluation if: creator AND status is draft
  // Need to handle both string and object comparisons for created_by
  const createdById = typeof assessmentWithGoals?.created_by === 'object'
    ? assessmentWithGoals?.created_by?.id
    : assessmentWithGoals?.created_by;

  const isCreatorMatch = createdById === currentUserId ||
                         assessmentWithGoals?.created_by === currentUserId ||
                         !assessmentWithGoals?.created_by; // If no creator, allow any user

  // TEMPORARY: Allow any logged-in user to submit (for testing/HR admin access)
  // In production, you might want to check for HR role/permissions
  const canManageAssessment = currentUserId && currentUserId.length > 0;

  const canSubmitForEvaluation = canManageAssessment && assessmentWithGoals?.status === 'draft';

  // Can complete assessment if: has permission AND status is in_progress/pending AND all evaluations complete
  const canCompleteAssessment = canManageAssessment &&
                                allEvaluationsComplete &&
                                (assessmentWithGoals?.status === 'in_progress' ||
                                 assessmentWithGoals?.status === 'pending_evaluators');

  // Debug: console.log("Created By ID:", createdById);
  // Debug: console.log("Is Creator Match:", isCreatorMatch);
  // Debug: console.log("Can Manage Assessment:", canManageAssessment);
  // Debug: console.log("Can Submit For Evaluation:", canSubmitForEvaluation);
  // Debug: console.log("Can Complete Assessment:", canCompleteAssessment);

  // Format evaluation details for viewing
  const formatEvaluationDetails = (evaluator: any, assessment: any) => {
    const evaluatorName = evaluator.evaluator_name ||
      (typeof evaluator.evaluator === 'object'
        ? `${evaluator.evaluator.first_name} ${evaluator.evaluator.last_name}`
        : 'Unknown Evaluator');

    let details = `=== EVALUATION DETAILS ===\n\n`;
    details += `Evaluator: ${evaluatorName}\n`;
    details += `Type: ${evaluator.evaluator_type === 'self' ? 'Self Evaluation' : 'Manager Evaluation'}\n`;
    details += `Status: ${evaluator.status.toUpperCase()}\n`;
    details += `Final Rating: ${evaluator.final_rating ? parseFloat(evaluator.final_rating.toString()).toFixed(2) + '/5' : 'N/A'}\n\n`;

    // Goal ratings
    if (evaluator.goal_ratings && evaluator.goal_ratings.length > 0) {
      details += `=== GOAL RATINGS ===\n\n`;
      evaluator.goal_ratings.forEach((goalRating: any, index: number) => {
        const goal = assessment.goals?.find((g: any) => g.id === goalRating.goal_id);
        const goalTitle = goal?.title || `Goal ${index + 1}`;

        details += `${index + 1}. ${goalTitle}\n`;

        if (goalRating.narratives && goalRating.narratives.length > 0) {
          goalRating.narratives.forEach((narrative: any, narIndex: number) => {
            details += `   ${String.fromCharCode(97 + narIndex)}. ${narrative.description}\n`;
            details += `      Rating: ${narrative.rating || 'N/A'}/5\n`;
            if (narrative.comment) {
              details += `      Comment: ${narrative.comment}\n`;
            }
          });
        }

        if (goalRating.manager_comment) {
          details += `   Manager Comment: ${goalRating.manager_comment}\n`;
        }
        details += `\n`;
      });
    }

    // Competency ratings
    if (evaluator.competency_ratings && evaluator.competency_ratings.length > 0) {
      details += `=== COMPETENCY RATINGS ===\n\n`;
      evaluator.competency_ratings.forEach((compRating: any, index: number) => {
        details += `${index + 1}. Competency ID: ${compRating.competency_id}\n`;
        details += `   Rating: ${compRating.rating || 'N/A'}/5\n`;
        if (compRating.comments) {
          details += `   Comments: ${compRating.comments}\n`;
        }
        details += `\n`;
      });
    }

    // Overall comments
    if (evaluator.overall_comments) {
      details += `=== OVERALL COMMENTS ===\n\n`;
      details += `${evaluator.overall_comments}\n\n`;
    }

    return details;
  };

  const handleStartEvaluation = () => {
    setIsEvaluating(true);
  };

  const handleSubmitForEvaluation = async () => {
    if (!canSubmitForEvaluation) {
      toast.error("You must be the creator to submit this assessment for evaluation.");
      return;
    }

    try {
      // Change status from draft to in_progress (or pending_evaluators)
      await submitPerformanceAssesment('in_progress');

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ["performance-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["performance-assessment", assessmentId] });

      toast.success("Assessment submitted for evaluation! Evaluators can now start their assessments.");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit assessment";
      toast.error(errorMessage);
    }
  };

  const handleCompleteAssessment = async () => {
    if (!canCompleteAssessment) {
      toast.error("All evaluators must complete their evaluations before you can finalize this assessment.");
      return;
    }

    try {
      await submitPerformanceAssesment('completed');

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ["performance-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["performance-assessment", assessmentId] });

      toast.success("Assessment completed successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to complete assessment";
      toast.error(errorMessage);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      console.log("📄 PDF Generation Debug:");
      console.log("Assessment:", assessmentWithGoals);
      console.log("Evaluators:", assessmentWithGoals?.evaluators);
      console.log("Employee Goals:", assessmentWithGoals?.employee_goals);

      // Check if there are any completed evaluations
      const completedEvaluators = (assessmentWithGoals?.evaluators || []).filter(
        (ev: any) => ev.status === 'completed'
      );

      if (completedEvaluators.length === 0) {
        toast.warning("No completed evaluations found. The PDF will only contain basic assessment information and goal structure. Complete some evaluations to see detailed scores in the PDF.");
      }

      // Collect evaluator ratings data
      const evaluatorRatings = (assessmentWithGoals?.evaluators || []).map((evaluator: any) => {
        console.log("Processing evaluator:", evaluator);
        console.log("  - goal_ratings:", evaluator.goal_ratings);
        console.log("  - competency_ratings:", evaluator.competency_ratings);
        console.log("  - final_rating:", evaluator.final_rating);

        return {
          evaluator_id: evaluator.id,
          goal_ratings: evaluator.goal_ratings || [],
          competency_ratings: evaluator.competency_ratings || [],
          overall_rating: evaluator.final_rating || 0,
        };
      });

      console.log("Formatted evaluator ratings:", evaluatorRatings);

      // Generate PDF
      const filename = await generatePerformanceAssessmentPDF({
        assessment: assessmentWithGoals,
        evaluatorRatings,
      });

      if (completedEvaluators.length > 0) {
        toast.success(`PDF generated successfully: ${filename}`);
      } else {
        toast.success(`PDF generated: ${filename} (Note: Contains basic info only - no evaluation scores available yet)`);
      }
    } catch (error: any) {
      console.error("PDF generation error:", error);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to generate PDF: ${errorMessage}`);

      // Additional debugging info
      console.error("PDF Error Context:", {
        assessmentData: assessmentWithGoals,
        evaluatorsCount: assessmentWithGoals?.evaluators?.length,
        goalsCount: assessmentWithGoals?.goals?.length,
        hasEvaluatorRatings: (assessmentWithGoals?.evaluators || []).filter((ev: any) => ev.status === 'completed').length > 0
      });
    }
  };

  const handleGenerateIndividualPDF = async (evaluator: any) => {
    try {
      console.log("📄 Starting individual PDF generation...");
      console.log("  - Evaluator:", evaluator.evaluator_name);
      console.log("  - Evaluator ID:", evaluator.id);
      console.log("  - Assessment ID:", assessmentWithGoals?.id);
      console.log("  - Goals available:", assessmentWithGoals?.goals?.length || 0);
      console.log("  - Evaluator data:", evaluator);

      const filename = await generateIndividualEvaluatorPDF({
        assessment: assessmentWithGoals,
        evaluator: evaluator,
        goals: assessmentWithGoals.goals || []
      });

      console.log("✅ Individual PDF generated successfully:", filename);
      toast.success(`Individual PDF generated: ${filename}`);
    } catch (error: any) {
      console.error("❌ Individual PDF generation error:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        evaluator: evaluator?.evaluator_name,
        assessmentId: assessmentWithGoals?.id
      });
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to generate individual PDF: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading assessment...</div>;
  }

  if (!assessmentWithGoals) {
    return <div className="text-center py-10 text-red-600">Assessment not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className='flex justify-between items-start w-full mb-6'>
        <div className='flex gap-3 items-center'>
          <GoBack />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Performance Assessment
            </h1>
            <p className='text-sm text-gray-600 mt-1'>
              Review and manage employee performance evaluation
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          {/* Generate PDF button - available when assessment has data */}
          {!isEvaluating && assessmentWithGoals && (
            <FormButton
              onClick={handleGeneratePDF}
              className="bg-purple-600 hover:bg-purple-700 shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              <p>Generate PDF</p>
            </FormButton>
          )}
          {canEvaluate && !isEvaluating && (
            <FormButton onClick={handleStartEvaluation} className="shadow-sm">
              <FileIcon className="w-4 h-4" />
              <p>Start Evaluation</p>
            </FormButton>
          )}
          {canSubmitForEvaluation && !isEvaluating && (
            <FormButton
              onClick={handleSubmitForEvaluation}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <Send size={16} />
              <p>{isSubmitting ? "Submitting..." : "Submit for Evaluation"}</p>
            </FormButton>
          )}
          {canCompleteAssessment && !isEvaluating && (
            <FormButton
              onClick={handleCompleteAssessment}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <p>{isSubmitting ? "Completing..." : "Complete Assessment"}</p>
            </FormButton>
          )}
        </div>
      </div>
      {/* Show evaluation form if user is evaluating */}
      {isEvaluating && currentUserEvaluator ? (
        <div className='mt-6'>
          <ImprovedEvaluatorForm
            assessmentId={assessmentId}
            evaluatorId={currentUserEvaluator.id}
          />
        </div>
      ) : (
        <>
          {/* Info message for assessment manager */}
          {canManageAssessment && (
            <>
              {assessmentWithGoals?.status === 'draft' && (
                <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <p className='text-sm text-yellow-800'>
                    <strong>Draft Mode:</strong> This assessment is still in draft.
                    Click "Submit for Evaluation" to send it to the evaluators and change the status to in-progress.
                  </p>
                </div>
              )}

              {(assessmentWithGoals?.status === 'in_progress' || assessmentWithGoals?.status === 'pending_evaluators') && !allEvaluationsComplete && (
                <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <p className='text-sm text-blue-800'>
                    <strong>Evaluation in Progress:</strong> {assessmentWithGoals?.evaluators?.filter((ev: any) => ev.status === 'completed').length || 0} of {assessmentWithGoals?.evaluators?.length || 0} evaluators have completed their evaluations.
                    Once all evaluations are complete, you can finalize the assessment.
                  </p>
                </div>
              )}

              {allEvaluationsComplete && (assessmentWithGoals?.status === 'in_progress' || assessmentWithGoals?.status === 'pending_evaluators') && (
                <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                  <p className='text-sm text-green-800'>
                    <strong>Ready to Complete!</strong> All evaluators have finished their evaluations.
                    Click "Complete Assessment" to finalize and mark as completed.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Appraisal Information Card */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardList size={16} />
                Appraisal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Description</label>
                  <p className='text-sm text-gray-900'>{assessmentWithGoals.description || 'N/A'}</p>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Status</label>
                  <div>
                    <Badge
                      variant="outline"
                      className={`
                        ${assessmentWithGoals.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                        ${assessmentWithGoals.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${assessmentWithGoals.status === 'draft' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
                      `}
                    >
                      {assessmentWithGoals.status?.replace('_', ' ').toUpperCase() || 'DRAFT'}
                    </Badge>
                  </div>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Appraisal Type</label>
                  <p className='text-sm text-gray-900'>{assessmentWithGoals.cycle_name || 'N/A'}</p>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Cycle Period</label>
                  <p className='text-sm text-gray-900'>{assessmentWithGoals.cycle_period || 'N/A'}</p>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Start Date</label>
                  <p className='text-sm text-gray-900 flex items-center gap-1'>
                    <Calendar size={16} />
                    {assessmentWithGoals.start_date || 'N/A'}
                  </p>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>End Date</label>
                  <p className='text-sm text-gray-900 flex items-center gap-1'>
                    <Calendar size={16} />
                    {assessmentWithGoals.end_date || 'N/A'}
                  </p>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Final Rating</label>
                  {assessmentWithGoals.final_rating ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star size={16} />
                        <span className='text-lg font-semibold text-gray-900'>
                          {parseFloat(assessmentWithGoals.final_rating.toString()).toFixed(2)}
                        </span>
                        <span className='text-sm text-gray-500'>/5</span>
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="w-fit">Pending</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Information Card */}
          <Card className="shadow-sm border-gray-200 mt-6">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={16} />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Employee Name</label>
                  <p className='text-sm text-gray-900 font-medium'>
                    {assessmentWithGoals.employee_name || 'N/A'}
                  </p>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Email</label>
                  {assessmentWithGoals.employee_email ? (
                    <p className='text-sm text-gray-900 flex items-center gap-1'>
                      <Mail size={16} />
                      {assessmentWithGoals.employee_email}
                    </p>
                  ) : (
                    <p className='text-sm text-gray-500 italic'>Not available</p>
                  )}
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Job Title</label>
                  {assessmentWithGoals.employee_job_title ? (
                    <p className='text-sm text-gray-900 flex items-center gap-1'>
                      <Briefcase size={16} />
                      {assessmentWithGoals.employee_job_title}
                    </p>
                  ) : (
                    <p className='text-sm text-gray-500 italic'>Not available</p>
                  )}
                </div>
                <div className='flex flex-col space-y-1'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Supervisor Name</label>
                  {assessmentWithGoals.supervisor_name ? (
                    <p className='text-sm text-gray-900 flex items-center gap-1'>
                      <UserCheck size={16} />
                      {assessmentWithGoals.supervisor_name}
                    </p>
                  ) : (
                    <p className='text-sm text-gray-500 italic'>Not available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Goals Section */}
          <div className='mt-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Target size={16} />
              <h3 className='text-lg font-semibold text-gray-900'>Employee Goals</h3>
              {assessmentWithGoals.goals && assessmentWithGoals.goals.length > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {assessmentWithGoals.goals.length} {assessmentWithGoals.goals.length === 1 ? 'Goal' : 'Goals'}
                </Badge>
              )}
            </div>
            {assessmentWithGoals.goals && assessmentWithGoals.goals.length > 0 ? (
              <div className='grid gap-4'>
                {assessmentWithGoals.goals.map((goal: any, index: number) => {
                  const totalWeight = goal.total_weight || goal.narratives?.reduce((sum: number, n: any) => sum + parseFloat(n.weight?.toString() || '0'), 0);

                  return (
                    <Card key={goal.id || index} className='shadow-sm border-gray-200 hover:shadow-md transition-shadow'>
                      <CardHeader className='pb-3'>
                        <div className='flex justify-between items-start gap-4'>
                          <div className='flex-1'>
                            <div className='flex items-start gap-2'>
                              <div className='mt-0.5 bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0'>
                                <span className='text-xs font-semibold'>{index + 1}</span>
                              </div>
                              <div className='flex-1'>
                                <CardTitle className='text-base text-gray-900'>
                                  {goal.title || goal.goal || "Untitled Goal"}
                                </CardTitle>
                                {goal.description && (
                                  <p className='text-sm text-gray-600 mt-1'>{goal.description}</p>
                                )}
                              </div>
                            </div>

                            {/* Narratives/Tasks */}
                            {goal.narratives && goal.narratives.length > 0 && (
                              <div className='mt-4 ml-8 bg-gray-50 rounded-lg p-3 border border-gray-100'>
                                <p className='text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-1'>
                                  <ClipboardCheck size={16} />
                                  Tasks ({goal.narratives.length})
                                </p>
                                <ul className='space-y-2'>
                                  {goal.narratives.map((narrative: any, idx: number) => (
                                    <li key={idx} className='flex items-start gap-2 text-sm'>
                                      <CheckCircle size={16} />
                                      <span className='flex-1 text-gray-700'>{narrative.description}</span>
                                      <Badge variant='secondary' className='text-xs'>
                                        {parseFloat(narrative.weight?.toString() || '0').toFixed(0)}%
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className='flex flex-col items-end gap-2'>
                            <Badge variant='outline' className='whitespace-nowrap'>
                              Weight: {totalWeight ? parseFloat(totalWeight.toString()).toFixed(0) : goal.weight || 0}%
                            </Badge>
                            {goal.average_rating && (
                              <div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-200'>
                                <Star size={16} />
                                <span className='text-sm font-semibold text-gray-900'>
                                  {goal.average_rating.toFixed(2)}/5
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className='shadow-sm border-dashed border-gray-300'>
                <CardContent className='py-12 text-center'>
                  <Target size={16} />
                  <p className='text-gray-500 text-sm'>No goals set for this assessment</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Evaluators Section */}
          <div className='mt-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Users size={16} />
              <h3 className='text-lg font-semibold text-gray-900'>Evaluators</h3>
              {assessmentWithGoals.evaluators && assessmentWithGoals.evaluators.length > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {assessmentWithGoals.evaluators.length} {assessmentWithGoals.evaluators.length === 1 ? 'Evaluator' : 'Evaluators'}
                </Badge>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {assessmentWithGoals.evaluators && assessmentWithGoals.evaluators.length > 0 ? (
                assessmentWithGoals.evaluators.map((evaluator: any, index: number) => {
                  // Get evaluator name - prefer evaluator_name field, fallback to user object
                  const evaluatorName = evaluator.evaluator_name ||
                    (typeof evaluator.evaluator === 'object'
                      ? `${evaluator.evaluator.first_name} ${evaluator.evaluator.last_name}`
                      : 'Unknown Evaluator');

                  // Get evaluator email if available
                  const evaluatorEmail = evaluator.evaluator_email ||
                    (typeof evaluator.evaluator === 'object' ? evaluator.evaluator.email : null);

                  // Get initials for avatar
                  const nameParts = evaluatorName.split(' ');
                  const initials = nameParts.length >= 2
                    ? `${nameParts[0][0]}${nameParts[1][0]}`
                    : evaluatorName.substring(0, 2);

                  const statusColors = {
                    completed: 'bg-green-50 text-green-700 border-green-200',
                    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
                    pending: 'bg-gray-50 text-gray-700 border-gray-200',
                  };

                  const statusIcons = {
                    completed: 'ph:check-circle-fill',
                    in_progress: 'ph:clock-duotone',
                    pending: 'ph:hourglass-duotone',
                  };

                  return (
                    <Card key={evaluator.id || index} className='shadow-sm border-gray-200 hover:shadow-md transition-shadow'>
                      <CardContent className='pt-6'>
                        <div className='space-y-4'>
                          {/* Header with name and status */}
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex items-center gap-2'>
                              <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0'>
                                {initials.toUpperCase()}
                              </div>
                              <div>
                                <p className='font-semibold text-gray-900'>
                                  {evaluatorName}
                                </p>
                                <p className='text-xs text-gray-500 capitalize'>{evaluator.evaluator_type} Evaluator</p>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className='flex justify-center'>
                            <Badge
                              variant="outline"
                              className={`w-full justify-center ${statusColors[evaluator.status as keyof typeof statusColors] || statusColors.pending}`}
                            >
                              <Icon icon={statusIcons[evaluator.status as keyof typeof statusIcons] || statusIcons.pending} fontSize={14} className='mr-1' />
                              {evaluator.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                            </Badge>
                          </div>

                          {/* Details */}
                          <div className='space-y-2 pt-2 border-t border-gray-100'>
                            {evaluatorEmail && (
                              <div className='flex items-center gap-2 text-sm'>
                                <Mail size={16} />
                                <p className='text-gray-700 truncate'>{evaluatorEmail}</p>
                              </div>
                            )}
                            {evaluator.submitted_at && (
                              <div className='flex items-center gap-2 text-sm'>
                                <CalendarCheck size={16} />
                                <div>
                                  <p className='text-xs text-gray-500'>Submitted</p>
                                  <p className='text-gray-700'>{new Date(evaluator.submitted_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )}

                            {/* View Evaluation Button for completed evaluations */}
                            {evaluator.status === 'completed' && (
                              <div className='pt-2 flex gap-1'>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Create a detailed view of the evaluation
                                    const evaluationDetails = formatEvaluationDetails(evaluator, assessmentWithGoals);
                                    alert(evaluationDetails);
                                  }}
                                  className="flex-1 text-xs"
                                >
                                  <Eye size={16} />
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleGenerateIndividualPDF(evaluator)}
                                  className="flex-1 text-xs bg-blue-600 hover:bg-blue-700"
                                >
                                  <File size={16} />
                                  PDF Report
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className='shadow-sm border-dashed border-gray-300'>
                  <CardContent className='py-12 text-center'>
                    <Users size={16} />
                    <p className='text-gray-500 text-sm'>No evaluators assigned</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceDetails;
