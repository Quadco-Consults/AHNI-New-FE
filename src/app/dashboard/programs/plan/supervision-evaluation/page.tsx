"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import SiteVisitsNeedingEvaluation from "@/features/programs/components/evaluation/SiteVisitsNeedingEvaluation";
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
  const [selectedSiteVisitId, setSelectedSiteVisitId] = useState<string>("");

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Supervision Evaluation", icon: false },
  ];

  const handleCreateEvaluation = (siteVisitId?: string) => {
    if (siteVisitId) {
      setSelectedSiteVisitId(siteVisitId);
    }
    setEvaluationDialogOpen(true);
  };

  const handleViewDetails = (evaluationId: string) => {
    // TODO: Navigate to evaluation details page
    // router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluationId}`);
    console.log("View evaluation details:", evaluationId);
  };

  const handleEvaluationSuccess = (evaluationId: string) => {
    setEvaluationDialogOpen(false);
    setSelectedSiteVisitId("");

    // Trigger evaluations list refresh
    setTimeout(() => {
      if ((window as any).refreshEvaluationsList) {
        console.log("🔄 Triggering evaluations list refresh...");
        (window as any).refreshEvaluationsList();
      }
    }, 1000); // Wait 1 second for the backend to process

    // Check if this is a placeholder ID (backend didn't return real ID)
    if (evaluationId.startsWith('site-visit-')) {
      // Navigate back to main list where the user can see the updated status
      // The site should now show a "View Evaluation" button instead of "Create"
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Wait 2 seconds for refresh to complete
    } else {
      // Navigate directly to the evaluation conducting interface
      setTimeout(() => {
        router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluationId}`);
      }, 1500); // Wait for refresh first
    }
  };

  // Add a callback to be passed to SiteVisitsNeedingEvaluation for refreshing data
  const handleEvaluationRefresh = () => {
    // This will be called by the SiteVisitsNeedingEvaluation component after evaluation success
    console.log("🔄 Evaluation refresh callback triggered");
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
              Site visits requiring evaluation assessment and scoring
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
                <SupervisionEvaluationForm
                  siteVisitId={selectedSiteVisitId}
                  onSuccess={handleEvaluationSuccess}
                  onCancel={() => setEvaluationDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Site Visits Needing Evaluation */}
        <SiteVisitsNeedingEvaluation
          onCreateEvaluation={handleCreateEvaluation}
          onEvaluationSuccess={handleEvaluationRefresh}
        />
      </div>
    </div>
  );
};

export default SupervisionEvaluationPage;