import { ColumnDef } from "@tanstack/react-table";

import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { TPaginatedResponse } from "definations/index";
import { ProcurementTrackerResults } from "../../types/procurementPlan";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import EditIcon from "components/icons/EditIcon";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import PencilIcon from "components/icons/PencilIcon";
import { useAppDispatch } from "hooks/useStore";

interface DeliveryStageCardProps {
  data: { data: TPaginatedResponse<ProcurementTrackerResults> } | undefined;
}

const DeliveryStageCard = ({ data }: DeliveryStageCardProps) => {

  const columns: ColumnDef<any>[] = [
    {
      header: "Date Delivery Due",
      accessorKey: "purchase_order.delivery_due_date",
      size: 195,
      cell: ({ row }) => {
        const date = row.original?.purchase_order?.delivery_due_date || 
                   row.original?.purchase_order?.delivery_date ||
                   row.original?.delivery_due_date;
        return <div>{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "Date Delivery Received",
      accessorKey: "delivery_note.date_received",
      size: 195,
      cell: ({ row }) => {
        const date = row.original?.delivery_note?.date_received || 
                   row.original?.delivery_note?.delivery_date ||
                   row.original?.purchase_order?.date_of_grn ||
                   row.original?.date_received;
        return <div>{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },

    {
      header: "GRN No.",
      accessorKey: "delivery_note.grn_number",
      size: 195,
      cell: ({ row }) => {
        return <div>{row.original?.delivery_note?.grn_number || 
                    row.original?.delivery_note?.grn_reference ||
                    row.original?.purchase_order?.grn_details?.grn_number || 
                    row.original?.grn_number || "N/A"}</div>;
      },
    },
    {
      header: "Vendor Performance Rating",
      accessorKey: "vendor_performance",
      size: 250,
      cell: ({ row }) => {
        const rating = row.original?.vendor_performance || row.original?.purchase_order?.service_quality_rating;
        return <div>{rating ? `${rating}/5` : "Not rated"}</div>;
      },
    },
    {
      header: "Procurement Status",
      accessorKey: "date_pr_received",
      size: 200,
      // cell: ({ row }) => {
      cell: ({ row }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg bg-yellow-200 text-yellow-500"
              // getValue() === "REVIEWED" && "bg-blue-200 text-blue-500",
              // getValue() === "APPROVED" && "bg-green-200 text-green-500",
              // getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
              // getValue() === "AUTHORIZED" && "text-green-200 bg-green-500"
            )}
          >
            {/* {"ON GOING"} */}
            {row.original?.purchase_order?.status || row.original?.status || "Pending"}
          </Badge>
        );
      },

      // cell: ({ getValue }) => {
      //   // const track = row?.original?.solicitation?.status;
      //   // console.log({ track });

      //   return (
      //     <Badge
      //       variant='default'
      //       className={cn(
      //         // "p-1 rounded-lg"
      //         getValue() === "REVIEWED" && "bg-blue-200 text-blue-500",
      //         getValue() === "APPROVED" && "bg-green-200 text-green-500",
      //         getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
      //         getValue() === "AUTHORIZED" && "text-green-200 bg-green-500"
      //       )}
      //     >
      //       {getValue() as string}
      //     </Badge>
      //   );
      // },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.remarks || row.original?.notes || "No remarks"}</div>;
      },
    },
    {
      header: "Action",
      accessorKey: "remarks",
      size: 150,
      cell: ({ row }) => <TableAction {...row.original} />,
    },
  ];
  return (
    <Card className='space-y-5'>
      <DataTable
        //   @ts-ignore
        data={data?.data?.results || []}
        columns={columns}
      />
    </Card>
  );
};

export default DeliveryStageCard;

const TableAction = ({ id, status }: { id: any; status: any }) => {
  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Button
                variant='ghost'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.ChangeProcurementTrackerRemarkModal,
                      dialogProps: { id, status },
                    })
                  );
                }}
              >
                {" "}
                <EditIcon />
                Remark
              </Button>

              <Button
                variant='ghost'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.ChangeProcurementTrackerStatusModal,
                      dialogProps: { id, status },
                    })
                  );
                }}
              >
                <PencilIcon /> Change Status
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};
