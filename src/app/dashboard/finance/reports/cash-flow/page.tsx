"use client";

import { useState } from "react";
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
import { TrendingUp, FileText, Calendar as CalendarIcon, ArrowDownCircle, ArrowUpCircle, Activity, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";
import { useCashFlowStatement } from "../hooks/useFinancialStatements";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { cn } from "@/lib/utils";

export default function CashFlowPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  // Fetch all projects for dropdown
  const { data: projectsData } = useGetAllProjects({
    page: 1,
    size: 1000,
    search: "",
  });

  const { data, isLoading, error } = useCashFlowStatement({
    start_date: startDate,
    end_date: endDate,
    project_id: projectId,
  });

  const exportToPDF = () => {
    toast.info("PDF export feature coming soon!");
  };

  const exportToExcel = () => {
    toast.info("Excel export feature coming soon!");
  };

  const printReport = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="ml-4">Loading Cash Flow Statement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Cash Flow Statement</h2>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const netCashChange = data?.net_change || 0;
  const isPositiveCashFlow = netCashChange >= 0;

  return (
    <div className="space-y-6 p-6 print:p-0">
      {/* Header - hide on print */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            {data?.statement_name || "Cash Flow Statement"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {data?.period || `${format(startDate, "MMMM dd, yyyy")} - ${format(endDate, "MMMM dd, yyyy")}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <FileText size={16} className="mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <FileText size={16} className="mr-2" />
            PDF
          </Button>
          <Button onClick={printReport}>Print</Button>
        </div>
      </div>

      {/* Filters - hide on print */}
      <div className="flex gap-4 print:hidden">
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
              From: {startDate ? format(startDate, "PPP") : "Pick start date"}
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
              To: {endDate ? format(endDate, "PPP") : "Pick end date"}
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

        <Select value={projectId || "ALL"} onValueChange={(val) => setProjectId(val === "ALL" ? undefined : val)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Projects</SelectItem>
            {projectsData?.data?.results?.map((project: any) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Opening Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{data?.opening_cash?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Net Cash Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${isPositiveCashFlow ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveCashFlow ? '+' : ''}₦{netCashChange?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Closing Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{data?.closing_cash?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Cash Flow Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isPositiveCashFlow ? (
                <ArrowUpCircle className="w-6 h-6 text-green-600" />
              ) : (
                <ArrowDownCircle className="w-6 h-6 text-red-600" />
              )}
              <p className={`text-2xl font-bold ${isPositiveCashFlow ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveCashFlow ? 'Positive' : 'Negative'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Header - only show on print */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">AHNI (Action Health Incorporated)</h1>
        <h2 className="text-xl font-semibold mt-2">{data?.statement_name}</h2>
        <p className="text-gray-600 mt-1">{data?.period}</p>
      </div>

      {/* Opening Cash Balance */}
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-blue-900">Cash at Beginning of Period</span>
            <span className="text-xl font-bold font-mono text-blue-900">
              ₦{data?.opening_cash?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Operating Activities */}
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl text-green-900 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            CASH FROM OPERATING ACTIVITIES
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.operating_activities?.activities && data.operating_activities.activities.length > 0 ? (
            <>
              {data.operating_activities.activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">{activity.description}</span>
                  <span className={`font-mono font-semibold ${activity.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.amount >= 0 ? '+' : ''}{activity.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-green-600 font-bold text-lg text-green-900 mt-4">
                <span>Net Cash from Operating Activities</span>
                <span className="font-mono">
                  {data.operating_activities.total >= 0 ? '+' : ''}₦{data.operating_activities.total?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No operating activities recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Investing Activities */}
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
            <ArrowDownCircle className="w-6 h-6" />
            CASH FROM INVESTING ACTIVITIES
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.investing_activities?.activities && data.investing_activities.activities.length > 0 ? (
            <>
              {data.investing_activities.activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">{activity.description}</span>
                  <span className={`font-mono font-semibold ${activity.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.amount >= 0 ? '+' : ''}{activity.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-purple-600 font-bold text-lg text-purple-900 mt-4">
                <span>Net Cash from Investing Activities</span>
                <span className="font-mono">
                  {data.investing_activities.total >= 0 ? '+' : ''}₦{data.investing_activities.total?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No investing activities recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Financing Activities */}
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-2xl text-orange-900 flex items-center gap-2">
            <ArrowUpCircle className="w-6 h-6" />
            CASH FROM FINANCING ACTIVITIES
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.financing_activities?.activities && data.financing_activities.activities.length > 0 ? (
            <>
              {data.financing_activities.activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">{activity.description}</span>
                  <span className={`font-mono font-semibold ${activity.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.amount >= 0 ? '+' : ''}{activity.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-orange-600 font-bold text-lg text-orange-900 mt-4">
                <span>Net Cash from Financing Activities</span>
                <span className="font-mono">
                  {data.financing_activities.total >= 0 ? '+' : ''}₦{data.financing_activities.total?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No financing activities recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Net Change and Closing Balance */}
      <Card className="bg-gray-50 border-2">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between text-lg">
            <span className="font-medium">Net Cash from Operating Activities:</span>
            <span className="font-mono">
              ₦{data?.operating_activities?.total?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-medium">Net Cash from Investing Activities:</span>
            <span className="font-mono">
              ₦{data?.investing_activities?.total?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-medium">Net Cash from Financing Activities:</span>
            <span className="font-mono">
              ₦{data?.financing_activities?.total?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t-2 border-gray-400 pt-4">
            <span>Net Increase/(Decrease) in Cash:</span>
            <span className={`font-mono ${isPositiveCashFlow ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveCashFlow ? '+' : ''}₦{netCashChange?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-medium">Cash at Beginning of Period:</span>
            <span className="font-mono">
              ₦{data?.opening_cash?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t-4 border-blue-600 pt-4">
            <span className="text-blue-900">Cash at End of Period:</span>
            <span className="font-mono text-blue-900">
              ₦{data?.closing_cash?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* NGO Note */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-900">
            <strong>Note for NGO Operations:</strong> This cash flow statement categorizes all cash movements into operating, investing, and financing activities to provide a clear picture of how cash is generated and used in the organization's mission and programs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
