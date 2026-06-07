"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  CreditCard,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";

// Import controllers
import {
  useGetPaymentDisbursements,
  getDisbursementStatusColor,
  getPaymentTypeColor,
  formatDisbursementNumber,
  formatCurrencyAmount,
} from "@/features/finance/controllers/paymentDisbursementController";

export default function DisbursementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Fetch data
  const {
    data: disbursementsData,
    isLoading,
    refetch
  } = useGetPaymentDisbursements({
    page,
    size: 20,
    status: statusFilter !== "all" ? statusFilter : undefined,
    payment_type: paymentTypeFilter !== "all" ? paymentTypeFilter : undefined,
  });

  const disbursements = Array.isArray(disbursementsData?.data)
    ? disbursementsData.data
    : [];
  const pagination = disbursementsData?.pagination;

  // Calculate summary statistics
  const totalDisbursements = disbursements.length;
  const totalValue = disbursements.reduce(
    (sum: number, d: any) => sum + d.total_amount,
    0
  );

  const completedCount = disbursements.filter(
    (d: any) => d.status === "COMPLETED"
  ).length;
  const completedValue = disbursements
    .filter((d: any) => d.status === "COMPLETED")
    .reduce((sum: number, d: any) => sum + d.total_amount, 0);

  const processingCount = disbursements.filter(
    (d: any) => d.status === "PROCESSING"
  ).length;
  const processingValue = disbursements
    .filter((d: any) => d.status === "PROCESSING")
    .reduce((sum: number, d: any) => sum + d.total_amount, 0);

  const failedCount = disbursements.filter(
    (d: any) => d.status === "FAILED" || d.status === "CANCELLED" || d.status === "REVERSED"
  ).length;

  // Columns
  const columns = [
    {
      header: "Disbursement #",
      accessorKey: "disbursement_number",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm font-medium">
          {formatDisbursementNumber(row.original.disbursement_number)}
        </div>
      ),
    },
    {
      header: "Payment Type",
      accessorKey: "payment_type",
      cell: ({ row }: any) => (
        <Badge variant={getPaymentTypeColor(row.original.payment_type)}>
          {row.original.payment_type}
        </Badge>
      ),
    },
    {
      header: "Payment Date",
      accessorKey: "payment_date",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {new Date(row.original.payment_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Payment Method",
      accessorKey: "payment_method",
      cell: ({ row }: any) => (
        <span className="text-sm text-muted-foreground">
          {row.original.payment_method.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: ({ row }: any) => (
        <span className="font-semibold text-green-600">
          {formatCurrencyAmount(row.original.total_amount)}
        </span>
      ),
    },
    {
      header: "Bank Account",
      accessorKey: "bank_account",
      cell: ({ row }: any) => (
        <span className="text-sm">{row.original.bank_account || "N/A"}</span>
      ),
    },
    {
      header: "Reference",
      accessorKey: "payment_reference",
      cell: ({ row }: any) => (
        <span className="text-sm font-mono">{row.original.payment_reference}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => (
        <Badge variant={getDisbursementStatusColor(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              // TODO: Navigate to disbursement details
              toast.info("View details coming soon");
            }}
          >
            <Eye className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Payment Disbursements</h1>
          <p className="text-muted-foreground">
            Track all payment disbursements and their statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              toast.success("Data refreshed");
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.info("Export coming soon");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Disbursements
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisbursements}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(totalValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(completedValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processing
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{processingCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(processingValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed/Cancelled
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search disbursements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REVERSED">Reversed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PAYMENT_REQUEST">Payment Request</SelectItem>
                  <SelectItem value="PAYROLL">Payroll</SelectItem>
                  <SelectItem value="PETTY_CASH">Petty Cash</SelectItem>
                  <SelectItem value="HONOUR_CERTIFICATE">Honour Certificate</SelectItem>
                </SelectContent>
              </Select>

              {(statusFilter !== "all" || paymentTypeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all");
                    setPaymentTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : disbursements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No disbursements found</h3>
              <p className="text-sm text-muted-foreground">
                {statusFilter !== "all" || paymentTypeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No payment disbursements have been created yet"}
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={disbursements}
              searchPlaceholder="Search disbursements..."
            />
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
