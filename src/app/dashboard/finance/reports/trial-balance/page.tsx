"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar as CalendarIcon, Download, Printer, FileText, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTrialBalance } from "../hooks/useFinancialStatements";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function TrialBalancePage() {
  const [asOfDate, setAsOfDate] = useState<Date>(new Date());
  const [projectId, setProjectId] = useState<string | undefined>();
  const [includeInactive, setIncludeInactive] = useState(false);

  const { data: trialBalance, isLoading, error } = useTrialBalance({
    as_of_date: asOfDate,
    project_id: projectId,
    include_inactive: includeInactive,
  });

  // Debug error details
  if (error) {
    console.error("Trial Balance Error Details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      fullError: error,
    });
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!trialBalance) return;

    const csvContent = [
      ["Account Code", "Account Name", "Account Type", "Debit Balance", "Credit Balance"],
      ...trialBalance.accounts.map((acc) => [
        acc.account_code,
        acc.account_name,
        acc.account_type,
        acc.debit_balance.toFixed(2),
        acc.credit_balance.toFixed(2),
      ]),
      ["", "", "TOTALS", trialBalance.total_debits.toFixed(2), trialBalance.total_credits.toFixed(2)],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-balance-${format(asOfDate, "yyyy-MM-dd")}.csv`;
    a.click();
  };

  // Prepare chart data
  const accountTypeData = trialBalance?.accounts.reduce((acc, account) => {
    const existing = acc.find((item) => item.name === account.account_type);
    const balance = account.debit_balance > 0 ? account.debit_balance : account.credit_balance;

    if (existing) {
      existing.value += balance;
    } else {
      acc.push({ name: account.account_type, value: balance });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Trial Balance
          </h1>
          <p className="text-gray-600 mt-2">
            Detailed listing of all account balances as of {format(asOfDate, "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" disabled={!trialBalance}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handlePrint} variant="outline" disabled={!trialBalance}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select date and options for the trial balance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* As of Date */}
            <div className="space-y-2">
              <Label>As of Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
            </div>

            {/* Include Inactive Accounts */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-inactive"
                checked={includeInactive}
                onCheckedChange={(checked) => setIncludeInactive(checked as boolean)}
              />
              <Label
                htmlFor="include-inactive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include inactive accounts with zero balance
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Loading trial balance...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">Error loading trial balance</div>
            <div className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</div>
            <div className="text-xs mt-2 opacity-75">Check the browser console for more details.</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Trial Balance Data */}
      {trialBalance && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Debits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ₦{trialBalance.total_debits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₦{trialBalance.total_credits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Difference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  trialBalance.is_balanced ? "text-green-600" : "text-red-600"
                )}>
                  ₦{Math.abs(trialBalance.difference).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Balance Status</CardTitle>
              </CardHeader>
              <CardContent>
                {trialBalance.is_balanced ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Balanced
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Out of Balance
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
            {/* Account Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Account Type Distribution</CardTitle>
                <CardDescription>Balance by account type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={accountTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accountTypeData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Debit vs Credit by Account Type */}
            <Card>
              <CardHeader>
                <CardTitle>Debit vs Credit by Account Type</CardTitle>
                <CardDescription>Comparison of debit and credit balances</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Array.from(
                      trialBalance.accounts.reduce((acc, account) => {
                        const existing = acc.get(account.account_type) || { name: account.account_type, debits: 0, credits: 0 };
                        existing.debits += account.debit_balance;
                        existing.credits += account.credit_balance;
                        acc.set(account.account_type, existing);
                        return acc;
                      }, new Map<string, { name: string; debits: number; credits: number }>()).values()
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey="debits" fill="#3b82f6" name="Debits" />
                    <Bar dataKey="credits" fill="#10b981" name="Credits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Trial Balance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Trial Balance Detail</CardTitle>
              <CardDescription>
                As of {format(new Date(trialBalance.as_of_date), "MMMM dd, yyyy")}
                {trialBalance.project && ` • Project: ${trialBalance.project}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead className="text-center">Account Type</TableHead>
                      <TableHead className="text-right">Debit Balance</TableHead>
                      <TableHead className="text-right">Credit Balance</TableHead>
                      <TableHead className="text-center print:hidden">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trialBalance.accounts.map((account, index) => (
                      <TableRow key={index} className={!account.is_active ? "text-gray-400" : ""}>
                        <TableCell className="font-mono">{account.account_code}</TableCell>
                        <TableCell className="font-medium">{account.account_name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{account.account_type}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {account.debit_balance > 0
                            ? `₦${account.debit_balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {account.credit_balance > 0
                            ? `₦${account.credit_balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-center print:hidden">
                          {account.is_active ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals Row */}
                    <TableRow className="bg-gray-50 font-bold">
                      <TableCell colSpan={3} className="text-right">
                        TOTALS
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ₦{trialBalance.total_debits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ₦{trialBalance.total_credits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="print:hidden"></TableCell>
                    </TableRow>
                    {!trialBalance.is_balanced && (
                      <TableRow className="bg-red-50 font-bold text-red-600">
                        <TableCell colSpan={3} className="text-right">
                          DIFFERENCE (OUT OF BALANCE)
                        </TableCell>
                        <TableCell colSpan={3} className="text-right font-mono">
                          ₦{Math.abs(trialBalance.difference).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Print Header (only visible when printing) */}
          <div className="hidden print:block">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Trial Balance</h1>
              <p className="text-gray-600">
                As of {format(new Date(trialBalance.as_of_date), "MMMM dd, yyyy")}
              </p>
              {trialBalance.project && <p className="text-gray-600">Project: {trialBalance.project}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
