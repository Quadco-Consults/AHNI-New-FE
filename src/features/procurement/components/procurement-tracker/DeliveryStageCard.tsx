import { ColumnDef } from "@tanstack/react-table";

import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import ProcurementTrackerAPI from "@/features/procurement/controllers/procurement-trackerController";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import EditIcon from "components/icons/EditIcon";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import PencilIcon from "components/icons/PencilIcon";
import { useAppDispatch } from "hooks/useStore";

const DeliveryStageCard = () => {
  const { data } = ProcurementTrackerAPI.useGetProcurementTrackers({});

  const columns: ColumnDef<any>[] = [
    {
      header: "Date Delivery Due",
      accessorKey: "purchase_order.delivery_due_date",
      size: 195,
    },
    {
      header: "Date Delivery Received",
      accessorKey: "purchase_order.date_of_grn",
      size: 195,
    },

    {
      header: "GRN No.",
      accessorKey: "purchase_order.grn_details",
      size: 195,
    },
    {
      header: "Vendor Performance Rating",
      accessorKey: "vendor_performance",
      size: 250,
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
            {row.original.purchase_order?.status}
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
