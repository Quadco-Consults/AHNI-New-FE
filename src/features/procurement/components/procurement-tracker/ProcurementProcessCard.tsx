import { ColumnDef } from "@tanstack/react-table";
// import FilterIcon from "components/icons/FilterIcon";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
// import { Button } from "components/ui/button";
// import { SearchIcon } from "lucide-react";
// import React from "react";
import { TPaginatedResponse } from "definations/index";
import { ProcurementTrackerResults } from "../../types/procurementPlan";

interface ProcurementProcessCardProps {
  data: { data: TPaginatedResponse<ProcurementTrackerResults> } | undefined;
}

const ProcurementProcessCard = ({ data }: ProcurementProcessCardProps) => {

  //   const columns: ColumnDef<ProcurementTrackerResults>[] = [
  const columns: ColumnDef<any>[] = [
    {
      header: "Procurement Process",
      accessorKey: "programme_requesting",
      size: 120,
      cell: ({ row }) => {
        return <div>{row.original?.solicitation?.tender_type || row.original?.tender_type || row.original?.procurement_process || "Direct Purchase"}</div>;
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
        return <div>{row.original?.purchase_order?.po_reference || row.original?.purchase_order?.reference || "N/A"}</div>;
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
      accessorKey: "payment_request_value",
      size: 200,

      cell: ({ row }) => {
        const paymentValue = row.original?.purchase_order?.payment_request?.amount || 
                           row.original?.payment_request?.amount ||
                           row.original?.payment_request_value ||
                           row.original?.purchase_order?.payment_request_value ||
                           0;
        return (
          <div>
            NGN{Number(paymentValue).toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Savings(+-)",
      accessorKey: "savings",
      size: 150,
      cell: ({ row }) => {
        const prValue = Number(row.original?.purchase_request_value || 0);
        const paymentValue = Number(
          row.original?.purchase_order?.payment_request?.amount || 
          row.original?.payment_request?.amount ||
          row.original?.payment_request_value ||
          row.original?.purchase_order?.payment_request_value ||
          0
        );
        
        if (prValue === 0 || paymentValue === 0) {
          return <div className="text-gray-500">N/A</div>;
        }
        
        const savings = prValue - paymentValue;
        const isPositive = savings >= 0;
        
        return (
          <div className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}NGN{savings.toLocaleString()}
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
        return <div>{row.original?.purchase_order?.vendor || row.original?.purchase_order?.vendor_name || "N/A"}</div>;
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
