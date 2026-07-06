"use client";

import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { CheckCircle2, CreditCard, FileText, MapPin, Calendar, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ProcessFundRequestDialog from "@/features/finance/components/payments/ProcessFundRequestDialog";

export default function ApprovedFundRequestsPage() {
  const [page, setPage] = useState(1);
  const [selectedFundRequest, setSelectedFundRequest] = useState<any>(null);

  // Fetch only HQ approved fund requests
  const { data, isLoading, error, isError } = useGetAllFundRequests({
    page,
    size: 10,
    search: "",
    status: "HQ_APPROVED" as any, // Filter for HQ approved requests only
  });

  const handleCreatePaymentVoucher = (fundRequest: any) => {
    setSelectedFundRequest(fundRequest);
  };

  // Column definitions
  const columns = [
    {
      header: "FR Code",
      id: "uuid_code",
      accessorKey: "uuid_code",
      size: 150,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <Badge variant="outline" className="font-mono text-xs">
            {row.getValue("uuid_code")}
          </Badge>
        </div>
      ),
    },
    {
      header: "Request Date",
      id: "created_datetime",
      accessorKey: "created_datetime",
      size: 120,
      cell: ({ row }: any) => {
        const date = row.getValue("created_datetime");
        return date ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      header: "Project",
      id: "project",
      size: 200,
      cell: ({ row }: any) => {
        const project = row.original.project;
        const projectName = typeof project === 'string'
          ? project
          : project?.title || project?.project_id || "N/A";
        const projectId = typeof project === 'string' ? '' : project?.project_id;
        return (
          <div className="flex flex-col gap-0.5 max-w-[200px]">
            <div className="text-sm font-medium truncate" title={projectName}>
              {projectName}
            </div>
            {projectId && (
              <div className="text-xs text-gray-500 font-mono">
                {projectId}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Location",
      id: "location",
      size: 150,
      cell: ({ row }: any) => {
        const location = row.original.location;
        const locationName = typeof location === 'string'
          ? location
          : location?.name || "N/A";
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            <span className="truncate max-w-[120px]" title={locationName}>
              {locationName}
            </span>
          </div>
        );
      },
    },
    {
      header: "Period",
      id: "period",
      size: 110,
      cell: ({ row }: any) => {
        const month = row.original.month;
        const year = row.original.year;
        return (
          <div className="flex items-center gap-1.5 text-sm whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {month} {year}
          </div>
        );
      },
    },
    {
      header: "Total Amount",
      id: "total_disbursement_amount",
      size: 180,
      cell: ({ row }: any) => {
        const amount = row.original.total_disbursement_amount || 0;
        const currencySymbol = row.original.currency_display?.symbol || "₦";
        const currencyCode = row.original.currency_display?.code || row.original.currency || "NGN";

        // Format the number without currency
        const formattedAmount = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(amount));

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-bold text-green-700 whitespace-nowrap">
              {currencySymbol} {formattedAmount}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {currencyCode}
            </span>
          </div>
        );
      },
    },
    {
      header: "Treatment Status",
      id: "treatment_status",
      size: 150,
      cell: ({ row }: any) => {
        const fundRequest = row.original;
        const hasPV = fundRequest.payment_voucher || fundRequest.journal_entry_id;

        return hasPV ? (
          <Badge variant="default" className="bg-green-500 gap-1 whitespace-nowrap">
            <CheckCircle2 className="h-3 w-3" />
            PV Created
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300 gap-1 whitespace-nowrap">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
      },
    },
    {
      header: "Approved By",
      id: "hq_approver",
      size: 140,
      cell: ({ row }: any) => {
        const approver = row.original.hq_approver_detail;
        const approverName = approver?.name || approver?.full_name || "N/A";
        return (
          <div className="text-sm text-gray-600 truncate max-w-[130px]" title={approverName}>
            {approverName}
          </div>
        );
      },
    },
    {
      header: "Approved Date",
      id: "hq_approver_datetime",
      accessorKey: "hq_approver_datetime",
      size: 110,
      cell: ({ row }: any) => {
        const date = row.getValue("hq_approver_datetime");
        return date ? (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 140,
      cell: ({ row }: any) => {
        const fundRequest = row.original;
        const hasPV = fundRequest.payment_voucher || fundRequest.journal_entry_id;

        return (
          <div className="flex items-center gap-2">
            {hasPV ? (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="gap-1 whitespace-nowrap"
              >
                <CheckCircle2 className="h-4 w-4" />
                Processed
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => handleCreatePaymentVoucher(fundRequest)}
                className="bg-blue-600 hover:bg-blue-700 gap-1 whitespace-nowrap"
              >
                <CreditCard className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Approved Fund Requests</h1>
          <p className="text-muted-foreground mt-1">
            Create Payment Vouchers to transfer funds to states/locations for approved fund requests.
          </p>
        </div>

        <Card className="mt-10">
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Fund Requests
              </h3>
              <p className="text-red-600 mb-4">
                There's an issue loading approved fund requests.
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approved Fund Requests</h1>
          <p className="text-muted-foreground mt-1">
            Create Payment Vouchers to transfer funds to states/locations for approved fund requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-xs text-blue-600 font-medium">Total Approved</span>
            <span className="text-lg font-bold text-blue-700">
              {data?.data?.pagination?.count || 0}
            </span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={data?.data.results || []}
            isLoading={isLoading}
            pagination={{
              total: data?.data?.pagination?.count ?? 0,
              pageSize: data?.data?.pagination?.page_size ?? 10,
              page: page,
              onChange: (page: number) => setPage(page),
            }}
          />
        </div>
      </Card>

      {selectedFundRequest && (
        <ProcessFundRequestDialog
          open={!!selectedFundRequest}
          onOpenChange={(open) => !open && setSelectedFundRequest(null)}
          fundRequest={selectedFundRequest}
          onSuccess={() => {
            setSelectedFundRequest(null);
            // The list will auto-refresh via React Query
          }}
        />
      )}
    </div>
  );
}
