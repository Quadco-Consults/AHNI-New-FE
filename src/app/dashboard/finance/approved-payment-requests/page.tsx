"use client";

import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllPaymentRequestsQuery } from "@/features/admin/controllers/paymentRequestController";
import ProcessPaymentRequestDialog from "@/features/finance/components/payments/ProcessPaymentRequestDialog";
import { CheckCircle2, CreditCard, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ApprovedPaymentRequestsPage() {
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

  // Column definitions
  const columns = [
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
        if (payment_items && payment_items.length > 0) {
          const firstItem = payment_items[0];
          if (payment_items.length === 1) {
            return <div className="text-sm font-medium">{firstItem.payment_to}</div>;
          } else {
            return <div className="text-sm font-medium">{firstItem.payment_to} <span className="text-gray-500">(+{payment_items.length - 1} more)</span></div>;
          }
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
      id: "total_amount",
      accessorKey: "total_amount",
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("total_amount") || "0");
        return (
          <div className="font-semibold text-green-600">
            {formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Payment Date",
      id: "payment_date",
      accessorKey: "payment_date",
      cell: ({ row }: any) => {
        const date = row.getValue("payment_date");
        return date ? (
          <span className="text-sm text-gray-600">
            {new Date(date).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const paymentRequest = row.original;
        const isProcessed = paymentRequest.payment_disbursement || paymentRequest.payment_voucher;

        return (
          <div className="flex items-center gap-2">
            {isProcessed ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                PV Created
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
            {data?.data?.paginator?.count || 0} Approved Requests
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
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>

      {selectedPaymentRequest && (
        <ProcessPaymentRequestDialog
          open={processDialogOpen}
          onOpenChange={setProcessDialogOpen}
          paymentRequest={selectedPaymentRequest}
        />
      )}
    </div>
  );
}
