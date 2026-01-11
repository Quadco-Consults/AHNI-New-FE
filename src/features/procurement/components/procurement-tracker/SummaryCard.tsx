import { ColumnDef } from "@tanstack/react-table";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { usePathname } from "next/navigation";
import { TPaginatedResponse } from "definations/index";
import { ProcurementTrackerResults } from "../../types/procurementPlan";

interface SummaryCardProps {
  data: TPaginatedResponse<ProcurementTrackerResults> | undefined;
}

const SummaryCard = ({ data }: SummaryCardProps) => {
  const pathname = usePathname();
  const isAdminTracker = pathname?.includes("admin-tracker") || false;

  const columns: ColumnDef<any>[] = [
    {
      header: "Donor Name",
      accessorKey: "donor_name",
      size: 120,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.donor_name || row.original.donor || "N/A"}</div>;
      },
    },
    {
      header: "Project",
      accessorKey: "project",
      size: 150,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.project || row.original.project_name || "N/A"}</div>;
      },
    },
    {
      header: "Programme Requesting",
      accessorKey: "programme_requesting",
      size: 150,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.programme_requesting || row.original.programme || "N/A"}</div>;
      },
    },
    {
      header: "Office Requesting",
      accessorKey: "office_requesting",
      size: 130,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.office_requesting || row.original.department || row.original.location || "N/A"}</div>;
      },
    },
    {
      header: "Procurement Officer Responsible",
      accessorKey: "procurement_officer_responsible",
      size: 180,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.procurement_officer_responsible || row.original.procurement_officer || "Not assigned"}</div>;
      },
    },
    {
      header: "PR No.",
      accessorKey: "pr_no",
      size: 120,
      cell: ({ row }) => {
        return <div className="font-medium text-sm">{row.original.pr_no || row.original.pr_reference || row.original.pr_id || "N/A"}</div>;
      },
    },
    {
      header: "Date PR Received",
      accessorKey: "date_pr_received",
      size: 130,
      cell: ({ row }) => {
        const date = row.original.date_pr_received || row.original.request_date || row.original.created_at || row.original.date_created;
        return <div className="text-sm">{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "Item Category",
      accessorKey: "item_category",
      size: 120,
      cell: ({ row }) => {
        const category = row.original.item_category ||
                        row.original.category ||
                        row.original.item_type ||
                        (row.original.is_service ? "SERVICE" : "GOODS") ||
                        "Unknown";
        return <div className="text-sm">{category}</div>;
      },
    },
    {
      header: "Date Goods Required",
      accessorKey: "date_goods_required",
      size: 140,
      cell: ({ row }) => {
        const date = row.original.date_goods_required;
        return <div className="text-sm">{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "Procurement Process Date",
      accessorKey: "procurement_process_date",
      size: 160,
      cell: ({ row }) => {
        const date = row.original.procurement_process_date ||
                    row.original.solicitation?.date_procurement_initiated ||
                    row.original.solicitation?.created_at ||
                    row.original.process_start_date;
        return <div className="text-sm">{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "FCO",
      accessorKey: "fco",
      size: 100,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.fco || row.original.purchase_order?.fco_number || row.original.financial_control_officer || "N/A"}</div>;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 200,
      cell: ({ row }) => {
        return (
          <div className="text-sm truncate" title={row.original.description || row.original.item_name}>
            {row.original.description || row.original.item_name || "N/A"}
          </div>
        );
      },
    },
    {
      header: "Unit",
      accessorKey: "unit",
      size: 80,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.unit || row.original.uom || row.original.unit_of_measure || "N/A"}</div>;
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      size: 100,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.quantity || row.original.qty || "N/A"}</div>;
      },
    },
  ];

  return (
    <Card className='space-y-5'>
      <DataTable data={data?.results || []} columns={columns} />
    </Card>
  );
};

export default SummaryCard;