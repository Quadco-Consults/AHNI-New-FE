"use client";

import { Separator } from "components/ui/separator";
import EvaluatorForm from "../components/EvaluatorForm";
import FormButton from "@/components/FormButton";
import { FileIcon } from "lucide-react";
import GoBack from "components/GoBack";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetPerformanceAssesment } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { useGetEmployeeGoals } from "@/features/hr/controllers/goalsController";
import { Badge } from "components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const PerformanceDetails = () => {
  const params = useParams();
  const assessmentId = params?.id as string;
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Get current user ID
  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id || "";
      setCurrentUserId(userId);
      console.log("Current User ID for evaluation:", userId);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // Fetch assessment details
  const { data: assessmentData, isLoading } = useGetPerformanceAssesment(
    assessmentId,
    !!assessmentId
  );

  const assessment = assessmentData?.data?.data || assessmentData?.data;

  // Get employee ID from assessment
  const employeeId = typeof assessment?.employee === 'object'
    ? assessment.employee.id
    : assessment?.employee;

  // Fetch employee goals separately (workaround until backend includes them)
  const { data: employeeGoalsData } = useGetEmployeeGoals(
    employeeId || "",
    !!employeeId
  );

  // Merge goals into assessment - backend returns employee_goals
  const assessmentWithGoals = {
    ...assessment,
    goals: assessment?.employee_goals || employeeGoalsData?.data?.results || employeeGoalsData?.data || assessment?.goals || []
  };

  // Debug logging
  console.log("Assessment data:", assessment);
  console.log("Employee data:", assessment?.employee);
  console.log("Employee goals from backend:", assessment?.employee_goals);
  console.log("Merged goals:", assessmentWithGoals?.goals);

  // Find if current user is an evaluator
  const currentUserEvaluator = assessmentWithGoals?.evaluators?.find((ev) => {
    const evaluatorId = typeof ev.evaluator === 'object' ? ev.evaluator.id : ev.evaluator;
    return evaluatorId === currentUserId;
  });

  const canEvaluate = !!currentUserEvaluator && currentUserEvaluator.status !== 'completed';

  const handleStartEvaluation = () => {
    setIsEvaluating(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading assessment...</div>;
  }

  if (!assessmentWithGoals) {
    return <div className="text-center py-10 text-red-600">Assessment not found</div>;
  }

  return (
    <div>
      <div className='flex justify-between w-full'>
        <div className='flex gap-2 items-center'>
          <GoBack />
          <h2 className='text-xl font-bold'>
            Performance Assessment
          </h2>
        </div>
        {canEvaluate && !isEvaluating && (
          <FormButton onClick={handleStartEvaluation}>
            <FileIcon />
            <p>Start Evaluation</p>
          </FormButton>
        )}
      </div>
      {/* Show evaluation form if user is evaluating */}
      {isEvaluating && currentUserId ? (
        <div className='mt-6'>
          <EvaluatorForm
            assessmentId={assessmentId}
            evaluatorId={currentUserId}
          />
        </div>
      ) : (
        <>
          <div className='mt-10'>
            <h3 className='text-yellow-darker font-semibold'>
              Appraisal Information
            </h3>
            <div className='grid grid-cols-3 mt-4 gap-4'>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Description</label>
                <p>{assessmentWithGoals.description || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Status</label>
                <Badge variant="outline">{assessmentWithGoals.status || 'draft'}</Badge>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Cycle Name</label>
                <p>{assessmentWithGoals.cycle_name || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Start Date</label>
                <p>{assessmentWithGoals.start_date || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>End Date</label>
                <p>{assessmentWithGoals.end_date || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Final Rating</label>
                <p>{assessmentWithGoals.final_rating ? `${assessmentWithGoals.final_rating}/5` : 'Pending'}</p>
              </div>
            </div>
          </div>
          <Separator className='my-6' />

          <div>
            <h3 className='text-yellow-darker font-semibold'>
              Employee Information
            </h3>
            <div className='grid grid-cols-3 mt-4 gap-4'>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>
                  Employee Name
                </label>
                <p>
                  {assessmentWithGoals.employee_name ||
                   (typeof assessmentWithGoals.employee === 'object'
                    ? `${assessmentWithGoals.employee.legal_firstname || assessmentWithGoals.employee.first_name || ''} ${assessmentWithGoals.employee.legal_lastname || assessmentWithGoals.employee.last_name || ''}`.trim()
                    : '') || 'N/A'}
                </p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Email</label>
                <p>
                  {assessmentWithGoals.employee_email ||
                   (typeof assessmentWithGoals.employee === 'object'
                    ? assessmentWithGoals.employee.email
                    : '') || 'N/A'}
                </p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Job Title</label>
                <p>
                  {assessmentWithGoals.employee_job_title ||
                   (typeof assessmentWithGoals.employee === 'object'
                    ? assessmentWithGoals.employee.job_title || assessmentWithGoals.employee.job_id
                    : '') || 'N/A'}
                </p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Supervisor Name</label>
                <p>
                  {assessmentWithGoals.supervisor_name ||
                   (typeof assessmentWithGoals.employee === 'object' && assessmentWithGoals.employee.supervisor
                    ? typeof assessmentWithGoals.employee.supervisor === 'object'
                      ? `${assessmentWithGoals.employee.supervisor.first_name || ''} ${assessmentWithGoals.employee.supervisor.last_name || ''}`.trim()
                      : ''
                    : '') || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <Separator className='my-6' />

          {/* Employee Goals */}
          <div>
            <h3 className='text-yellow-darker font-semibold mb-4'>Employee Goals</h3>
            {assessmentWithGoals.goals && assessmentWithGoals.goals.length > 0 ? (
              <div className='grid gap-4'>
                {assessmentWithGoals.goals.map((goal, index) => {
                  const totalWeight = goal.total_weight || goal.narratives?.reduce((sum, n) => sum + parseFloat(n.weight?.toString() || '0'), 0);

                  return (
                    <Card key={goal.id || index}>
                      <CardHeader>
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <CardTitle className='text-base'>{goal.title || goal.goal || "Untitled Goal"}</CardTitle>
                            {goal.description && (
                              <p className='text-sm text-gray-600 mt-1'>{goal.description}</p>
                            )}

                            {/* Narratives/Tasks */}
                            {goal.narratives && goal.narratives.length > 0 && (
                              <div className='mt-3 pl-2 border-l-2 border-gray-200'>
                                <p className='text-xs font-medium text-gray-500 mb-1'>Tasks:</p>
                                <ul className='space-y-1'>
                                  {goal.narratives.map((narrative, idx) => (
                                    <li key={idx} className='text-xs flex items-start gap-2'>
                                      <span className='text-gray-400'>•</span>
                                      <span className='flex-1'>{narrative.description}</span>
                                      <Badge variant='secondary' className='text-xs h-4'>
                                        {parseFloat(narrative.weight?.toString() || '0').toFixed(0)}%
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Badge variant='outline'>
                            Weight: {totalWeight ? parseFloat(totalWeight.toString()).toFixed(0) : goal.weight || 0}%
                          </Badge>
                        </div>
                      </CardHeader>
                      {goal.average_rating && (
                        <CardContent>
                          <p className='text-sm'>
                            <span className='font-semibold'>Average Rating: </span>
                            {goal.average_rating}/5
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className='text-gray-500'>No goals set for this assessment</p>
            )}
          </div>
          <Separator className='my-6' />

          {/* Evaluators */}
          <div className='flex flex-col gap-4'>
            <h3 className='text-yellow-darker font-semibold'>Evaluators</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {assessmentWithGoals.evaluators && assessmentWithGoals.evaluators.length > 0 ? (
                assessmentWithGoals.evaluators.map((evaluator, index) => {
                  const evaluatorUser = typeof evaluator.evaluator === 'object'
                    ? evaluator.evaluator
                    : null;

                  return (
                    <Card key={evaluator.id || index}>
                      <CardContent className='pt-6'>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center'>
                            <p className='font-semibold'>
                              {evaluatorUser
                                ? `${evaluatorUser.first_name} ${evaluatorUser.last_name}`
                                : 'Unknown'}
                            </p>
                            <Badge
                              variant={
                                evaluator.status === 'completed'
                                  ? 'default'
                                  : evaluator.status === 'in_progress'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {evaluator.status || 'pending'}
                            </Badge>
                          </div>
                          <div className='flex text-sm'>
                            <p className='w-[140px] text-gray-600'>Type:</p>
                            <p className='capitalize'>{evaluator.evaluator_type}</p>
                          </div>
                          {evaluatorUser?.email && (
                            <div className='flex text-sm'>
                              <p className='w-[140px] text-gray-600'>Email:</p>
                              <p>{evaluatorUser.email}</p>
                            </div>
                          )}
                          {evaluator.submitted_at && (
                            <div className='flex text-sm'>
                              <p className='w-[140px] text-gray-600'>Submitted:</p>
                              <p>{new Date(evaluator.submitted_at).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className='text-gray-500'>No evaluators assigned</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceDetails;
