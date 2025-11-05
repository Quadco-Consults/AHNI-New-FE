"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import SupervisionEvaluationDashboard from "@/features/programs/components/evaluation/SupervisionEvaluationDashboard";
import SupervisionEvaluationForm from "@/features/programs/components/evaluation/SupervisionEvaluationForm";
import { Button } from "components/ui/button";
import { Plus, FileDown, BarChart3, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";

const SupervisionEvaluationPage = () => {
  const router = useRouter();
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Supervision Evaluation", icon: false },
  ];

  const handleCreateEvaluation = () => {
    setEvaluationDialogOpen(true);
  };

  const handleViewDetails = (evaluationId: string) => {
    // TODO: Navigate to evaluation details page
    // router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluationId}`);
    console.log("View evaluation details:", evaluationId);
  };

  const handleEvaluationSuccess = () => {
    setEvaluationDialogOpen(false);
    // Refresh the dashboard data
    window.location.reload();
  };

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log("Generate supervision evaluation report");
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log("Export supervision evaluation data");
  };

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Supervision Evaluation</h1>
            <p className="text-gray-600 mt-1">
              Conduct evaluations, track performance metrics, and generate insights
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
              className="flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Generate Report
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <FileDown size={16} />
              Export Data
            </Button>

            <Dialog open={evaluationDialogOpen} onOpenChange={setEvaluationDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Evaluation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Supervision Evaluation</DialogTitle>
                  <DialogDescription>
                    Create a new supervision evaluation to assess performance and provide feedback
                  </DialogDescription>
                </DialogHeader>
                <SupervisionEvaluationForm onSuccess={handleEvaluationSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dashboard */}
        <SupervisionEvaluationDashboard
          onCreateEvaluation={handleCreateEvaluation}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default SupervisionEvaluationPage;