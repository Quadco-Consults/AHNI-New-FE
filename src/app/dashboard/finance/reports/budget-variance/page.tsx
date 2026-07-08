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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Calendar as CalendarIcon, Download, TrendingUp, TrendingDown, Target, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";
import { useBudgetVariance } from "../hooks/useFinancialStatements";
import { cn } from "@/lib/utils";

export default function BudgetVariancePage() {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [periodType, setPeriodType] = useState<"monthly" | "quarterly" | "annual">("monthly");

  const { data, isLoading, error } = useBudgetVariance({
    start_date: startDate,
    end_date: endDate,
    project_id: projectId,
    period_type: periodType,
  });

  const exportToCSV = () => {
    if (!data?.accounts || data.accounts.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const headers = ["Account Code", "Account Name", "Budgeted Amount", "Actual Amount", "Variance", "Variance %", "Status"];
      const csvContent = [
        headers.join(","),
        ...data.accounts.map((acc) =>
          [
            acc.account_code,
            `"${acc.account_name}"`,
            acc.budgeted_amount,
            acc.actual_amount,
            acc.variance,
            acc.variance_percent,
            acc.is_favorable ? "Favorable" : "Unfavorable",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Budget_Variance_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Budget Variance exported to CSV successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
      console.error(error);
    }
  };

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
        <p className="ml-4">Loading Budget Variance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Budget Variance</h2>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const favorableAccounts = data?.accounts?.filter((acc) => acc.is_favorable) || [];
  const unfavorableAccounts = data?.accounts?.filter((acc) => !acc.is_favorable) || [];

  return (
    <div className="space-y-6 p-6 print:p-0">
      {/* Header - hide on print */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Budget Variance Report
          </h1>
          <p className="text-muted-foreground mt-1">
            {data?.period || `${format(startDate, "MMMM dd, yyyy")} - ${format(endDate, "MMMM dd, yyyy")}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download size={16} className="mr-2" />
            CSV
          </Button>
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
      <div className="flex gap-4 flex-wrap print:hidden">
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

        <Select value={periodType} onValueChange={(val) => setPeriodType(val as "monthly" | "quarterly" | "annual")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Period Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={projectId || "ALL"} onValueChange={(val) => setProjectId(val === "ALL" ? undefined : val)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Projects</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{data?.total_budget?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{data?.total_actual?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${(data?.total_variance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(data?.total_variance || 0) >= 0 ? '+' : ''}₦{data?.total_variance?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Variance %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {(data?.variance_percent || 0) >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
              <p className={`text-2xl font-bold ${(data?.variance_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data?.variance_percent?.toFixed(2) || "0.00"}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Favorable Variances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-900">{favorableAccounts.length}</p>
            <p className="text-sm text-green-700 mt-1">Accounts under budget</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Unfavorable Variances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-900">{unfavorableAccounts.length}</p>
            <p className="text-sm text-red-700 mt-1">Accounts over budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Print Header - only show on print */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">AHNI (Action Health Incorporated)</h1>
        <h2 className="text-xl font-semibold mt-2">Budget Variance Report</h2>
        <p className="text-gray-600 mt-1">{data?.period}</p>
      </div>

      {/* Variance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.accounts && data.accounts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Variance %</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.accounts.map((account, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>{account.account_code}</div>
                        <div className="text-gray-500 text-sm">{account.account_name}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ₦{account.budgeted_amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ₦{account.actual_amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-semibold ${account.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {account.variance >= 0 ? '+' : ''}₦{account.variance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-semibold ${account.variance_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {account.variance_percent >= 0 ? '+' : ''}{account.variance_percent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={account.is_favorable ? "default" : "destructive"} className={account.is_favorable ? "bg-green-600" : "bg-red-600"}>
                          {account.is_favorable ? (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Favorable
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" />
                              Unfavorable
                            </span>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Totals Row */}
                  <TableRow className="bg-gray-100 font-bold border-t-2">
                    <TableCell>TOTALS</TableCell>
                    <TableCell className="text-right">
                      ₦{data.total_budget.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      ₦{data.total_actual.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={`text-right ${data.total_variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.total_variance >= 0 ? '+' : ''}₦{data.total_variance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={`text-right ${data.variance_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.variance_percent >= 0 ? '+' : ''}{data.variance_percent.toFixed(2)}%
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No budget variance data available</p>
              <p className="text-gray-400 text-sm mt-2">Ensure budgets are set for the selected period</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Notes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Variance Analysis Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900">
          <p>
            <strong>Favorable Variance:</strong> When actual spending is less than budgeted (positive variance), indicating efficient use of resources.
          </p>
          <p>
            <strong>Unfavorable Variance:</strong> When actual spending exceeds the budget (negative variance), which may require management attention and corrective action.
          </p>
          <p>
            <strong>NGO Context:</strong> For revenue accounts, favorable variance means more income than budgeted. For expense accounts, favorable variance means less spending than budgeted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
