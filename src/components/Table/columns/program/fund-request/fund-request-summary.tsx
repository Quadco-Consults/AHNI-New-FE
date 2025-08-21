import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { FundRequestPaginatedData } from "definations/program-types/fund-request";
import { cn } from "lib/utils";
import { useState } from "react";
import { generatePath, Link, useParams } from "react-router-dom";
import { useDeleteFundRequestMutation } from "services/programsApi/fund-request";
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
      accessorKey: "location",
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

  const [deleteFundRequest, { isLoading }] = useDeleteFundRequestMutation();

  const handleDeleteFundRequest = async () => {
    try {
      await deleteFundRequest(data.id).unwrap();
      toast.success("Fund Request Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <div>
      <Link
        to={{
          pathname: generatePath(RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY, {
            id,
          }),
          search: `?fundRequestId=${data?.id}`,
        }}
      >
        <Button
          type='button'
          variant='ghost'
          className='text-[#DEA004] hover:text-[#DEA004]'
        >
          <EyeIcon />
        </Button>
      </Link>

      <Button
        type='button'
        variant='ghost'
        className='text-[#DEA004] hover:text-[#DEA004]'
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
