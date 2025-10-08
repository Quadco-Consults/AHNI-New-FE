import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { TPaginatedResponse } from "definations/index";
import { ProcurementTrackerResults } from "../../types/procurementPlan";

interface DeliveryStageCardProps {
  data: TPaginatedResponse<ProcurementTrackerResults> | undefined;
}

const DeliveryStageCard = ({ data }: DeliveryStageCardProps) => {
  const columns: ColumnDef<any>[] = [
    {
      header: "PR Reference",
      accessorKey: "pr_reference",
      size: 150,
      cell: ({ row }) => {
        return <div className="font-medium text-sm">{row.original.pr_reference || row.original.pr_id || "N/A"}</div>;
      },
    },
    {
      header: "Delivery Due Date",
      accessorKey: "date_goods_required",
      size: 195,
      cell: ({ row }) => {
        const date = row.original?.date_goods_required ||
                    row.original?.purchase_order?.delivery_due_date ||
                    row.original?.purchase_order?.expected_delivery_date;
        return <div className="text-sm">{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "PO Status",
      accessorKey: "purchase_order.status",
      size: 120,
      cell: ({ row }) => {
        const status = row.original?.purchase_order?.status || "No PO";
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              status === "Pending" ? "bg-yellow-200 text-yellow-700" :
              status === "Completed" ? "bg-green-200 text-green-700" :
              status === "Cancelled" ? "bg-red-200 text-red-700" :
              "bg-gray-200 text-gray-700"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Service Status",
      accessorKey: "purchase_order.service_status",
      size: 120,
      cell: ({ row }) => {
        const serviceStatus = row.original?.purchase_order?.service_status;
        if (!serviceStatus) return <div className="text-sm text-gray-500">N/A</div>;

        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              serviceStatus === "PENDING" ? "bg-yellow-200 text-yellow-700" :
              serviceStatus === "COMPLETED" ? "bg-green-200 text-green-700" :
              serviceStatus === "CANCELLED" ? "bg-red-200 text-red-700" :
              "bg-gray-200 text-gray-700"
            )}
          >
            {serviceStatus}
          </Badge>
        );
      },
    },
    {
      header: "GRN Date",
      accessorKey: "purchase_order.date_of_grn",
      size: 120,
      cell: ({ row }) => {
        const grnDate = row.original?.purchase_order?.date_of_grn;
        return <div className="text-sm">{grnDate ? new Date(grnDate).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "Vendor Performance",
      accessorKey: "vendor_performance",
      size: 150,
      cell: ({ row }) => {
        const vendorPerf = row.original?.vendor_performance;

        // Handle new object structure from backend
        if (vendorPerf && typeof vendorPerf === 'object') {
          const { status, total_score, recommendation } = vendorPerf;

          if (status === 'EVALUATED') {
            return (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{total_score}</span>
                  <span className="text-xs text-gray-500">/ 25</span>
                </div>
                <Badge
                  variant='default'
                  className={cn(
                    "p-1 rounded-lg text-xs",
                    recommendation === "RETAIN" ? "bg-green-200 text-green-700" :
                    recommendation === "ON_PROBATION" ? "bg-yellow-200 text-yellow-700" :
                    recommendation === "BARRED" ? "bg-red-200 text-red-700" :
                    "bg-gray-200 text-gray-700"
                  )}
                >
                  {recommendation}
                </Badge>
              </div>
            );
          }

          if (status === 'PENDING') {
            return <div className="text-sm text-yellow-600">Evaluation Pending</div>;
          }

          if (status === 'NOT_EVALUATED') {
            return <div className="text-sm text-gray-500">Not Evaluated</div>;
          }
        }

        // Fallback for old string format or N/A
        const rating = row.original?.vendor_rating || row.original?.purchase_order?.vendor_rating;
        if (rating && typeof rating === 'number') {
          return (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-yellow-500">★</span>
            </div>
          );
        }

        return <div className="text-sm text-gray-500">N/A</div>;
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      size: 150,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original?.remarks || row.original?.purchase_order?.remarks || "No remarks"}</div>;
      },
    },
  ];

  return (
    <Card className='space-y-5'>
      <DataTable data={data?.results || []} columns={columns} />
    </Card>
  );
};

export default DeliveryStageCard;