import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteEnum } from "@/constants/RouterConstants";
import { FundRequestPaginatedData } from "definations/program-types/fund-request";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatNumberCurrency } from "@/utils/utls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";

export const fundRequestSummaryColumns: ColumnDef<FundRequestPaginatedData>[] =
  [
    {
      header: "S/N",
      accessorFn: (_, index) => `${index + 1}`,
      size: 80,
    },

    {
      header: "Location",
      id: "location",
      accessorFn: (data) => {
        return data.location_display || data.location_name || data.location;
      },
      size: 200,
      footer: () => <span className='text-red-500'>GRAND TOTAL</span>,
    },

    {
      header: "Fund Request For This Period",
      id: "amount",
      accessorFn: (data) => {

        // If total_amount is 0 or null, calculate from activities
        let totalAmount = Number(data.total_amount || 0);

        if (totalAmount === 0 && data.activities && Array.isArray(data.activities)) {
          // Calculate total from activities
          totalAmount = data.activities.reduce((sum: number, activity: any) => {
            const unitCost = Number(activity.unit_cost || 0);
            const quantity = Number(activity.quantity || 0);
            const frequency = Number(activity.frequency || 0);
            const activityAmount = unitCost * quantity * frequency;
            return sum + activityAmount;
          }, 0);
        }

        // Pass the currency code instead of symbol for proper formatting
        const currencyCode = data.currency || "USD";
        return `${formatNumberCurrency(totalAmount, currencyCode)}`;
      },
      footer(props) {
        const data = props.table
          .getRowModel()
          .flatRows.map((row) => row.original);

        const sum = data
          .map((fundRequest) => {
            // If total_amount is 0 or null, calculate from activities
            let totalAmount = Number(fundRequest.total_amount || 0);

            if (totalAmount === 0 && fundRequest.activities && Array.isArray(fundRequest.activities)) {
              // Calculate total from activities
              totalAmount = fundRequest.activities.reduce((sum: number, activity: any) => {
                const unitCost = Number(activity.unit_cost || 0);
                const quantity = Number(activity.quantity || 0);
                const frequency = Number(activity.frequency || 0);
                const activityAmount = unitCost * quantity * frequency;
                return sum + activityAmount;
              }, 0);
            }

            return totalAmount;
          })
          .reduce(
            (accumulator, value) =>
              (Number(accumulator as any) + Number(value as any)) as any,
            0
          );

        // Determine the currency code based on the first fund request's currency
        const firstFundRequest = data[0];
        const currencyCode = firstFundRequest?.currency || "USD";

        return <span>{formatNumberCurrency(sum, currencyCode)}</span>;
      },
      size: 200,
    },

    {
      header: "Unique Identifier Code",
      id: "uuid_code",
      accessorKey: "uuid_code",
      size: 200,
    },

    {
      header: "Status",
      accessorKey: "status",
      size: 100,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "IN_PROGRESS" && "bg-green-200 text-green-500",
              getValue() === "CLOSED" && "bg-red-200 text-red-500",
              getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
              getValue() === "On Hold" && "text-grey-200 bg-grey-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },

    {
      header: "",
      id: "actions",
      cell: ({ row }) => <TableMenu data={row.original} />,
    },
  ];

const TableMenu = ({ data }: { data: FundRequestPaginatedData }) => {
  // Extract project ID from the fund request data
  const projectId = typeof data.project === 'object' && data.project?.id
    ? data.project.id
    : typeof data.project === 'string'
    ? data.project
    : '';

  // Build the URLs
  const viewUrl = projectId
    ? `${RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY.replace(":id", projectId)}?fundRequestId=${data?.id}`
    : RouteEnum.PROGRAM_FUND_REQUEST_SINGLE_VIEW.replace(":id", data?.id);

  const editUrl = RouteEnum.PROGRAM_FUND_REQUEST_EDIT.replace(":id", data?.id);

  // Determine what actions are available based on status
  const canEdit = data.status === "DRAFT" || data.status === "PENDING" || data.status === "REJECTED";
  const canDelete = data.status === "DRAFT";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete this fund request (${data.uuid_code})? This action cannot be undone.`)) {
      // TODO: Implement delete functionality
      console.log("Delete fund request:", data.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={viewUrl}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem asChild>
            <Link href={editUrl}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
