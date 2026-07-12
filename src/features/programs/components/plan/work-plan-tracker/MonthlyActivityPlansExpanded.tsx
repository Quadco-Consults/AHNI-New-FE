"use client";

import { useMonthlyActivityPlansByActivity } from "@/features/programs/controllers/activityPlanController";
import { LoadingSpinner } from "@/components/Loading";
import { AlertCircle, Calendar, CheckCircle2, Clock, Edit, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import PencilIcon from "@/components/icons/PencilIcon";
import EditIcon from "@/components/icons/EditIcon";

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
  const dispatch = useAppDispatch();

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
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Execution Records for Activity {activityNumber}
        </h4>
        <span className="text-xs text-gray-500">
          {sortedPlans.length} {sortedPlans.length === 1 ? "record" : "records"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-700">Period</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Duration</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Expected Results</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Resources Required</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlans.map((plan, index) => (
              <tr
                key={plan.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {getMonthName(plan.start_date)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-600 text-xs">
                  {format(new Date(plan.start_date), "MMM d")} - {format(new Date(plan.end_date), "MMM d, yyyy")}
                </td>
                <td className="px-3 py-3">
                  {getStatusBadge(plan.status)}
                </td>
                <td className="px-3 py-3 text-gray-700 max-w-xs">
                  <div className="truncate" title={plan.expected_results || ''}>
                    {plan.expected_results || '-'}
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-700 max-w-xs">
                  <div className="truncate text-xs" title={plan.resources_required || ''}>
                    {plan.resources_required || '-'}
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  {workPlanId && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                          <Link
                            className="w-full"
                            href={{
                              pathname: RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
                              search: `?plan=${workPlanId}&id=${plan.id}`,
                            }}
                          >
                            <Button
                              className="w-full flex items-center justify-start gap-2"
                              variant="ghost"
                              size="sm"
                            >
                              <EditIcon />
                              Edit
                            </Button>
                          </Link>

                          <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              dispatch(
                                openDialog({
                                  type: DialogType.ACTIVITY_PLAN_STATUS_MODAL,
                                  dialogProps: { id: plan.id, status: plan.status },
                                })
                              );
                            }}
                          >
                            <PencilIcon />
                            Change Status
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
        <strong>Note:</strong> These execution records track when this activity was performed throughout the year.
      </div>
    </div>
  );
}
