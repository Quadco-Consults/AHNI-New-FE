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
import { FileBarChart, FileText, Calendar as CalendarIcon, Download, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";
import { useGeneralLedger } from "../hooks/useFinancialStatements";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { cn } from "@/lib/utils";

export default function GeneralLedgerPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  // Fetch all projects for dropdown
  const { data: projectsData } = useGetAllProjects({
    page: 1,
    size: 1000,
    search: "",
  });

  const { data, isLoading, error } = useGeneralLedger({
    start_date: startDate,
    end_date: endDate,
    account_id: accountId,
    project_id: projectId,
  });

  const exportToCSV = () => {
    if (!data?.transactions || data.transactions.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const headers = ["Date", "Reference", "Account Code", "Account Name", "Description", "Debit", "Credit", "Running Balance"];
      const csvContent = [
        headers.join(","),
        ...data.transactions.map((txn) =>
          [
            txn.date,
            txn.reference,
            txn.account_code,
            `"${txn.account_name}"`,
            `"${txn.description}"`,
            txn.debit || "",
            txn.credit || "",
            txn.running_balance,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `General_Ledger_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("General Ledger exported to CSV successfully!");
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
        <p className="ml-4">Loading General Ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading General Ledger</h2>
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
            <FileBarChart className="w-8 h-8" />
            General Ledger
          </h1>
          <p className="text-muted-foreground mt-1">
            {data?.account_name
              ? `${data.account_code} - ${data.account_name}`
              : "All Accounts"}
            {" | "}
            {format(startDate, "MMMM dd, yyyy")} - {format(endDate, "MMMM dd, yyyy")}
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

        <Select value={accountId || "ALL"} onValueChange={(val) => setAccountId(val === "ALL" ? undefined : val)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Accounts</SelectItem>
          </SelectContent>
        </Select>

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
            <CardTitle className="text-sm font-medium text-gray-600">Opening Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{data?.opening_balance?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Debits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ₦{data?.total_debits?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ₦{data?.total_credits?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Closing Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{data?.closing_balance?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Print Header - only show on print */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">AHNI (Action Health Incorporated)</h1>
        <h2 className="text-xl font-semibold mt-2">General Ledger</h2>
        <p className="text-gray-600 mt-1">
          {data?.account_name
            ? `${data.account_code} - ${data.account_name}`
            : "All Accounts"}
        </p>
        <p className="text-gray-600">
          {format(startDate, "MMMM dd, yyyy")} - {format(endDate, "MMMM dd, yyyy")}
        </p>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.transactions && data.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Opening Balance Row */}
                  {data.opening_balance !== 0 && (
                    <TableRow className="bg-blue-50 font-semibold">
                      <TableCell>{data.start_date}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell colSpan={2}>Opening Balance</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">
                        ₦{data.opening_balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Transaction Rows */}
                  {data.transactions.map((txn, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">
                        {format(new Date(txn.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{txn.reference}</TableCell>
                      <TableCell className="text-sm">
                        <div>{txn.account_code}</div>
                        <div className="text-gray-500 text-xs">{txn.account_name}</div>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate" title={txn.description}>
                        {txn.description}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-green-600">
                        {txn.debit > 0 ? `₦${txn.debit.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-red-600">
                        {txn.credit > 0 ? `₦${txn.credit.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        ₦{txn.running_balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Totals Row */}
                  <TableRow className="bg-gray-100 font-bold border-t-2">
                    <TableCell colSpan={4} className="text-right">TOTALS:</TableCell>
                    <TableCell className="text-right text-green-600">
                      ₦{data.total_debits.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      ₦{data.total_credits.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      ₦{data.closing_balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileBarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No transactions found for the selected period</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your date range or account filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Section */}
      {data?.transactions && data.transactions.length > 0 && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Period:</span>
              <span className="font-mono">
                {format(new Date(data.start_date), "dd/MM/yyyy")} - {format(new Date(data.end_date), "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Transactions:</span>
              <span className="font-mono">{data.transactions.length}</span>
            </div>
            <div className="flex justify-between text-lg border-t pt-2">
              <span className="font-medium">Opening Balance:</span>
              <span className="font-mono">
                ₦{data.opening_balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Debits:</span>
              <span className="font-mono text-green-600">
                ₦{data.total_debits.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Credits:</span>
              <span className="font-mono text-red-600">
                ₦{data.total_credits.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t-2 pt-2">
              <span>Closing Balance:</span>
              <span className="font-mono text-blue-900">
                ₦{data.closing_balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
