"use client";

import { Separator } from "components/ui/separator";
import EvaluatorForm from "../components/EvaluatorForm";
import FormButton from "@/components/FormButton";
import { FileIcon } from "lucide-react";
import GoBack from "components/GoBack";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetPerformanceAssesment } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { Badge } from "components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const PerformanceDetails = () => {
  const params = useParams();
  const assessmentId = params?.id as string;
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Get current user ID
  useEffect(() => {
    const userId = localStorage.getItem('user_id') || "";
    setCurrentUserId(userId);
  }, []);

  // Fetch assessment details
  const { data: assessmentData, isLoading } = useGetPerformanceAssesment(
    assessmentId,
    !!assessmentId
  );

  const assessment = assessmentData?.data?.data || assessmentData?.data;

  // Find if current user is an evaluator
  const currentUserEvaluator = assessment?.evaluators?.find((ev) => {
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

  if (!assessment) {
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
                <p>{assessment.description || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Status</label>
                <Badge variant="outline">{assessment.status || 'draft'}</Badge>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Cycle Name</label>
                <p>{assessment.cycle_name || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Start Date</label>
                <p>{assessment.start_date || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>End Date</label>
                <p>{assessment.end_date || 'N/A'}</p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Final Rating</label>
                <p>{assessment.final_rating ? `${assessment.final_rating}/5` : 'Pending'}</p>
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
                  {typeof assessment.employee === 'object'
                    ? `${assessment.employee.legal_firstname} ${assessment.employee.legal_lastname}`
                    : 'N/A'}
                </p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Email</label>
                <p>
                  {typeof assessment.employee === 'object'
                    ? assessment.employee.email
                    : 'N/A'}
                </p>
              </div>
              <div className='flex flex-col'>
                <label className='text-md font-semibold mb-2'>Job Title</label>
                <p>
                  {typeof assessment.employee === 'object'
                    ? assessment.employee.job_title
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <Separator className='my-6' />

          {/* Employee Goals */}
          <div>
            <h3 className='text-yellow-darker font-semibold mb-4'>Employee Goals</h3>
            {assessment.goals && assessment.goals.length > 0 ? (
              <div className='grid gap-4'>
                {assessment.goals.map((goal, index) => (
                  <Card key={goal.id || index}>
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <CardTitle className='text-base'>{goal.goal}</CardTitle>
                        <Badge variant='outline'>Weight: {goal.weight}%</Badge>
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
                ))}
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
              {assessment.evaluators && assessment.evaluators.length > 0 ? (
                assessment.evaluators.map((evaluator, index) => {
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
