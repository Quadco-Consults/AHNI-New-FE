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
    router.push("/dashboard/programs/plan/annual-supervision/create");
  };

  const handleViewDetails = (planId: string) => {
    router.push(`/dashboard/programs/plan/annual-supervision/${planId}`);
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
        {/* Dashboard with Upload Dialog Integration */}
        <div className="space-y-6">
          {/* Upload Dialog */}
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
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

          {/* Dashboard handles all UI including headers and buttons */}
          <AnnualPlanDashboard
            onCreateNew={handleCreateNew}
            onViewDetails={handleViewDetails}
            onUpload={() => setUploadDialogOpen(true)}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnualSupervisionPlanPage;