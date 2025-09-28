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
      header: "Reference",
      accessorKey: "reference",
      size: 150,
      cell: ({ row }) => {
        return <div className="font-medium text-sm">{row.original.reference || "N/A"}</div>;
      },
    },
    {
      header: "Delivery Date",
      accessorKey: "delivery_date",
      size: 195,
      cell: ({ row }) => {
        const date = row.original?.delivery_date;
        return <div>{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 200,
      cell: ({ row }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg bg-yellow-200 text-yellow-500"
            )}
          >
            {row.original?.status || "Pending"}
          </Badge>
        );
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.remarks || "No remarks"}</div>;
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