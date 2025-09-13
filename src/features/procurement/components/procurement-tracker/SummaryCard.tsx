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
      cell: ({ row }) => {
        return <div>{row.original?.purchase_request?.donor || row.original?.donor || row.original?.donor_name || "Not specified"}</div>;
      },
    },
    {
      header: "Project",
      accessorKey: "project",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.purchase_request?.project || row.original?.project || row.original?.project_name || "Not specified"}</div>;
      },
    },

    {
      header: "Programme Requesting",
      accessorKey: "program_requesting",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.purchase_request?.programme_requesting || row.original?.program_requesting || row.original?.programme_requesting || "Not specified"}</div>;
      },
    },

    {
      header: "Office Requesting",
      accessorKey: "location",
      size: 200,
      cell: ({ row }) => {
        return <div>{row.original?.location || row.original?.deparment || row.original?.department || row.original?.office || "Not specified"}</div>;
      },
    },

    {
      header: `${
        isAdminTracker
          ? "Admin Officer Responsible"
          : "Procurement Officer Responsible"
      }`,
      accessorKey: "procurement_officer",
      cell: ({ row }) => {
        return <div>{row.original?.procurement_officer || row.original?.officer_name || "Not assigned"}</div>;
      },
      size: 195,
    },

    {
      header: "PR No.",
      accessorKey: "pr_reference",
      size: 150,
      cell: ({ row }) => {
        return <div className="font-medium">{row.original?.pr_reference || row.original?.pr_id || "N/A"}</div>;
      },
    },

    {
      header: "Date PR Received",
      accessorKey: "request_date",
      size: 200,
      cell: ({ row }) => {
        const date = row.original?.request_date || row.original?.date_received || row.original?.created_at;
        return <div>{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },

    {
      header: "Item Category",
      accessorKey: "item_category",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.item_category || row.original?.category || "Not categorized"}</div>;
      },
    },

    {
      header: "Date Goods Required",
      accessorKey: "required_date",
      size: 150,
      cell: ({ row }) => {
        const date = row.original?.required_date || row.original?.date_goods_required || row.original?.date_required;
        return <div>{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },

    {
      header: "Procurement Process Date",
      accessorKey: "solicitation.date_procurement_initiated",
      size: 160,
      cell: ({ row }) => {
        const date = row.original?.solicitation?.date_procurement_initiated;
        return <div>{date ? new Date(date).toLocaleDateString("en-US") : "Not initiated"}</div>;
      },
    },

    {
      header: "FCO",
      accessorKey: "purchase_order.fco_number",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.purchase_order?.fco_number || "Pending"}</div>;
      },
    },
    {
      header: "Description",
      accessorKey: "item_name",
      size: 350,
      cell: ({ row }) => {
        const description = row.original?.item_name || row.original?.description || row.original?.item_description || row.original?.name;
        return (
          <div className="truncate max-w-xs" title={description}>
            {description || "No description"}
          </div>
        );
      },
    },
    {
      header: "Unit",
      accessorKey: "uom",
      size: 150,
      cell: ({ row }) => {
        return <div>{row.original?.purchase_order?.uom || row.original?.uom || row.original?.unit_of_measurement || "N/A"}</div>;
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      size: 150,
      cell: ({ row }) => {
        const qty = row.original?.quantity || row.original?.qty || 0;
        return (
          <div className="text-right font-medium">{Number(qty).toLocaleString()}</div>
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
