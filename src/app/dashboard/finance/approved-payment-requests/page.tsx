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
      accessorKey: "request_number",
      header: "Request Number",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.getValue("request_number")}</span>
        </div>
      ),
    },
    {
      accessorKey: "requested_by_name",
      header: "Requested By",
      cell: ({ row }: any) => (
        <div className="text-sm">{row.getValue("requested_by_name")}</div>
      ),
    },
    {
      accessorKey: "beneficiary_name",
      header: "Beneficiary",
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">{row.getValue("beneficiary_name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => (
        <div className="font-semibold text-green-600">
          {formatCurrency(row.getValue("amount"))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
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
      accessorKey: "approval_date",
      header: "Approved On",
      cell: ({ row }: any) => {
        const date = row.getValue("approval_date");
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
                Processed
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => handleProcessPayment(paymentRequest)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Process Payment
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
            Process approved payment requests and generate payment vouchers
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
            Process approved payment requests and generate payment vouchers
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
