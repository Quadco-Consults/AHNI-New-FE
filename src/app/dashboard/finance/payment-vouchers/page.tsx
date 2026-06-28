"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";

// Import controllers
import {
  useGetPaymentVouchers,
  getPaymentVoucherStatusColor,
  getPaymentMethodColor,
  formatPVNumber,
  formatCurrencyAmount,
} from "@/features/finance/controllers/paymentVoucherController";

export default function PaymentVouchersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Fetch data
  const {
    data: vouchersData,
    isLoading,
    refetch
  } = useGetPaymentVouchers({
    page,
    size: 20,
    status: statusFilter !== "all" ? statusFilter : undefined,
    payment_method: paymentMethodFilter !== "all" ? paymentMethodFilter : undefined,
  });

  const vouchers = vouchersData?.data?.results
    ? vouchersData.data.results
    : [];
  const pagination = vouchersData?.data?.pagination;

  // Calculate summary statistics
  const totalVouchers = vouchers.length;
  const totalGrossAmount = vouchers.reduce(
    (sum: number, v: any) => sum + v.gross_amount,
    0
  );
  const totalNetAmount = vouchers.reduce(
    (sum: number, v: any) => sum + v.net_amount,
    0
  );
  const totalDeductions = totalGrossAmount - totalNetAmount;

  const issuedCount = vouchers.filter(
    (v: any) => v.status === "ISSUED"
  ).length;
  const issuedValue = vouchers
    .filter((v: any) => v.status === "ISSUED")
    .reduce((sum: number, v: any) => sum + v.net_amount, 0);

  const paidCount = vouchers.filter(
    (v: any) => v.status === "PAID"
  ).length;
  const paidValue = vouchers
    .filter((v: any) => v.status === "PAID")
    .reduce((sum: number, v: any) => sum + v.net_amount, 0);

  const cancelledCount = vouchers.filter(
    (v: any) => v.status === "CANCELLED"
  ).length;

  // Columns
  const columns = [
    {
      header: "PV Number",
      accessorKey: "pv_number",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm font-medium">
          {formatPVNumber(row.original.pv_number)}
        </div>
      ),
    },
    {
      header: "Payee",
      accessorKey: "payee_name",
      cell: ({ row }: any) => (
        <div className="max-w-[200px]">
          <div className="font-medium text-sm">{row.original.payee_name}</div>
          {row.original.project_name && (
            <div className="text-xs text-muted-foreground truncate">
              {row.original.project_name}
            </div>
          )}
        </div>
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
        <Badge variant={getPaymentMethodColor(row.original.payment_method)}>
          {row.original.payment_method_display}
        </Badge>
      ),
    },
    {
      header: "Gross Amount",
      accessorKey: "gross_amount",
      cell: ({ row }: any) => (
        <span className="font-medium text-sm">
          {formatCurrencyAmount(row.original.gross_amount)}
        </span>
      ),
    },
    {
      header: "Deductions",
      accessorKey: "total_deductions",
      cell: ({ row }: any) => (
        <span className="text-sm text-orange-600">
          -{formatCurrencyAmount(row.original.total_deductions)}
        </span>
      ),
    },
    {
      header: "Net Amount",
      accessorKey: "net_amount",
      cell: ({ row }: any) => (
        <span className="font-semibold text-green-600">
          {formatCurrencyAmount(row.original.net_amount)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => (
        <Badge variant={getPaymentVoucherStatusColor(row.original.status)}>
          {row.original.status_display}
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
              router.push(`/dashboard/finance/payment-vouchers/${row.original.id}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              toast.info("Print PV coming soon");
            }}
          >
            <Printer className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Payment Vouchers</h1>
          <p className="text-muted-foreground">
            Official payment documents with deduction details
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
              Total Vouchers
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVouchers}</div>
            <p className="text-xs text-muted-foreground">
              Net: {formatCurrencyAmount(totalNetAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Issued (Pending)
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{issuedCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(issuedValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paid
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(paidValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deductions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrencyAmount(totalDeductions)}
            </div>
            <p className="text-xs text-muted-foreground">
              {cancelledCount} cancelled
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
                  placeholder="Search by PV number or payee..."
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
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ISSUED">Issued</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                </SelectContent>
              </Select>

              {(statusFilter !== "all" || paymentMethodFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all");
                    setPaymentMethodFilter("all");
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
          ) : vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No payment vouchers found</h3>
              <p className="text-sm text-muted-foreground">
                {statusFilter !== "all" || paymentMethodFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No payment vouchers have been created yet"}
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={vouchers}
              searchPlaceholder="Search vouchers..."
            />
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Showing page {pagination.page} of {pagination.total_pages} ({pagination.count} total)
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
                disabled={page === pagination.total_pages}
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
