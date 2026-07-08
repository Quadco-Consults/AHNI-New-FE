"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Download,
  FileText,
  Calendar as CalendarIcon,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Users,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";
import { cn } from "@/lib/utils";
import axiosInstance from "@/constants/api_management/MyHttpHelperWithToken";

export default function DonorReportPage() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), 0, 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedProject, setSelectedProject] = useState<string>("");

  // Fetch projects list
  const { data: projectsData } = useQuery({
    queryKey: ["projects-for-reports"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/finance/reports/projects-list/"
      );
      return response.data;
    },
  });

  // Fetch donor report
  const {
    data: reportData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["donor-report", selectedProject, startDate, endDate],
    queryFn: async () => {
      if (!selectedProject) return null;

      const params = new URLSearchParams({
        project_id: selectedProject,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      });

      const response = await axiosInstance.get(
        `/finance/reports/donor-monthly-report/?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!selectedProject,
  });

  const exportToPDF = async () => {
    if (!selectedProject) {
      toast.error("Please select a project first");
      return;
    }

    try {
      const params = new URLSearchParams({
        project_id: selectedProject,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      });

      const response = await axiosInstance.get(
        `/finance/reports/donor-monthly-report/pdf/?${params.toString()}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Donor_Report_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Donor report exported to PDF successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error(error);
    }
  };

  const printReport = () => {
    window.print();
  };

  if (!selectedProject) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            Donor Financial Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Project-specific financial summaries for donors
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select a Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a project to generate report" />
              </SelectTrigger>
              <SelectContent>
                {projectsData?.projects?.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.project_id} - {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="ml-4">Loading donor report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Report</h2>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const projectInfo = reportData?.project_information;
  const executiveSummary = reportData?.executive_summary;
  const financialMetrics = reportData?.financial_metrics;

  return (
    <div className="space-y-6 p-6 print:p-0">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            Donor Financial Report
          </h1>
          <p className="text-muted-foreground mt-1">
            {projectInfo?.project_name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <FileText size={16} className="mr-2" />
            PDF
          </Button>
          <Button onClick={printReport}>Print</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap print:hidden">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            {projectsData?.projects?.map((project: any) => (
              <SelectItem key={project.id} value={project.id}>
                {project.project_id} - {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              From: {startDate ? format(startDate, "PPP") : <span>Start</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              To: {endDate ? format(endDate, "PPP") : <span>End</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">AHNI (Action Health Incorporated)</h1>
        <h2 className="text-xl font-semibold mt-2">{reportData?.report_type}</h2>
        <p className="text-gray-600 mt-1">{reportData?.report_date}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Award
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₦{executiveSummary?.total_award?.toLocaleString("en-NG")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Funds Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₦{executiveSummary?.funds_spent?.toLocaleString("en-NG")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {executiveSummary?.utilization_rate?.toFixed(1)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Remaining Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₦{executiveSummary?.remaining_balance?.toLocaleString("en-NG")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Project Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-bold ${
              executiveSummary?.project_health === "On Track" ? "text-green-600" :
              executiveSummary?.project_health?.includes("High") ? "text-orange-600" :
              "text-red-600"
            }`}>
              {executiveSummary?.project_health}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Reporting Period</h3>
              <p className="text-sm text-gray-600">
                {executiveSummary?.period_covered}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Financial Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Revenue Recognized:</span>
                  <span className="font-mono">
                    ₦{executiveSummary?.revenue_recognized?.toLocaleString("en-NG")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expenses Incurred:</span>
                  <span className="font-mono">
                    ₦{executiveSummary?.expenses_incurred?.toLocaleString("en-NG")}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Net Position:</span>
                  <span className="font-mono">
                    ₦{executiveSummary?.net_position?.toLocaleString("en-NG")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Obligations</h4>
              <p className="text-2xl font-bold">
                ₦{financialMetrics?.total_obligations?.toLocaleString("en-NG")}
              </p>
              <p className="text-sm text-gray-600">
                {financialMetrics?.obligation_rate}% of total award
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Disbursements</h4>
              <p className="text-2xl font-bold">
                ₦{financialMetrics?.total_disbursements?.toLocaleString("en-NG")}
              </p>
              <p className="text-sm text-gray-600">
                {financialMetrics?.disbursement_rate}% of total award
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Expenditures</h4>
              <p className="text-2xl font-bold">
                ₦{financialMetrics?.total_expenditures?.toLocaleString("en-NG")}
              </p>
              <p className="text-sm text-gray-600">
                {financialMetrics?.expenditure_rate}% of total award
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donor Information */}
      {reportData?.donor_information && reportData.donor_information.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Donor Information</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.donor_information.map((donor: any, index: number) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-semibold">{donor.name}</h4>
                {donor.contact_person && (
                  <p className="text-sm text-gray-600">
                    Contact: {donor.contact_person}
                  </p>
                )}
                {donor.email && (
                  <p className="text-sm text-gray-600">Email: {donor.email}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Note */}
      <Card className="bg-blue-50 border-blue-200 print:break-before-page">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-900">
            <strong>Report Generated:</strong> {reportData?.report_date}
            <br />
            <strong>System:</strong> AHNI ERP Financial Management System
            <br />
            This report provides a comprehensive financial summary for the specified project and period.
            For detailed financial statements, please refer to the Balance Sheet and Income Statement sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
