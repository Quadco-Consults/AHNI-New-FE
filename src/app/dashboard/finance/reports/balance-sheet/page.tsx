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
import { Download, FileText, Calendar as CalendarIcon, Building2, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";
import { useBalanceSheet } from "../hooks/useFinancialStatements";
import { cn } from "@/lib/utils";
import axiosInstance from "@/constants/api_management/MyHttpHelperWithToken";
import { BalanceSheetPieChart, AssetsBreakdownChart, LiabilitiesEquityChart } from "../components/FinancialCharts";

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState<Date>(new Date());
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  const { data, isLoading, error } = useBalanceSheet({
    as_of_date: asOfDate,
    project_id: projectId,
  });

  const exportToPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (asOfDate) {
        params.append("as_of_date", format(asOfDate, "yyyy-MM-dd"));
      }
      if (projectId) {
        params.append("project_id", projectId);
      }

      const response = await axiosInstance.get(
        `/finance/financial-statements/balance-sheet/pdf/?${params.toString()}`,
        { responseType: "blob" }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Balance_Sheet_${format(asOfDate, "yyyy-MM-dd")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Balance Sheet exported to PDF successfully!");
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
        <p className="ml-4">Loading Balance Sheet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Balance Sheet</h2>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 print:p-0">
      {/* Header - hide on print */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            {data?.statement_name || "Statement of Financial Position"}
          </h1>
          <p className="text-muted-foreground mt-1">
            As of {data?.as_of_date || format(asOfDate, "MMMM dd, yyyy")}
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
      <div className="flex gap-4 print:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !asOfDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {asOfDate ? format(asOfDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={asOfDate}
              onSelect={(date) => date && setAsOfDate(date)}
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

      {/* Balance Status */}
      {data?.is_balanced !== undefined && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${data.is_balanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} print:hidden`}>
          {data.is_balanced ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Balance Sheet is balanced</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Warning: Balance Sheet is not balanced!</span>
            </>
          )}
        </div>
      )}

      {/* Visualizations - hide on print */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <BalanceSheetPieChart data={data || {}} />
        <AssetsBreakdownChart data={data || {}} />
      </div>

      {data && (data.liabilities?.accounts?.length || 0) > 0 && (
        <div className="print:hidden">
          <LiabilitiesEquityChart data={data} />
        </div>
      )}

      {/* Print Header - only show on print */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">AHNI (Action Health Incorporated)</h1>
        <h2 className="text-xl font-semibold mt-2">{data?.statement_name}</h2>
        <p className="text-gray-600 mt-1">As of {data?.as_of_date}</p>
      </div>

      {/* Assets */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl text-blue-900">ASSETS</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.assets?.accounts && data.assets.accounts.length > 0 ? (
            <>
              {data.assets.accounts.map((account) => (
                <div
                  key={account.account_code}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">
                    {account.account_code} - {account.account_name}
                  </span>
                  <span className="font-mono font-semibold">
                    {account.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-blue-600 font-bold text-lg text-blue-900 mt-4">
                <span>TOTAL ASSETS</span>
                <span className="font-mono">
                  ₦{data.total_assets?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No asset accounts with balances</p>
          )}
        </CardContent>
      </Card>

      {/* Liabilities */}
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-2xl text-red-900">LIABILITIES</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.liabilities?.accounts && data.liabilities.accounts.length > 0 ? (
            <>
              {data.liabilities.accounts.map((account) => (
                <div
                  key={account.account_code}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">
                    {account.account_code} - {account.account_name}
                  </span>
                  <span className="font-mono font-semibold">
                    {account.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-red-600 font-bold text-lg text-red-900 mt-4">
                <span>TOTAL LIABILITIES</span>
                <span className="font-mono">
                  ₦{data.total_liabilities?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No liability accounts with balances</p>
          )}
        </CardContent>
      </Card>

      {/* Net Assets / Equity */}
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl text-green-900">NET ASSETS (EQUITY)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.equity?.accounts && data.equity.accounts.length > 0 ? (
            <>
              {data.equity.accounts.map((account) => (
                <div
                  key={account.account_code}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-gray-700">
                    {account.account_code} - {account.account_name}
                  </span>
                  <span className="font-mono font-semibold">
                    {account.formatted}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 border-t-2 border-green-600 font-bold text-lg text-green-900 mt-4">
                <span>TOTAL NET ASSETS</span>
                <span className="font-mono">
                  ₦{data.total_equity?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No equity accounts with balances</p>
          )}
        </CardContent>
      </Card>

      {/* Balance Check Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Assets:</span>
              <span className="font-mono">
                ₦{data?.total_assets?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Liabilities + Equity:</span>
              <span className="font-mono">
                ₦{((data?.total_liabilities || 0) + (data?.total_equity || 0)).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
              <span>Difference:</span>
              <span className={`font-mono ${data?.is_balanced ? 'text-green-600' : 'text-red-600'}`}>
                ₦{((data?.total_assets || 0) - ((data?.total_liabilities || 0) + (data?.total_equity || 0))).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
