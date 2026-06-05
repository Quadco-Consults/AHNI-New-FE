"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCard from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileDown, BarChart, Filter, ClipboardList, Target, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SupervisionEvaluationForm from "@/features/programs/components/evaluation/SupervisionEvaluationForm";
import DataTable from "@/components/Table/DataTable";
import { createSiteVisitEvaluationColumns } from "@/features/programs/components/table-columns/evaluation/site-visits-evaluation";
import { supervisionEvaluationColumns } from "@/features/programs/components/table-columns/evaluation/supervision-evaluation";

// Import hooks
import { useGetAllSiteVisits } from "@/features/programs/controllers/siteVisitController";
import { useGetAllSupervisionEvaluations } from "@/features/programs/controllers/supervisionEvaluationController";

// Import types
import { ISiteVisitListParams, SiteVisitType } from "@/features/programs/types/site-visit";
import { SupervisionEvaluationStatus } from "@/features/programs/types/supervision-evaluation";

const SupervisionEvaluationPage = () => {
  const router = useRouter();
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [selectedSiteVisitId, setSelectedSiteVisitId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("site-visits");

  // Travel requests query parameters
  const [siteVisitParams, setSiteVisitParams] = useState<ISiteVisitListParams>({
    page: 1,
    page_size: 20,
    search: "",
    status: "", // Show all approved statuses
    visit_type: "",
    location: "",
  });

  // Evaluations query parameters
  const [evaluationParams, setEvaluationParams] = useState({
    page: 1,
    page_size: 20,
    search: "",
    status: "",
  });

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Supervision Evaluation", icon: false },
  ];

  // Fetch data
  const { data: siteVisitsData, isLoading: isLoadingSiteVisits } = useGetAllSiteVisits(siteVisitParams);
  const { data: evaluationsData, isLoading: isLoadingEvaluations, refetch: refetchEvaluations } = useGetAllSupervisionEvaluations(evaluationParams);

  // Process travel requests for evaluation table
  const siteVisitsForEvaluation = React.useMemo(() => {
    const actualResults = (siteVisitsData as any)?.data?.results || siteVisitsData?.results || [];

    if (!Array.isArray(actualResults)) return [];

    // Filter for supervision visits that are approved
    const supervisionTypes = [
      "Supportive Supervision",
      "Integrated Supportive Supervision",
      "Emergency Supportive Supervision",
    ];

    const approvedStatuses = [
      "Authorized",
      "EA Generated",
    ];

    const existingEvaluationSiteVisitIds = new Set(
      evaluationsData?.results?.map(evaluation => evaluation.site_visit_id) || []
    );

    return actualResults
      .filter((siteVisit: any) => {
        const hasApprovedStatus = approvedStatuses.includes(siteVisit.status_display);
        const isSupervisionType = supervisionTypes.includes(siteVisit.visit_type_display);
        return hasApprovedStatus && isSupervisionType;
      })
      .map((siteVisit: any) => {
        const hasEvaluation = existingEvaluationSiteVisitIds.has(siteVisit.id);
        const evaluation = evaluationsData?.results?.find(evaluation => evaluation.site_visit_id === siteVisit.id);

        return {
          ...siteVisit,
          hasEvaluation,
          evaluationStatus: evaluation?.status || 'PENDING',
          evaluationId: evaluation?.id || null,
        };
      });
  }, [siteVisitsData, evaluationsData]);

  // Get evaluations data
  const evaluations = evaluationsData?.results || [];

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalSiteVisits = siteVisitsForEvaluation.length;
    const pendingEvaluations = siteVisitsForEvaluation.filter(sv => !sv.hasEvaluation).length;
    const inProgressEvaluations = evaluations.filter(e => e.status === SupervisionEvaluationStatus.IN_PROGRESS).length;
    const completedEvaluations = evaluations.filter(e => e.status === SupervisionEvaluationStatus.COMPLETED).length;

    return {
      totalSiteVisits,
      pendingEvaluations,
      inProgressEvaluations,
      completedEvaluations,
      totalEvaluations: evaluations.length
    };
  }, [siteVisitsForEvaluation, evaluations]);

  // Handlers
  const handleCreateEvaluation = (siteVisitId?: string) => {
    if (siteVisitId) {
      setSelectedSiteVisitId(siteVisitId);
    }
    setEvaluationDialogOpen(true);
  };

  const handleViewEvaluation = (siteVisitId: string) => {
    const evaluation = evaluations.find(evaluation => evaluation.site_visit_id === siteVisitId);
    if (evaluation) {
      router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluation.id}`);
    }
  };

  const handleEvaluationSuccess = (evaluationId: string) => {
    setEvaluationDialogOpen(false);
    setSelectedSiteVisitId("");
    refetchEvaluations();

    // Navigate to conduct evaluation if successful
    if (!evaluationId.startsWith('site-visit-')) {
      setTimeout(() => {
        router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluationId}`);
      }, 1000);
    }
  };

  const handleGenerateReport = () => {
    console.log("Generate supervision evaluation report");
  };

  const handleExportData = () => {
    console.log("Export supervision evaluation data");
  };

  // Table columns
  const siteVisitColumns = createSiteVisitEvaluationColumns({
    onCreateEvaluation: handleCreateEvaluation,
    onViewEvaluation: handleViewEvaluation,
  });

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Supervision Evaluation Management</h1>
            <p className="text-gray-600 mt-1">
              Manage evaluations for approved supervision travel requests
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
              className="flex items-center gap-2"
            >
              <BarChart size={16} />
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Site Visits</p>
                  <p className="text-2xl font-bold">{stats.totalSiteVisits}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingEvaluations}</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgressEvaluations}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedEvaluations}</p>
                </div>
                <BarChart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Evaluations</p>
                  <p className="text-2xl font-bold">{stats.totalEvaluations}</p>
                </div>
                <Filter className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="site-visits" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Site Visits Needing Evaluation
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              All Evaluations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site-visits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Site Visits Requiring Evaluation</CardTitle>
                <p className="text-sm text-gray-600">
                  Approved supervision travel requests that need evaluation assessment
                </p>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={siteVisitColumns}
                  data={siteVisitsForEvaluation}
                  isLoading={isLoadingSiteVisits}
                  pagination={{
                    page: siteVisitParams.page || 1,
                    pageSize: siteVisitParams.page_size || 20,
                    total: siteVisitsData?.count || 0,
                    onPageChange: (page) => setSiteVisitParams(prev => ({ ...prev, page })),
                    onPageSizeChange: (pageSize) => setSiteVisitParams(prev => ({ ...prev, page_size: pageSize })),
                  }}
                  onSearch={(search) => setSiteVisitParams(prev => ({ ...prev, search, page: 1 }))}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Supervision Evaluations</CardTitle>
                <p className="text-sm text-gray-600">
                  Complete list of created supervision evaluations with their status
                </p>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={supervisionEvaluationColumns}
                  data={evaluations}
                  isLoading={isLoadingEvaluations}
                  pagination={{
                    page: evaluationParams.page || 1,
                    pageSize: evaluationParams.page_size || 20,
                    total: evaluationsData?.count || 0,
                    onPageChange: (page) => setEvaluationParams(prev => ({ ...prev, page })),
                    onPageSizeChange: (pageSize) => setEvaluationParams(prev => ({ ...prev, page_size: pageSize })),
                  }}
                  onSearch={(search) => setEvaluationParams(prev => ({ ...prev, search, page: 1 }))}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupervisionEvaluationPage;