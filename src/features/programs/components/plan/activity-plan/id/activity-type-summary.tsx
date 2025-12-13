"use client";

import Card from "components/Card";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { useParams } from "next/navigation";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/Loading";
import Link from "next/link";
import { Button } from "components/ui/button";
import { FileText, PlusCircle, Activity } from "lucide-react";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Activity Plan", icon: true },
  { name: "Activity Types", icon: false },
];

export default function ActivityTypeSummary() {
  const { id } = useParams();

  // Fetch work plan to get context info
  const { data: workPlan, isLoading: workPlanLoading } = useGetSingleWorkPlan(id ?? skipToken);

  if (workPlanLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <BreadcrumbCard list={breadcrumbs} />

      {/* Work Plan Context Info */}
      {workPlan?.data && (
        <Card className="p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Activity Plan for:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Project:</span>
                <p className="text-gray-900">{workPlan.data.project?.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Financial Year:</span>
                <p className="text-gray-900">{workPlan.data.financial_year?.year}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Activity Type Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Planned Activities Card */}
        <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
          <Link href={`/dashboard/programs/plan/activity/${id}/planned`}>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Planned Activities</h3>
                <p className="text-gray-600">
                  View and manage activities that are part of your approved work plan
                </p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Planned Activities
              </Button>
            </div>
          </Link>
        </Card>

        {/* Unplanned Activities Card */}
        <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-300">
          <Link href={`/dashboard/programs/plan/activity/${id}/unplanned`}>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-orange-100 rounded-full">
                  <PlusCircle className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Unplanned Activities</h3>
                <p className="text-gray-600">
                  View and manage additional activities added outside the original work plan
                </p>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                View Unplanned Activities
              </Button>
            </div>
          </Link>
        </Card>

      </div>

      {/* Quick Stats (Optional) */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Activity className="w-5 h-5 text-gray-500" />
          <div>
            <h4 className="font-medium">Activity Management</h4>
            <p className="text-sm text-gray-600">
              Choose the type of activities you want to view and manage for this work plan.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}