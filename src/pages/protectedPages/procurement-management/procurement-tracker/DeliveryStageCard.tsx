import { ColumnDef } from "@tanstack/react-table";
// import FilterIcon from "components/icons/FilterIcon";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
// import { Button } from "components/ui/button";
// import { SearchIcon } from "lucide-react";
// import React from "react";
import ProcurementTrackerAPI from "services/procurementApi/procurement-tracker";

const DeliveryStageCard = () => {
  const { data } = ProcurementTrackerAPI.useGetProcurementTrackersQuery({});

  //   const columns: ColumnDef<ProcurementTrackerResults>[] = [
  const columns: ColumnDef<any>[] = [
    {
      header: "Date Delivery Due",
      accessorKey: "programme_requesting",
      size: 195,
    },
    {
      header: "Date Delivery Received",
      accessorKey: "office_requesting",
      size: 195,
    },

    {
      header: "GRN No.",
      accessorKey: "procurement_officer_responsible",
      size: 195,
    },
    {
      header: "Vendor Performance Rating",
      accessorKey: "pr_no. ",
      size: 250,
    },
    {
      header: "Procurement Status",
      accessorKey: "date_pr_received",
      size: 200,
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
            {"ON GOING"}
          </Badge>
        );
      },

      // cell: ({ row }) => {
      //   const track = row?.original?.solicitation?.status;
      //   console.log({ track });

      //   return (
      //     <Badge
      //       variant='default'
      //       className={cn(
      //         "p-1 rounded-lg"
      //         // getValue() === "REVIEWED" && "bg-blue-200 text-blue-500",
      //         // getValue() === "APPROVED" && "bg-green-200 text-green-500",
      //         // getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
      //         // getValue() === "AUTHORIZED" && "text-green-200 bg-green-500"
      //       )}
      //     >
      //       {/* {getValue() as string} */}
      //     </Badge>
      //   );
      // },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      size: 150,
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
