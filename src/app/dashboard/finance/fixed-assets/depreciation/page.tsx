"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Play,
  Calendar,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import {
  useGetDepreciationRuns,
  useRunDepreciation,
} from "@/features/finance/controllers/fixedAssetController";

export default function DepreciationDashboardPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [runConfig, setRunConfig] = useState({
    year: currentYear,
    month: currentMonth,
    auto_post: false,
  });
  const [filterYear, setFilterYear] = useState<number | undefined>(undefined);
  const [filterMonth, setFilterMonth] = useState<number | undefined>(undefined);

  // Fetch depreciation runs
  const { data: runsData, isLoading } = useGetDepreciationRuns({
    year: filterYear,
    month: filterMonth,
    page: 1,
    page_size: 50,
  });

  // Run depreciation mutation
  const runDepreciationMutation = useRunDepreciation();

  const runs = runsData?.results || [];

  const handleRunDepreciation = async () => {
    try {
      await runDepreciationMutation.mutateAsync(runConfig);
      setIsRunDialogOpen(false);
      // Reset to current month
      setRunConfig({
        year: currentYear,
        month: currentMonth,
        auto_post: false,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatCurrency = (amount: string) => {
    const value = parseFloat(amount);
    return `₦${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      COMPLETED: {
        label: "Completed",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      PENDING: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
      },
      IN_PROGRESS: {
        label: "In Progress",
        className: "bg-blue-100 text-blue-800",
        icon: Play,
      },
      FAILED: {
        label: "Failed",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Generate year options (current year ± 2 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Generate month options
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Calculate summary from runs
  const summary = runs.reduce(
    (acc, run) => {
      if (run.status === "COMPLETED") {
        acc.completedRuns += 1;
        acc.totalAssetsProcessed += run.total_assets_processed;
        acc.totalDepreciation += parseFloat(run.total_depreciation_amount);
      } else if (run.status === "FAILED") {
        acc.failedRuns += 1;
      }
      return acc;
    },
    {
      completedRuns: 0,
      failedRuns: 0,
      totalAssetsProcessed: 0,
      totalDepreciation: 0,
    }
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/finance/fixed-assets">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assets
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Depreciation Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Run and manage monthly asset depreciation
            </p>
          </div>
        </div>
        <Button onClick={() => setIsRunDialogOpen(true)}>
          <Play className="w-4 h-4 mr-2" />
          Run Depreciation
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Runs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completedRuns}</div>
            <p className="text-xs text-muted-foreground">
              Total successful runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalAssetsProcessed}</div>
            <p className="text-xs text-muted-foreground">
              Across all runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalDepreciation.toString())}
            </div>
            <p className="text-xs text-muted-foreground">
              All completed runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Runs</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.failedRuns}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Year</Label>
              <Select
                value={filterYear?.toString() || "all"}
                onValueChange={(value) =>
                  setFilterYear(value === "all" ? undefined : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Month</Label>
              <Select
                value={filterMonth?.toString() || "all"}
                onValueChange={(value) =>
                  setFilterMonth(value === "all" ? undefined : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(filterYear || filterMonth) && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterYear(undefined);
                    setFilterMonth(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Depreciation Runs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Depreciation Runs History</CardTitle>
          <CardDescription>
            All depreciation batch runs with their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading depreciation runs...</p>
              </div>
            </div>
          ) : runs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No depreciation runs found</p>
              <p className="text-sm text-gray-500 mt-2">
                Click "Run Depreciation" to create your first run
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Run Date</TableHead>
                  <TableHead className="text-right">Assets Processed</TableHead>
                  <TableHead className="text-right">Total Depreciation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Run By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">
                      {monthOptions.find((m) => m.value === run.period_month)?.label}{" "}
                      {run.period_year}
                    </TableCell>
                    <TableCell>
                      {format(new Date(run.run_date), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      {run.total_assets_processed}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(run.total_depreciation_amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(run.status)}</TableCell>
                    <TableCell>{run.created_by_name || "System"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/finance/fixed-assets/depreciation/${run.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Run Depreciation Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Monthly Depreciation</DialogTitle>
            <DialogDescription>
              Calculate and optionally post depreciation for all active assets for a specific period.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="run_year">Year</Label>
                <Select
                  value={runConfig.year.toString()}
                  onValueChange={(value) =>
                    setRunConfig({ ...runConfig, year: parseInt(value) })
                  }
                >
                  <SelectTrigger id="run_year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="run_month">Month</Label>
                <Select
                  value={runConfig.month.toString()}
                  onValueChange={(value) =>
                    setRunConfig({ ...runConfig, month: parseInt(value) })
                  }
                >
                  <SelectTrigger id="run_month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto_post"
                checked={runConfig.auto_post}
                onCheckedChange={(checked) =>
                  setRunConfig({ ...runConfig, auto_post: checked as boolean })
                }
              />
              <label
                htmlFor="auto_post"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Automatically post depreciation to journal
              </label>
            </div>
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Note</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This will process all active assets with auto-depreciation enabled.
                      {runConfig.auto_post
                        ? " Journal entries will be created and posted automatically."
                        : " You can post journal entries manually later."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRunDialogOpen(false)}
              disabled={runDepreciationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRunDepreciation}
              disabled={runDepreciationMutation.isPending}
            >
              {runDepreciationMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Depreciation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
