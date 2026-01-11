"use client";

import { useParams, useRouter } from "next/navigation";
import GoBack from "@/components/GoBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetGoal } from "@/features/hr/controllers/goalsController";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { HrRoutes } from "@/constants/RouterConstants";

const GoalDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: goalData, isLoading } = useGetGoal(id, !!id);
  const goal = goalData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Goal not found</p>
        <Button onClick={() => router.push(HrRoutes.GOALS_MANAGEMENT)} className="mt-4">
          Back to Goals
        </Button>
      </div>
    );
  }

  const totalWeight = goal.total_weight || goal.narratives?.reduce((sum, n) => sum + parseFloat(n.weight?.toString() || '0'), 0);

  return (
    <div>
      <div className="flex justify-between w-full mb-6">
        <div className="flex gap-2 items-center">
          <GoBack />
          <h2 className="text-xl font-bold">Goal Details</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Goal Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{goal.title}</CardTitle>
                {goal.description && (
                  <p className="text-gray-600 mt-2">{goal.description}</p>
                )}
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {totalWeight ? parseFloat(totalWeight.toString()).toFixed(0) : 0}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Employee</label>
                <p className="mt-1">{goal.employee_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge
                    variant={
                      goal.status === 'completed' ? 'default' :
                      goal.status === 'in_progress' ? 'secondary' :
                      'outline'
                    }
                    className="capitalize"
                  >
                    {goal.status?.replace('_', ' ') || 'not started'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Created</label>
                <p className="mt-1">
                  {goal.created_datetime
                    ? new Date(goal.created_datetime).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            {(goal.start_date || goal.end_date) && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {goal.start_date && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Start Date</label>
                    <p className="mt-1">{new Date(goal.start_date).toLocaleDateString()}</p>
                  </div>
                )}
                {goal.end_date && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">End Date</label>
                    <p className="mt-1">{new Date(goal.end_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Narratives/Tasks */}
        {goal.narratives && goal.narratives.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasks ({goal.narratives.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goal.narratives.map((narrative, idx) => (
                  <div
                    key={narrative.id || idx}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{narrative.description}</p>
                      {narrative.completed && (
                        <Badge variant="default" className="mt-2 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="font-semibold">
                        {parseFloat(narrative.weight?.toString() || '0').toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weight Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Weight:</span>
                <span className="text-lg font-bold text-primary">
                  {totalWeight ? parseFloat(totalWeight.toString()).toFixed(0) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GoalDetail;
