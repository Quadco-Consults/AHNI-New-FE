import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { usePathname } from "next/navigation";
import { TPaginatedResponse } from "definations/index";
import { ProcurementTrackerResults } from "../../types/procurementPlan";

interface SummaryCardProps {
  data: { data: TPaginatedResponse<ProcurementTrackerResults> } | undefined;
}

const SummaryCard = ({ data }: SummaryCardProps) => {

  const pathname = usePathname();

  const isAdminTracker = pathname.includes("admin-tracker");

  const columns: ColumnDef<any>[] = [
    {
      header: "Donor Name",
      accessorKey: "donor",
      size: 150,
    },
    {
      header: "Project",
      accessorKey: "project",
      size: 150,
    },

    {
      header: "Programme Requesting",
      accessorKey: "program_requesting",
      size: 150,
    },

    {
      header: "Office Requesting",
      accessorKey: "location",
      size: 200,
      //   cell: ({ row }) => {
      //     return <div>{row.original?.deparment}</div>;
      //   },
    },

    {
      header: `${
        isAdminTracker
          ? "Admin Officer Responsible"
          : "Procurement Officer Responsible"
      }`,
      accessorKey: "procurement_officer",
      cell: ({ row }) => {
        return <div>{row.original?.procurement_officer || "N/A"}</div>;
      },
      size: 195,
    },

    {
      header: "PR No.",
      accessorKey: "pr_no. ",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.pr_reference}</div>;
      },
    },

    {
      header: "Date PR Received",
      accessorKey: "date_pr_received",
      size: 200,
      cell: ({ row }) => {
        return <div>{row.original?.request_date}</div>;
      },
    },

    {
      header: "Item Category (drop down)",
      accessorKey: "item_category",
      size: 150,
    },

    {
      header: "Date Goods are Required",
      accessorKey: "date_goods_required",
      size: 150,
    },

    {
      header: "Date Procurement Process Initiated",
      accessorKey: "solicitation.date_procurement_initiated",
      size: 160,
    },

    {
      header: "FCO",
      accessorKey: "purchase_order.fco_number",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.purchase_order?.fco_number || "N/A"}</div>;
      },
    },
    {
      header: "Description of goods/ services",
      accessorKey: "description-of-goods-services",
      size: 350,
      cell: ({ row }) => {
        return <div>{row.original?.item_name}</div>;
      },
    },
    {
      header: "Unit",
      accessorKey: "uom",
      size: 150,

      cell: ({ row }) => {
        return <div>{row.original?.purchase_order?.uom || "N/A"}</div>;
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      size: 150,

      cell: ({ row }) => {
        return (
          <div> {Number(row.original?.quantity || 0).toLocaleString()}</div>
        );
      },
    },
  ];

  return (
    <Card className='space-y-5'>
      <DataTable data={data?.data?.results || []} columns={columns} />
    </Card>
  );
};

export default SummaryCard;
