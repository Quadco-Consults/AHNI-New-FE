import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import ConfirmationDialog from "components/ConfirmationDialog";
import { ITravelExpensePaginatedData } from "definations/admin/travel-expense";
import { Button } from "components/ui/button";
import Link from "next/link";
import { formatDate } from "date-fns";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import PencilIcon from "components/icons/PencilIcon";
import { toast } from "sonner";
import { useDeleteTravelExpense } from "@/features/admin/controllers/travelExpenseController";

export const travelExpenseColumn: ColumnDef<ITravelExpensePaginatedData>[] = [
  {
    header: "Full Name",
    id: "user",
    accessorKey: "user",
  },

  {
    header: "Staff ID No",
    id: "staff_id",
    accessorKey: "staff_id",
  },

  {
    header: "Purpose of Travel",
    id: "travel_purpose",
    accessorKey: "travel_purpose",
  },

  {
    header: "Date Submitted",
    accessorFn: ({ created_datetime }) =>
      formatDate(created_datetime, "dd-MMM-yyyy"),
  },

  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "APPROVED" && "bg-green-200 text-green-500",
            getValue() === "REVIEWED" && "bg-blue-200 text-blue-800",
            getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
            getValue() === "AUTHORIZED" && "bg-purple-200 text-purple-800"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },

  {
    header: "",
    size: 80,
    id: "actions",
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

const TableAction = ({ id }: ITravelExpensePaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteTravelExpense, isLoading } = useDeleteTravelExpense(id);

  const handleDelete = async () => {
    try {
      await deleteTravelExpense();
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                className='w-full'
                href={AdminRoutes.TRAVEL_EXPENSE_REPORT_DETAIL.replace(
                  ":id",
                  id
                )}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>

              <Link
                href={{
                  pathname: AdminRoutes.TRAVEL_EXPENSE_REPORT_CREATE,
                  search: `?id=${id}`,
                }}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => setDialogOpen(true)}
                >
                  <PencilIcon />
                  Edit
                </Button>
              </Link>

              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={() => setDialogOpen(true)}
              >
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this travel expense report?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
