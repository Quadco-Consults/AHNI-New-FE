"use client";

import { useMonthlyActivityPlansByActivity } from "@/features/programs/controllers/activityPlanController";
import { LoadingSpinner } from "@/components/Loading";
import { AlertCircle, Calendar, CheckCircle2, Clock, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";

interface MonthlyActivityPlansExpandedProps {
  activityId: string;  // work_plan_activity ID
  activityNumber: string;
  workPlanId?: string; // work plan ID for edit link
}

export default function MonthlyActivityPlansExpanded({
  activityId,
  activityNumber,
  workPlanId,
}: MonthlyActivityPlansExpandedProps) {
  const { data: response, isLoading, error } = useMonthlyActivityPlansByActivity(activityId, !!activityId);

  const monthlyPlans = response?.results || [];

  // Sort by start_date to show chronological order
  const sortedPlans = [...monthlyPlans].sort((a, b) => {
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });

  // Status badge colors
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      DONE: { variant: "default", icon: <CheckCircle2 className="w-3 h-3" /> },
      IN_PROGRESS: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      NOT_DONE: { variant: "outline", icon: <AlertCircle className="w-3 h-3" /> },
      ONGOING: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      STARTED_BUT_NOT_FINISHED: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      NO_LONGER_APPLICABLE: { variant: "destructive", icon: <AlertCircle className="w-3 h-3" /> },
    };

    const config = statusConfig[status] || statusConfig.NOT_DONE;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  // Format month name from date
  const getMonthName = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 bg-red-50">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <div className="text-sm text-red-800 text-center">
          <p className="font-medium">Failed to load monthly activity plans</p>
          <p className="text-xs mt-1">Please check your connection or try again later.</p>
        </div>
      </div>
    );
  }

  if (sortedPlans.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 bg-yellow-50">
        <Calendar className="w-8 h-8 text-yellow-600" />
        <div className="text-sm text-yellow-800 text-center">
          <p className="font-medium">No monthly execution records found</p>
          <p className="text-xs mt-1">
            Create monthly activity plan records to track monthly execution of this activity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-700">
          Monthly Execution Records for Activity {activityNumber}
        </h4>
        <span className="text-xs text-gray-500">
          {sortedPlans.length} {sortedPlans.length === 1 ? "month" : "months"}
        </span>
      </div>

      <div className="space-y-3">
        {sortedPlans.map((plan) => (
          <div
            key={plan.id}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {getMonthName(plan.start_date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(plan.status)}
                {workPlanId && (
                  <Link
                    href={{
                      pathname: RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
                      search: `?plan=${workPlanId}&id=${plan.id}`,
                    }}
                  >
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Period:</span>
                <p className="text-gray-900 mt-1">
                  {format(new Date(plan.start_date), "MMM d, yyyy")} - {format(new Date(plan.end_date), "MMM d, yyyy")}
                </p>
              </div>

              {plan.expected_results && (
                <div className="col-span-2">
                  <span className="text-gray-500">Expected Results:</span>
                  <p className="text-gray-900 mt-1">{plan.expected_results}</p>
                </div>
              )}

              {plan.achieved_results && (
                <div className="col-span-2">
                  <span className="text-gray-500">Achieved Results:</span>
                  <p className="text-gray-900 mt-1">{plan.achieved_results}</p>
                </div>
              )}

              {plan.comments && (
                <div className="col-span-2">
                  <span className="text-gray-500">Comments:</span>
                  <p className="text-gray-900 mt-1">{plan.comments}</p>
                </div>
              )}

              {plan.driver_vehicle && (
                <div>
                  <span className="text-gray-500">Driver/Vehicle:</span>
                  <p className="text-gray-900 mt-1">{plan.driver_vehicle}</p>
                </div>
              )}

              {plan.resources_required && (
                <div>
                  <span className="text-gray-500">Resources Required:</span>
                  <p className="text-gray-900 mt-1">{plan.resources_required}</p>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>
                Created: {format(new Date(plan.created_datetime), "MMM d, yyyy")}
              </span>
              {plan.updated_datetime && plan.updated_datetime !== plan.created_datetime && (
                <span>
                  Updated: {format(new Date(plan.updated_datetime), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> These are monthly execution records showing when this activity was performed each month.
          Each record tracks the specific results and outcomes for that month.
        </p>
      </div>
    </div>
  );
}
