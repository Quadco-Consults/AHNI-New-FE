"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import AnnualPlanDashboard from "@/features/programs/components/plan/annual-supervision/AnnualPlanDashboard";
import AnnualPlanUpload from "@/features/programs/components/plan/annual-supervision/AnnualPlanUpload";
import { Button } from "components/ui/button";
import { Plus, Upload, FileDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";

const AnnualSupervisionPlanPage = () => {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Annual Supervision Plan", icon: false },
  ];

  const handleCreateNew = () => {
    // TODO: Navigate to create annual supervision plan page
    // router.push("/dashboard/programs/plan/annual-supervision/create");
    console.log("Create new annual supervision plan");
  };

  const handleViewDetails = (planId: string) => {
    // TODO: Navigate to plan details page
    // router.push(`/dashboard/programs/plan/annual-supervision/${planId}`);
    console.log("View plan details:", planId);
  };

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
    // Refresh the dashboard data
    window.location.reload();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export annual supervision plans");
  };

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Annual Supervision Plan</h1>
            <p className="text-gray-600 mt-1">
              Manage annual supervision plans and track planned visits
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <FileDown size={16} />
              Export
            </Button>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload Annual Supervision Plan</DialogTitle>
                  <DialogDescription>
                    Upload an Excel file containing your annual supervision plan data
                  </DialogDescription>
                </DialogHeader>
                <AnnualPlanUpload onSuccess={handleUploadSuccess} />
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleCreateNew}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Create Plan
            </Button>
          </div>
        </div>

        {/* Dashboard */}
        <AnnualPlanDashboard
          onCreateNew={handleCreateNew}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default AnnualSupervisionPlanPage;