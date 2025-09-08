import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import { Edit } from "lucide-react";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { FundRequestPaginatedData } from "definations/program-types/fund-request";
import { cn } from "lib/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDeleteFundRequest } from "@/features/programs/controllers/fundRequestController";
import { toast } from "sonner";
import { formatNumberCurrency } from "utils/utls";

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
        const currencySymbol = data.currency === "NGN" ? "₦" : "$";

        return `${formatNumberCurrency(data.total_amount, currencySymbol)}`;
      },
      footer(props) {
        const data = props.table
          .getRowModel()
          .flatRows.map((row) => row.original);

        const sum = data
          .map((data) => data.total_amount)
          .reduce(
            (accumulator, value) =>
              (Number(accumulator as any) + Number(value as any)) as any,
            []
          );

        return <span>{formatNumberCurrency(sum, "$")}</span>;
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
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { id } = useParams();

  const { deleteFundRequest, isLoading } = useDeleteFundRequest(data?.id);

  const handleDeleteFundRequest = async () => {
    try {
      await deleteFundRequest();
      toast.success("Fund Request Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href={{
          pathname: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY.replace(
            ":id",
            id as string
          ),
          search: `?fundRequestId=${data?.id}`,
        }}
      >
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='text-[#DEA004] hover:text-[#DEA004]'
        >
          <EyeIcon />
        </Button>
      </Link>

      <Link
        href={RouteEnum.PROGRAM_FUND_REQUEST_EDIT.replace(":id", data?.id)}
      >
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='text-blue-600 hover:text-blue-800'
          title="Edit Fund Request"
        >
          <Edit size={16} />
        </Button>
      </Link>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='text-red-600 hover:text-red-800'
        onClick={() => setDialogOpen(true)}
      >
        <DeleteIcon />
      </Button>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this fund request?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDeleteFundRequest}
      />
    </div>
  );
};
