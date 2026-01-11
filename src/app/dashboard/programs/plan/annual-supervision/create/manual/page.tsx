"use client";

import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbCard from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit3 } from "lucide-react";
import AnnualPlanManualForm from "@/features/programs/components/plan/annual-supervision/AnnualPlanManualForm";
import { useGetSingleAnnualPlan } from "@/features/programs/controllers/annualSupervisionPlanController";
import { LoadingSpinner } from "@/components/Loading";

const ManualAnnualSupervisionPlanPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if we're in edit mode
  const planId = searchParams.get('id');
  const isEditMode = !!planId;

  // Fetch plan data if in edit mode
  const { data: planData, isLoading: isLoadingPlan, error: planError } = useGetSingleAnnualPlan(
    planId || '',
    isEditMode // Only fetch if in edit mode
  );

  const plan = planData?.data;

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Annual Supervision Plan", icon: true },
    { name: isEditMode ? "Edit Plan" : "Create Plan", icon: true },
    { name: isEditMode ? "Edit Details" : "Manual Planning", icon: false },
  ];

  const handleSuccess = (result: any) => {
    // Navigate back to the main annual supervision plan page
    router.push("/dashboard/programs/plan/annual-supervision");
  };

  const handleCancel = () => {
    // Navigate back to the create page
    const backUrl = isEditMode
      ? `/dashboard/programs/plan/annual-supervision/create?id=${planId}`
      : "/dashboard/programs/plan/annual-supervision/create";
    router.push(backUrl);
  };

  const handleGoBack = () => {
    const backUrl = isEditMode
      ? `/dashboard/programs/plan/annual-supervision/create?id=${planId}`
      : "/dashboard/programs/plan/annual-supervision/create";
    router.push(backUrl);
  };

  // Show loading state when fetching plan data
  if (isEditMode && isLoadingPlan) {
    return (
      <div className="p-6">
        <BreadcrumbCard list={breadcrumbs} />
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading plan data...</span>
        </div>
      </div>
    );
  }

  // Show error state if plan fetch failed
  if (isEditMode && planError) {
    return (
      <div className="p-6">
        <BreadcrumbCard list={breadcrumbs} />
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Plan</h3>
              <p className="text-red-700 mb-4">
                Could not load the annual supervision plan for editing. The plan may not exist or you may not have permission to edit it.
              </p>
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode
                ? `Edit Plan Details: ${plan?.title || 'Loading...'}`
                : 'Manual Annual Supervision Planning'
              }
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? `Edit "${plan?.title}" using the interactive form below`
                : 'Create your annual supervision plan step by step using an interactive form'
              }
            </p>
          </div>
        </div>

        {/* Manual Form */}
        <AnnualPlanManualForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          editMode={isEditMode}
          existingPlan={plan}
        />
      </div>
    </div>
  );
};

export default ManualAnnualSupervisionPlanPage;