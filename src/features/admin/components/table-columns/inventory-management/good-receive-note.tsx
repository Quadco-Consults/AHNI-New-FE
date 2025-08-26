import { ColumnDef } from "@tanstack/react-table";
import { IGoodReceiveNotePaginatedData } from "definations/admin/inventory-management/good-receive-note";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import Link from "next/link";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { format } from "date-fns";
import PencilIcon from "components/icons/PencilIcon";
import { useDeleteGoodReceiveNoteMutation } from "@/features/admin/controllers/goodReceiveNoteController";
import { toast } from "sonner";
import { useState } from "react";
import ConfirmationDialog from "components/ConfirmationDialog";

export const goodReceiveNoteColumns: ColumnDef<IGoodReceiveNotePaginatedData>[] =
  [
    {
      header: "Vendor  Name",
      id: "vendor",
      accessorKey: "vendor",
      size: 200,
    },

    {
      header: "PO Number",
      id: "purchase_order",
      accessorKey: "purchase_order",
      size: 150,
    },

    {
      header: "Invoice Number",
      id: "invoice_number",
      accessorKey: "invoice_number",
      size: 200,
    },
    {
      header: "Waybill Number",
      id: "waybill_number",
      accessorKey: "waybill_number",
      size: 200,
    },

    {
      header: "Date Created",
      id: "created_datetime",
      accessorFn: ({ created_datetime }) =>
        format(created_datetime, "dd-MMM-yyyy"),
    },
    {
      header: "Remark",
      id: "remark",
      accessorKey: "remark",
    },
    {
      header: "",
      accessorKey: "actions",
      size: 80,
      cell: ({ row }) => {
        return <TableMenu {...row.original} />;
      },
    },
  ];

const TableMenu = ({ id }: IGoodReceiveNotePaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { deleteGoodReceiveNote, isLoading } =
    useDeleteGoodReceiveNoteMutation(id);

  const handleDelete = async () => {
    try {
      await deleteGoodReceiveNote();
      toast.success("Deleted Good Receive Note");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              href={AdminRoutes.GRN_DETAIL.replace(':id', id)}
              className='block w-full'
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
                pathname: AdminRoutes.GRN_CREATE,
                search: `?id=${id}`,
              }}
              className='block w-full'
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
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

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this GRN?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </>
  );
};
