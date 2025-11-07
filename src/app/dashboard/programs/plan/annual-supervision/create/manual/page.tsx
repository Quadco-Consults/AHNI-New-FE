"use client";

import { useRouter } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import AnnualPlanManualForm from "@/features/programs/components/plan/annual-supervision/AnnualPlanManualForm";

const ManualAnnualSupervisionPlanPage = () => {
  const router = useRouter();

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Annual Supervision Plan", icon: true },
    { name: "Create Plan", icon: true },
    { name: "Manual Planning", icon: false },
  ];

  const handleSuccess = (result: any) => {
    // Navigate back to the main annual supervision plan page
    router.push("/dashboard/programs/plan/annual-supervision");
  };

  const handleCancel = () => {
    // Navigate back to the create page
    router.push("/dashboard/programs/plan/annual-supervision/create");
  };

  const handleGoBack = () => {
    router.push("/dashboard/programs/plan/annual-supervision/create");
  };

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
            <h1 className="text-2xl font-bold">Manual Annual Supervision Planning</h1>
            <p className="text-gray-600 mt-1">
              Create your annual supervision plan step by step using an interactive form
            </p>
          </div>
        </div>

        {/* Manual Form */}
        <AnnualPlanManualForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ManualAnnualSupervisionPlanPage;