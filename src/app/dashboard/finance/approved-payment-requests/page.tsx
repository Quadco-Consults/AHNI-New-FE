"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/Table/DataTable";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllPaymentRequestsQuery } from "@/features/admin/controllers/paymentRequestController";
import ProcessPaymentRequestDialog from "@/features/finance/components/payments/ProcessPaymentRequestDialog";
import { CheckCircle2, CreditCard, FileText, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ApprovedPaymentRequestsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<any>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  // Fetch only approved payment requests
  const { data, isLoading, error, isError } = useGetAllPaymentRequestsQuery({
    page,
    size: 10,
    search: "",
    status: "APPROVED", // Filter for approved requests only
  });

  const handleProcessPayment = (paymentRequest: any) => {
    setSelectedPaymentRequest(paymentRequest);
    setProcessDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setProcessDialogOpen(open);
    if (!open) {
      setSelectedPaymentRequest(null);
    }
  };

  // Column definitions
  const columns = [
    {
      header: "Payment Date",
      id: "payment_date",
      accessorKey: "payment_date",
      cell: ({ row }: any) => {
        const date = row.getValue("payment_date");
        return date ? (
          <span className="text-sm font-medium text-gray-700">
            {new Date(date).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      header: "Request Type",
      id: "payment_type",
      accessorKey: "payment_type",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <Badge variant="outline" className="font-mono text-xs">
            {row.getValue("payment_type")}
          </Badge>
        </div>
      ),
    },
    {
      header: "Requested By",
      id: "requested_by",
      cell: ({ row }: any) => {
        const requested_by = row.original.requested_by;
        const displayName = typeof requested_by === 'string'
          ? requested_by
          : requested_by?.full_name || requested_by?.email || "N/A";
        return <div className="text-sm">{displayName}</div>;
      },
    },
    {
      header: "Beneficiary",
      id: "beneficiary",
      cell: ({ row }: any) => {
        const payment_items = row.original.payment_items;
        const payment_reason = row.original.payment_reason || "";

        // Check payment items first
        if (payment_items && payment_items.length > 0) {
          const firstItem = payment_items[0];
          if (payment_items.length === 1) {
            return <div className="text-sm font-medium">{firstItem.payment_to}</div>;
          } else {
            return <div className="text-sm font-medium">{firstItem.payment_to} <span className="text-gray-500">(+{payment_items.length - 1} more)</span></div>;
          }
        }

        // Fallback: Try to extract vendor/beneficiary from payment reason
        const vendorMatch = payment_reason.match(/Vendor\s+([A-Z])/i) ||
                          payment_reason.match(/(\d+)\s+staff/i);
        if (vendorMatch) {
          const beneficiary = vendorMatch[0];
          return <div className="text-sm font-medium text-gray-700">{beneficiary}</div>;
        }

        // Check if vendor field exists
        if (row.original.vendor) {
          return <div className="text-sm font-medium text-gray-700">Vendor</div>;
        }

        return <div className="text-sm text-gray-400">—</div>;
      },
    },
    {
      header: "Payment Reason",
      id: "payment_reason",
      accessorKey: "payment_reason",
      cell: ({ row }: any) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {row.getValue("payment_reason") || "—"}
        </div>
      ),
    },
    {
      header: "Amount",
      id: "amount",
      cell: ({ row }: any) => {
        // Use gross_amount if total_amount is 0 (for PRs without payment items)
        const totalAmount = parseFloat(row.original.total_amount || "0");
        const grossAmount = parseFloat(row.original.gross_amount || "0");
        const amount = totalAmount > 0 ? totalAmount : grossAmount;

        if (amount === 0) {
          return (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-orange-600">
                {formatCurrency(0)}
              </span>
              <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                ⚠ Incomplete
              </Badge>
            </div>
          );
        }

        return (
          <div className="font-semibold text-green-600">
            {formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      header: "PV Status",
      id: "pv_status",
      cell: ({ row }: any) => {
        const paymentRequest = row.original;
        const hasPaymentVoucher = paymentRequest.payment_vouchers && paymentRequest.payment_vouchers.length > 0;

        if (hasPaymentVoucher) {
          const latestPV = paymentRequest.payment_vouchers[paymentRequest.payment_vouchers.length - 1];
          const pvStatus = latestPV.status;

          if (pvStatus === "PAID") {
            return (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                PAID
              </Badge>
            );
          } else if (pvStatus === "ISSUED") {
            return (
              <Badge variant="default" className="bg-blue-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                PV ISSUED
              </Badge>
            );
          }
        }

        return (
          <Badge variant="outline" className="border-orange-300 text-orange-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            PENDING PV
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const paymentRequest = row.original;
        const hasPaymentVoucher = paymentRequest.payment_vouchers && paymentRequest.payment_vouchers.length > 0;

        // Check if payment request has a valid amount
        const totalAmount = parseFloat(paymentRequest.total_amount || "0");
        const grossAmount = parseFloat(paymentRequest.gross_amount || "0");
        const amount = totalAmount > 0 ? totalAmount : grossAmount;
        const isIncomplete = amount === 0;

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/dashboard/finance/approved-payment-requests/${paymentRequest.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {hasPaymentVoucher ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                PV Created
              </Badge>
            ) : isIncomplete ? (
              <Badge variant="outline" className="border-orange-300 text-orange-700">
                Incomplete Data
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => handleProcessPayment(paymentRequest)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Create PV
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approved Payment Requests</h1>
          <p className="text-muted-foreground mt-1">
            Create Payment Vouchers for approved payment requests. Print PVs and make payments externally.
          </p>
        </div>

        <Card className="mt-10">
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Payment Requests
              </h3>
              <p className="text-red-600 mb-4">
                There's an issue loading approved payment requests.
              </p>
              <div className="text-sm text-red-500 bg-red-100 p-3 rounded mb-4 text-left">
                <strong>Technical Details:</strong>
                <br />
                {error?.message || "Server error occurred"}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approved Payment Requests</h1>
          <p className="text-muted-foreground mt-1">
            Create Payment Vouchers for approved payment requests. Print PVs and make payments externally.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {data?.data?.results?.length || 0} of {data?.data?.paginator?.count || 0} Approved Requests
          </Badge>
        </div>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={data?.data.results || []}
          isLoading={isLoading}
          pagination={{
            total: data?.data?.paginator?.count ?? 0,
            pageSize: data?.data?.paginator?.page_size ?? 10,
            page: page,
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>

      {selectedPaymentRequest && (
        <ProcessPaymentRequestDialog
          open={processDialogOpen}
          onOpenChange={handleCloseDialog}
          paymentRequest={selectedPaymentRequest}
        />
      )}
    </div>
  );
}
