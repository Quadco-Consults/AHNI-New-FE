import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
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
      header: "Reference",
      accessorKey: "reference",
      size: 150,
      cell: ({ row }) => {
        return <div className="font-medium text-sm">{row.original.reference || "N/A"}</div>;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 350,
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs text-sm" title={row.original.description}>
            {row.original.description || "N/A"}
          </div>
        );
      },
    },
    {
      header: "Department",
      accessorKey: "department",
      size: 150,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.department || "N/A"}</div>;
      },
    },
    {
      header: `${
        isAdminTracker
          ? "Admin Officer"
          : "Procurement Officer"
      }`,
      accessorKey: "officer",
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.officer || "N/A"}</div>;
      },
      size: 195,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 130,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.status || "N/A"}</div>;
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