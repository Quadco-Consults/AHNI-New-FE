"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  DollarSign,
  Users,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";

// Import controllers
import {
  useGetPendingPayrolls,
  formatPayrollMonth,
  formatCurrency,
} from "@/features/finance/controllers/payrollPaymentController";

// Import dialogs
import ProcessPayrollPaymentDialog from "@/features/finance/components/payments/ProcessPayrollPaymentDialog";
import ViewPayrollDetailsDialog from "@/features/finance/components/payments/ViewPayrollDetailsDialog";

export default function PendingPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [showPayrollDialog, setShowPayrollDialog] = useState(false);
  const [viewPayrollId, setViewPayrollId] = useState<string>("");
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedFund, setSelectedFund] = useState<string>("all");

  // Fetch data
  const { data: payrollsData, isLoading: isLoadingPayrolls, refetch: refetchPayrolls } =
    useGetPendingPayrolls();

  const payrolls = payrollsData?.data
    ? payrollsData.data
    : [];

  // Filter payrolls
  const filteredPayrolls = payrolls.filter((p: any) => {
    // Filter by project
    if (selectedProject !== "all" && p.project?.id !== selectedProject) {
      return false;
    }
    // Filter by fund
    if (selectedFund !== "all" && p.fund_source !== selectedFund) {
      return false;
    }
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        p.month?.toLowerCase().includes(searchLower) ||
        p.project?.project_id?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Calculate summary statistics
  const totalPayrolls = filteredPayrolls.length;
  const totalPayrollsValue = filteredPayrolls.reduce(
    (sum: number, p: any) => sum + (p.total_net_payment || 0),
    0
  );
  const totalEmployees = filteredPayrolls.reduce(
    (sum: number, p: any) => sum + (p.total_employees || 0),
    0
  );

  // Handle view payroll
  const handleViewPayroll = (payroll: any) => {
    setViewPayrollId(payroll.id);
    setShowViewDialog(true);
  };

  // Handle process payroll
  const handleProcessPayroll = (payroll: any) => {
    setSelectedPayroll(payroll);
    setShowPayrollDialog(true);
  };

  // Payrolls columns
  const payrollColumns = [
    {
      header: "Period",
      accessorKey: "month",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{formatPayrollMonth(row.original.month)}</p>
          <p className="text-xs text-muted-foreground">Year {row.original.year}</p>
        </div>
      ),
    },
    {
      header: "Project",
      accessorKey: "project",
      cell: ({ row }: any) => (
        <div className="max-w-xs">
          {row.original.project ? (
            <>
              <p className="font-medium text-sm truncate">{row.original.project.project_id}</p>
              <p className="text-xs text-muted-foreground truncate">{row.original.project.title}</p>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      header: "Fund Source",
      accessorKey: "fund_source",
      cell: ({ row }: any) => (
        <div>
          {row.original.fund_source ? (
            <Badge variant="secondary" className="text-xs">{row.original.fund_source}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      header: "Employees",
      accessorKey: "total_employees",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.total_employees}</span>
        </div>
      ),
    },
    {
      header: "Gross",
      accessorKey: "total_gross_payment",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {formatCurrency(row.original.total_gross_payment)}
        </span>
      ),
    },
    {
      header: "Deductions",
      accessorKey: "total_deductions",
      cell: ({ row }: any) => (
        <span className="text-sm text-red-600">
          -{formatCurrency(row.original.total_deductions)}
        </span>
      ),
    },
    {
      header: "Net Payment",
      accessorKey: "total_net_payment",
      cell: ({ row }: any) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.original.total_net_payment)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => (
        <Badge variant="warning">{row.original.status}</Badge>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewPayroll(row.original)}
          >
            View
          </Button>
          <Button
            size="sm"
            onClick={() => handleProcessPayroll(row.original)}
          >
            Process Payment
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Payroll Payments</h1>
          <p className="text-muted-foreground">
            Process approved payroll batches from HR
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetchPayrolls();
            toast.success("Data refreshed");
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payroll Batches
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayrolls}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Across all batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₦{totalPayrollsValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Net payment amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">
              Approved Payrolls ({totalPayrolls})
            </h2>

            <div className="flex items-center gap-2">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {/* Projects will be populated from payroll data */}
                  {Array.from(new Set(payrolls.filter((p: any) => p.project).map((p: any) => p.project.id))).map((projectId: any) => {
                    const payroll = payrolls.find((p: any) => p.project?.id === projectId);
                    return payroll?.project ? (
                      <SelectItem key={projectId} value={projectId}>
                        {payroll.project.project_id}
                      </SelectItem>
                    ) : null;
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedFund} onValueChange={setSelectedFund}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Funds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Funds</SelectItem>
                  <SelectItem value="GF">Global Fund</SelectItem>
                  <SelectItem value="USAID">USAID</SelectItem>
                  <SelectItem value="CORE">Core Funds</SelectItem>
                  <SelectItem value="GOV">Government</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {isLoadingPayrolls ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPayrolls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No pending payrolls</h3>
              <p className="text-sm text-muted-foreground">
                {payrolls.length === 0
                  ? "All payrolls have been processed"
                  : "No payrolls match the selected filters"}
              </p>
            </div>
          ) : (
            <DataTable
              columns={payrollColumns}
              data={filteredPayrolls}
              searchPlaceholder="Search payrolls..."
            />
          )}
        </div>
      </Card>

      {/* View Payroll Dialog */}
      {viewPayrollId && (
        <ViewPayrollDetailsDialog
          open={showViewDialog}
          onClose={() => {
            setShowViewDialog(false);
            setViewPayrollId("");
          }}
          payrollId={viewPayrollId}
        />
      )}

      {/* Process Payment Dialog */}
      {selectedPayroll && (
        <ProcessPayrollPaymentDialog
          open={showPayrollDialog}
          onClose={() => {
            setShowPayrollDialog(false);
            setSelectedPayroll(null);
          }}
          payroll={selectedPayroll}
          onSuccess={() => {
            refetchPayrolls();
            toast.success("Payroll payment processed successfully!");
          }}
        />
      )}
    </div>
  );
}
