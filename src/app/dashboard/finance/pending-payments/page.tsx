"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  DollarSign,
  Users,
  FileText,
  CreditCard,
  Calendar,
  Building2,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";

// Import controllers
import {
  useGetPendingPaymentRequests,
  formatCurrencyAmount,
} from "@/features/finance/controllers/paymentDisbursementController";
import {
  useGetPendingPayrolls,
  formatPayrollMonth,
  formatCurrency,
  getProjectAllocationSummary,
} from "@/features/finance/controllers/payrollPaymentController";

// Import dialogs
import ProcessPaymentRequestDialog from "@/features/finance/components/payments/ProcessPaymentRequestDialog";
import ProcessPayrollPaymentDialog from "@/features/finance/components/payments/ProcessPayrollPaymentDialog";

export default function PendingPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("payment-requests");
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<any>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [showPaymentRequestDialog, setShowPaymentRequestDialog] = useState(false);
  const [showPayrollDialog, setShowPayrollDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedFund, setSelectedFund] = useState<string>("all");

  // Fetch data
  const { data: paymentRequestsData, isLoading: isLoadingPaymentRequests, refetch: refetchPaymentRequests } =
    useGetPendingPaymentRequests();
  const { data: payrollsData, isLoading: isLoadingPayrolls, refetch: refetchPayrolls } =
    useGetPendingPayrolls();

  const paymentRequests = Array.isArray(paymentRequestsData?.data)
    ? paymentRequestsData.data
    : [];
  const payrolls = Array.isArray(payrollsData?.data)
    ? payrollsData.data
    : [];

  // Filter payment requests
  const filteredPaymentRequests = paymentRequests.filter((pr: any) => {
    // Filter by project
    if (selectedProject !== "all" && pr.project?.id !== selectedProject) {
      return false;
    }
    // Filter by fund
    if (selectedFund !== "all" && pr.fund_source !== selectedFund) {
      return false;
    }
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        pr.payment_reason?.toLowerCase().includes(searchLower) ||
        pr.payment_type?.toLowerCase().includes(searchLower) ||
        pr.project?.project_id?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

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
    return true;
  });

  // Calculate summary statistics
  const totalPaymentRequests = filteredPaymentRequests.length;
  const totalPaymentRequestsValue = filteredPaymentRequests.reduce(
    (sum: number, pr: any) => sum + (pr.total_amount || 0),
    0
  );

  const totalPayrolls = filteredPayrolls.length;
  const totalPayrollsValue = filteredPayrolls.reduce(
    (sum: number, p: any) => sum + (p.total_net_payment || 0),
    0
  );

  const grandTotal = totalPaymentRequestsValue + totalPayrollsValue;

  // Handle process payment request
  const handleProcessPaymentRequest = (request: any) => {
    setSelectedPaymentRequest(request);
    setShowPaymentRequestDialog(true);
  };

  // Handle process payroll
  const handleProcessPayroll = (payroll: any) => {
    setSelectedPayroll(payroll);
    setShowPayrollDialog(true);
  };

  // Payment Requests columns
  const paymentRequestColumns = [
    {
      header: "Payment Type",
      accessorKey: "payment_type",
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.original.payment_type}</Badge>
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
      header: "Budget Line",
      accessorKey: "budget_line",
      cell: ({ row }: any) => (
        <div className="max-w-xs">
          {row.original.budget_line ? (
            <>
              <p className="font-medium text-xs">{row.original.budget_line.code}</p>
              <p className="text-xs text-muted-foreground truncate">{row.original.budget_line.name}</p>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      header: "Payment Reason",
      accessorKey: "payment_reason",
      cell: ({ row }: any) => (
        <div className="max-w-md">
          <p className="font-medium truncate">{row.original.payment_reason}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.items_count} item{row.original.items_count !== 1 ? 's' : ''}
          </p>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: ({ row }: any) => (
        <span className="font-semibold text-green-600">
          ₦{row.original.total_amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Requested By",
      accessorKey: "requested_by",
      cell: ({ row }: any) => (
        <span className="text-sm">{row.original.requested_by || 'N/A'}</span>
      ),
    },
    {
      header: "Date",
      accessorKey: "payment_date",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {new Date(row.original.payment_date).toLocaleDateString()}
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
        <Button
          size="sm"
          onClick={() => handleProcessPaymentRequest(row.original)}
        >
          Process Payment
        </Button>
      ),
    },
  ];

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
        <Button
          size="sm"
          onClick={() => handleProcessPayroll(row.original)}
        >
          Process Payment
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Payments</h1>
          <p className="text-muted-foreground">
            Process approved payment requests and payrolls
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetchPaymentRequests();
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
              Payment Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaymentRequests}</div>
            <p className="text-xs text-muted-foreground">
              ₦{totalPaymentRequestsValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

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
              ₦{totalPayrollsValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pending
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₦{grandTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalPaymentRequests + totalPayrolls} items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <Card>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="border-b">
            <div className="flex items-center justify-between p-4">
              <TabsList>
                <TabsTrigger value="payment-requests">
                  Payment Requests ({totalPaymentRequests})
                </TabsTrigger>
                <TabsTrigger value="payroll">
                  Payroll ({totalPayrolls})
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {/* Projects will be populated from API */}
                    {Array.from(new Set(paymentRequests.filter((pr: any) => pr.project).map((pr: any) => pr.project.id))).map((projectId: any) => {
                      const pr = paymentRequests.find((p: any) => p.project?.id === projectId);
                      return pr?.project ? (
                        <SelectItem key={projectId} value={projectId}>
                          {pr.project.project_id}
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

          {/* Payment Requests Tab */}
          <TabsContent value="payment-requests" className="p-4">
            {isLoadingPaymentRequests ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPaymentRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No pending payment requests</h3>
                <p className="text-sm text-muted-foreground">
                  {paymentRequests.length === 0
                    ? "All payment requests have been processed"
                    : "No payment requests match the selected filters"}
                </p>
              </div>
            ) : (
              <DataTable
                columns={paymentRequestColumns}
                data={filteredPaymentRequests}
                searchPlaceholder="Search payment requests..."
              />
            )}
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll" className="p-4">
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
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialogs */}
      {selectedPaymentRequest && (
        <ProcessPaymentRequestDialog
          open={showPaymentRequestDialog}
          onClose={() => {
            setShowPaymentRequestDialog(false);
            setSelectedPaymentRequest(null);
          }}
          paymentRequest={selectedPaymentRequest}
          onSuccess={() => {
            refetchPaymentRequests();
            toast.success("Payment processed successfully!");
          }}
        />
      )}

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
