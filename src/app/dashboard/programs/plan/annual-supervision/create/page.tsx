"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { ArrowLeft, Calendar, Target, Upload, Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import AnnualPlanUpload from "@/features/programs/components/plan/annual-supervision/AnnualPlanUpload";
import { useGetSingleAnnualPlan } from "@/features/programs/controllers/annualSupervisionPlanController";
import { LoadingSpinner } from "components/Loading";

const CreateAnnualSupervisionPlanPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
    { name: isEditMode ? "Edit Plan" : "Create Plan", icon: false },
  ];

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
    router.push("/dashboard/programs/plan/annual-supervision");
  };

  const handleGoBack = () => {
    router.push("/dashboard/programs/plan/annual-supervision");
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
                Could not load the annual supervision plan. The plan may not exist or you may not have permission to edit it.
              </p>
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
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
                ? `Edit Plan: ${plan?.title || 'Loading...'}`
                : 'Create Annual Supervision Plan'
              }
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? `Edit and update "${plan?.title}" - Status: ${plan?.status}`
                : 'Create a new annual supervision plan for systematic supervision visits'
              }
            </p>
          </div>
        </div>

        {/* Current Plan Details - Edit Mode */}
        {isEditMode && plan && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-blue-900">Current Plan Details</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">
                    Review the current plan information before making changes
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Title</p>
                  <p className="text-sm text-blue-700">{plan.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Financial Year</p>
                  <p className="text-sm text-blue-700">{plan.financial_year_display || 'Not Set'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Status</p>
                  <p className="text-sm text-blue-700 capitalize">{plan.status?.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Created</p>
                  <p className="text-sm text-blue-700">
                    {plan.created_datetime ? new Date(plan.created_datetime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Total Visits</p>
                  <p className="text-sm text-blue-700">{plan.total_planned_visits || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Completed</p>
                  <p className="text-sm text-blue-700">{plan.visits_completed || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Locations</p>
                  <p className="text-sm text-blue-700">{plan.locations_covered || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Progress</p>
                  <p className="text-sm text-blue-700">{(plan.completion_percentage || 0).toFixed(1)}%</p>
                </div>
              </div>
              {plan.description && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">Description</p>
                  <p className="text-sm text-blue-700">{plan.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Creation/Edit Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bulk Upload Option */}
          <Card className="border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">
                {isEditMode ? 'Replace with Excel Upload' : 'Bulk Upload from Excel'}
              </CardTitle>
              <p className="text-gray-600">
                {isEditMode
                  ? 'Replace the current plan by uploading a new Excel file with updated visits'
                  : 'Upload multiple planned visits at once using an Excel template'
                }
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  <p>✓ Fast for multiple locations</p>
                  <p>✓ Template with validation</p>
                  <p>✓ Bulk data import</p>
                </div>

                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Replace with Excel' : 'Upload Excel File'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload Annual Supervision Plan</DialogTitle>
                      <DialogDescription>
                        Upload an Excel file containing your annual supervision plan data
                      </DialogDescription>
                    </DialogHeader>
                    <AnnualPlanUpload
                      onSuccess={handleUploadSuccess}
                      editMode={isEditMode}
                      planId={planId}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Manual Creation Option */}
          <Card className="border-2 border-dashed border-green-300 hover:border-green-500 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">
                {isEditMode ? 'Edit Plan Details' : 'Manual Planning'}
              </CardTitle>
              <p className="text-gray-600">
                {isEditMode
                  ? 'Edit the plan details, modify individual visits, and update configurations'
                  : 'Create and configure your annual plan step by step'
                }
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  <p>✓ Step-by-step guidance</p>
                  <p>✓ Interactive planning</p>
                  <p>✓ Flexible configuration</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const url = isEditMode
                      ? `/dashboard/programs/plan/annual-supervision/create/manual?id=${planId}`
                      : "/dashboard/programs/plan/annual-supervision/create/manual";
                    router.push(url);
                  }}
                >
                  {isEditMode ? <Edit3 className="w-4 h-4 mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                  {isEditMode ? 'Edit Plan Details' : 'Start Manual Planning'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Planning Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Excel Upload Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Download the template first</li>
                  <li>• Fill in all required columns</li>
                  <li>• Use valid location names</li>
                  <li>• Specify visit types correctly</li>
                  <li>• Save as .xlsx or .xls format</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Visit Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>SUPPORTIVE_SUPERVISION:</strong> Regular supervisory visits</li>
                  <li>• <strong>INTEGRATED_SUPPORTIVE_SUPERVISION:</strong> Multi-program visits</li>
                </ul>

                <h4 className="font-medium mb-2 mt-4">Evaluation Options</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>YES:</strong> Visit requires evaluation</li>
                  <li>• <strong>NO:</strong> Visit is informational only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAnnualSupervisionPlanPage;