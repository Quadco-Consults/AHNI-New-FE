"use client";

import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { CheckCircle2, CreditCard, FileText, MapPin, Calendar } from "lucide-react";
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
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <Badge variant="outline" className="font-mono text-xs">
            FR-{row.getValue("uuid_code")}
          </Badge>
        </div>
      ),
    },
    {
      header: "Project",
      id: "project",
      cell: ({ row }: any) => {
        const project = row.original.project;
        const projectName = typeof project === 'string'
          ? project
          : project?.title || project?.project_id || "N/A";
        return (
          <div className="text-sm font-medium max-w-xs truncate" title={projectName}>
            {projectName}
          </div>
        );
      },
    },
    {
      header: "Location",
      id: "location",
      cell: ({ row }: any) => {
        const location = row.original.location;
        const locationName = typeof location === 'string'
          ? location
          : location?.name || "N/A";
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {locationName}
          </div>
        );
      },
    },
    {
      header: "Period",
      id: "period",
      cell: ({ row }: any) => {
        const month = row.original.month;
        const year = row.original.year;
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {month} {year}
          </div>
        );
      },
    },
    {
      header: "Total Amount",
      id: "total_amount",
      cell: ({ row }: any) => {
        const amount = row.original.total_amount || 0;
        return (
          <div className="font-semibold text-green-600">
            {formatCurrency(parseFloat(amount))}
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
      header: "Approved By",
      id: "hq_approver",
      cell: ({ row }: any) => {
        const approver = row.original.hq_approver_detail;
        const approverName = approver?.name || approver?.full_name || "N/A";
        return <div className="text-sm text-gray-600">{approverName}</div>;
      },
    },
    {
      header: "Approved Date",
      id: "hq_approver_datetime",
      accessorKey: "hq_approver_datetime",
      cell: ({ row }: any) => {
        const date = row.getValue("hq_approver_datetime");
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
        const fundRequest = row.original;
        const hasPV = fundRequest.payment_voucher || fundRequest.journal_entry_id;

        return (
          <div className="flex items-center gap-2">
            {hasPV ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                PV Created
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => handleCreatePaymentVoucher(fundRequest)}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approved Fund Requests</h1>
          <p className="text-muted-foreground mt-1">
            Create Payment Vouchers to transfer funds to states/locations for approved fund requests.
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
            page: page,
            onChange: (page: number) => setPage(page),
          }}
        />
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
