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
import { Download, FileText, Calendar as CalendarIcon, TrendingUp, TrendingDown, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";
import { useIncomeStatement } from "../hooks/useFinancialStatements";
import { cn } from "@/lib/utils";
import axiosInstance from "@/constants/api_management/MyHttpHelperWithToken";
import { RevenueExpensesPieChart, RevenueBreakdownChart, ExpensesBreakdownChart } from "../components/FinancialCharts";

export default function IncomeStatementPage() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), 0, 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  const { data, isLoading, error } = useIncomeStatement({
    start_date: startDate,
    end_date: endDate,
    project_id: projectId,
  });

  const exportToPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) {
        params.append("start_date", format(startDate, "yyyy-MM-dd"));
      }
      if (endDate) {
        params.append("end_date", format(endDate, "yyyy-MM-dd"));
      }
      if (projectId) {
        params.append("project_id", projectId);
      }

      const response = await axiosInstance.get(
        `/finance/financial-statements/income-statement/pdf/?${params.toString()}`,
        { responseType: "blob" }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Income_Statement_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Income Statement exported to PDF successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error(error);
    }
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
        <p className="ml-4">Loading Income Statement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Income Statement</h2>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const netSurplus = data?.net_surplus || 0;
  const totalRevenue = data?.total_revenue || 0;
  const margin = totalRevenue > 0 ? (netSurplus / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6 p-6 print:p-0">
      {/* Header - hide on print */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            {data?.statement_name || "Statement of Comprehensive Income"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {data?.period || `${format(startDate, "MMMM dd, yyyy")} to ${format(endDate, "MMMM dd, yyyy")}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download size={16} className="mr-2" />
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
      <div className="flex gap-4 print:hidden flex-wrap">
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
              From: {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
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
              To: {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
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
            {/* TODO: Add dynamic projects list */}
          </SelectContent>
        </Select>
      </div>

      {/* Performance Summary - hide on print */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₦{totalRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₦{(data?.total_expenses || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Surplus / (Deficit)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netSurplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₦{netSurplus.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {margin.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations - hide on print */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <RevenueExpensesPieChart data={data || {}} />
        <RevenueBreakdownChart data={data || {}} />
      </div>

      {data && (data.expenses?.accounts?.length || 0) > 0 && (
        <div className="print:hidden">
          <ExpensesBreakdownChart data={data} />
        </div>
      )}

      {/* Print Header - only show on print */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">AHNI (Action Health Incorporated)</h1>
        <h2 className="text-xl font-semibold mt-2">{data?.statement_name}</h2>
        <p className="text-gray-600 mt-1">{data?.period}</p>
      </div>

      {/* Revenue Section */}
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl text-green-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            REVENUE
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.revenue?.accounts && data.revenue.accounts.length > 0 ? (
            <>
              {data.revenue.accounts.map((account) => (
                <div
                  key={account.account_code}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">
                    {account.account_code} - {account.account_name}
                  </span>
                  <span className="font-mono font-semibold text-green-700">
                    {account.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-green-600 font-bold text-lg text-green-900 mt-4">
                <span>TOTAL REVENUE</span>
                <span className="font-mono">
                  ₦{totalRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No revenue recorded for this period</p>
          )}
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-2xl text-red-900 flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            EXPENSES
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.expenses?.accounts && data.expenses.accounts.length > 0 ? (
            <>
              {data.expenses.accounts.map((account) => (
                <div
                  key={account.account_code}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">
                    {account.account_code} - {account.account_name}
                  </span>
                  <span className="font-mono font-semibold text-red-700">
                    {account.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-red-600 font-bold text-lg text-red-900 mt-4">
                <span>TOTAL EXPENSES</span>
                <span className="font-mono">
                  ₦{(data.total_expenses || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No expenses recorded for this period</p>
          )}
        </CardContent>
      </Card>

      {/* Net Surplus / Deficit */}
      <Card className={netSurplus >= 0 ? "bg-green-50" : "bg-red-50"}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Revenue:</span>
              <span className="font-mono text-green-700">
                ₦{totalRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Expenses:</span>
              <span className="font-mono text-red-700">
                ₦{(data?.total_expenses || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`flex justify-between text-2xl font-bold border-t-2 pt-4 ${netSurplus >= 0 ? 'text-green-700 border-green-600' : 'text-red-700 border-red-600'}`}>
              <span>NET {netSurplus >= 0 ? 'SURPLUS' : 'DEFICIT'}:</span>
              <span className="font-mono">
                ₦{Math.abs(netSurplus).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {totalRevenue > 0 && (
              <div className="text-center text-sm text-gray-600">
                Profit Margin: {margin.toFixed(2)}% |
                {netSurplus >= 0 ? ' Surplus' : ' Deficit'} per ₦1 Revenue: ₦{(netSurplus / totalRevenue).toFixed(4)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NGO Note */}
      {Math.abs(netSurplus) < 1000 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <p className="text-sm text-blue-900">
              <strong>NGO Accounting Note:</strong> As an NGO, AHNI operates on a zero net surplus model where grant revenue equals expenses.
              The near-zero surplus indicates proper grant-based accounting where income recognition matches expenditure.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
