"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { useGetPerformanceAssesments } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { PerformanceAssesment, EvaluatorType } from "@/features/hr/types/performance-assesment";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

const EvaluatorDashboard: React.FC = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  // Get current user from localStorage
  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      const userId = user?.id || user?.user_id || "";
      const email = user?.email || "";

      setCurrentUserId(userId);
      setCurrentUserEmail(email);

      console.log("📋 Evaluator Dashboard - Current User:", { userId, email });
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // Fetch all assessments
  const { data: assessmentsData, isLoading, refetch } = useGetPerformanceAssesments({
    search: "",
    page: 1,
    size: 100,
  });

  // Refetch on mount and focus
  useEffect(() => {
    if (currentUserId) {
      refetch();
    }
  }, [currentUserId, refetch]);

  // Filter assessments where current user is an evaluator
  const myEvaluations = useMemo(() => {
    if (!assessmentsData?.data?.results || !currentUserId) return [];

    return assessmentsData.data.results.filter((assessment: PerformanceAssesment) => {
      return assessment.evaluators?.some(evaluator => {
        const evaluatorId = typeof evaluator.evaluator === 'object'
          ? evaluator.evaluator.id
          : evaluator.evaluator;

        return evaluatorId === currentUserId;
      });
    });
  }, [assessmentsData, currentUserId]);

  // Categorize evaluations
  const { pending, inProgress, completed } = useMemo(() => {
    const pending: PerformanceAssesment[] = [];
    const inProgress: PerformanceAssesment[] = [];
    const completed: PerformanceAssesment[] = [];

    myEvaluations.forEach((assessment) => {
      const myEvaluator = assessment.evaluators?.find(evaluator => {
        const evaluatorId = typeof evaluator.evaluator === 'object'
          ? evaluator.evaluator.id
          : evaluator.evaluator;
        return evaluatorId === currentUserId;
      });

      if (!myEvaluator) return;

      if (myEvaluator.status === 'completed') {
        completed.push(assessment);
      } else if (myEvaluator.status === 'in_progress') {
        inProgress.push(assessment);
      } else {
        pending.push(assessment);
      }
    });

    return { pending, inProgress, completed };
  }, [myEvaluations, currentUserId]);

  const EvaluationCard = ({ assessment }: { assessment: PerformanceAssesment }) => {
    const myEvaluator = assessment.evaluators?.find(evaluator => {
      const evaluatorId = typeof evaluator.evaluator === 'object'
        ? evaluator.evaluator.id
        : evaluator.evaluator;
      return evaluatorId === currentUserId;
    });

    const employeeName = assessment.employee_name ||
      (typeof assessment.employee === 'object'
        ? `${assessment.employee.legal_firstname || assessment.employee.first_name} ${assessment.employee.legal_lastname || assessment.employee.last_name}`
        : "Unknown");

    const evaluatorTypeLabel: Record<EvaluatorType, string> = {
      'self': 'Self Evaluation',
      'supervisor': 'Supervisor Evaluation',
      'peer': 'Peer Evaluation',
    };

    const statusColor = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">
                {assessment.cycle_name || "Performance Assessment"}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Employee: <span className="font-medium">{employeeName}</span>
              </p>
              <p className="text-sm text-gray-600">
                Job Title: {assessment.employee_job_title || "N/A"}
              </p>
            </div>
            <Badge className={statusColor[myEvaluator?.status || 'pending']}>
              {(myEvaluator?.status || 'pending').replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Evaluation Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Role:</span>
              <p className="font-medium">{evaluatorTypeLabel[myEvaluator?.evaluator_type || 'peer']}</p>
            </div>
            <div>
              <span className="text-gray-500">Period:</span>
              <p className="font-medium">
                {assessment.start_date ? new Date(assessment.start_date).toLocaleDateString() : "N/A"} -{" "}
                {assessment.end_date ? new Date(assessment.end_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {assessment.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{assessment.description}</p>
          )}

          {/* Goals Count */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Icon icon="ph:target-duotone" className="text-blue-600" />
              <span>{assessment.employee_goals?.length || assessment.goals?.length || 0} Goals</span>
            </div>
            {myEvaluator?.submitted_at && (
              <div className="flex items-center gap-1 text-green-600">
                <Icon icon="ph:check-circle-duotone" />
                <span>Submitted {new Date(myEvaluator.submitted_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {myEvaluator?.status === 'completed' ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push(`/dashboard/hr/performance-management/${assessment.id}`)}
              >
                <Icon icon="ph:eye-duotone" className="mr-2" />
                View Evaluation
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => router.push(`/dashboard/hr/performance-management/evaluate/${assessment.id}?evaluator=${currentUserId}`)}
              >
                <Icon icon="ph:pencil-duotone" className="mr-2" />
                {myEvaluator?.status === 'in_progress' ? 'Continue Evaluation' : 'Start Evaluation'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading your evaluations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Evaluations</h2>
        <p className="text-gray-600 text-sm mt-1">
          Performance assessments where you are an evaluator
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Icon icon="ph:clock-duotone" className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{inProgress.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon icon="ph:pencil-duotone" className="text-blue-600 text-2xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completed.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Icon icon="ph:check-circle-duotone" className="text-green-600 text-2xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluation Lists */}
      {myEvaluations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icon icon="ph:clipboard-text-duotone" className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No evaluations assigned to you yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgress.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No pending evaluations
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pending.map((assessment) => (
                  <EvaluationCard key={assessment.id} assessment={assessment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgress.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No evaluations in progress
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgress.map((assessment) => (
                  <EvaluationCard key={assessment.id} assessment={assessment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completed.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No completed evaluations
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((assessment) => (
                  <EvaluationCard key={assessment.id} assessment={assessment} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EvaluatorDashboard;
