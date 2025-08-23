import { ColumnDef } from "@tanstack/react-table";
// import FilterIcon from "components/icons/FilterIcon";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
// import { Button } from "components/ui/button";
// import { SearchIcon } from "lucide-react";
// import React from "react";
import { useGetAllProcurementTrackers } from "@/features/procurement/controllers/procurementTrackerController";

const ProcurementProcessCard = () => {
  const { data } = useGetAllProcurementTrackers({});

  //   const columns: ColumnDef<ProcurementTrackerResults>[] = [
  const columns: ColumnDef<any>[] = [
    {
      header: "Procurement Process (drop down)",
      accessorKey: "programme_requesting",
      size: 120,
      cell: ({ row }) => {
        return <div>{row.original?.solicitation?.tender_type}</div>;
      },
    },
    {
      header: "Esitmated PR value(NGN)",
      accessorKey: "office_requesting",
      size: 200,
      cell: ({ row }) => {
        return (
          <div>
            {" "}
            NGN
            {Number(row.original?.purchase_request_value || 0).toLocaleString()}
          </div>
        );
      },
    },

    {
      header: "Purchase Order No",
      accessorKey: "procurement_officer_responsible",
      size: 195,
      cell: ({ row }) => {
        return <div>{row.original?.purchase_order?.po_reference || "N/A"}</div>;
      },
    },
    {
      header: "Purchased Order value(NGN)",
      accessorKey: "pr_no. ",
      size: 150,
      cell: ({ row }) => {
        return (
          <div>
            NGN
            {Number(
              row.original?.purchase_order?.total_price || 0
            ).toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Actual Payment Request Value(NGN)",
      accessorKey: "date_pr_received",
      size: 200,

      cell: ({ row }) => {
        return (
          <div>
            NGN
            {Number(row.original?.payment_request || 0).toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Savings(+-)",
      accessorKey: "f-c-o",
      size: 150,
      cell: ({ row }) => {
        return (
          <div>
            {row.original?.purchase_order?.total_price -
              row.original?.purchase_request_value || "N/A"}
          </div>
        );
      },
    },
    {
      header: "Currency",
      accessorKey: "description-of-goods-services",
      size: 150,
      cell: () => {
        return <div>Naira</div>;
      },
    },
    {
      header: "Supplier",
      accessorKey: "unit",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.purchase_order?.vendor || "N/A"}</div>;
      },
    },
  ];
  return (
    <Card className='space-y-5'>
      <DataTable
        //   @ts-ignore
        data={data?.data?.results || []}
        columns={columns}
        // isLoading={isLoading}
      />
    </Card>
  );
};

export default ProcurementProcessCard;
