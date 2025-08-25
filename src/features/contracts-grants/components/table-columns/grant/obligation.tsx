import { ColumnDef } from "@tanstack/react-table";
import {
  IExpenditurePaginatedData,
  IObligationPaginatedData,
} from "features/contracts-grants/types/grants";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useParams } from "next/navigation";
import PencilIcon from "components/icons/PencilIcon";
import { useDeleteObligation } from "@/features/contracts-grants/controllers/obligationController";
import { formatNumberCurrency } from "utils/utls";
import { format } from "date-fns";

export const obligationColumns: ColumnDef<IObligationPaginatedData>[] = [
  {
    header: "Date",
    id: "date",
    size: 200,
    accessorFn: ({ created_datetime }) =>
      format(created_datetime, "dd-MMM-yyyy"),
  },

  {
    header: "Description",
    id: "description",
    accessorKey: "description",
    size: 200,
  },

  {
    header: "Obligation Received",
    id: "amount",
    accessorFn: ({ amount }) => formatNumberCurrency(amount, "USD"),
    size: 200,
  },

  {
    header: "",
    id: "action",
    size: 80,
    cell: ({ row }) => <TableMenu {...row.original} />,
  },
];

const TableMenu = ({ id, ...rest }: IExpenditurePaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { id: grantId } = useParams();

  const { deleteObligation, isLoading } = useDeleteObligation();

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await deleteObligation({
        grantId: grantId ?? "",
        obligationId: id,
      })();
      toast.success("Obligation Deleted");
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
          <PopoverContent className='w-fit'>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => {
                dispatch(
                  openDialog({
                    type: DialogType.ADD_OBLIGATION_MODAL,
                    dialogProps: {
                      header: "Update Obligation",
                      width: "max-w-lg",
                      grantId,
                      obligation: {
                        id,
                        ...rest,
                      },
                    },
                  })
                );
              }}
            >
              <PencilIcon />
              Edit
            </Button>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this obligation?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
