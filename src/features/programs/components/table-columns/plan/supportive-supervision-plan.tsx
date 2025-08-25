import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import ApproveIcon from "components/icons/ApproveIcon";
import ApprovalStatusIcon from "components/icons/ApprovalStatusIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { toast } from "sonner";
// import { TSupervisionPlanPaginatedData } from "definations/program/plan/supervision-plan/supervision-plan";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { useDeleteSupervisionPlan } from "@/features/programs/controllers/supervisionPlanController";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useState } from "react";
import PencilIcon from "components/icons/PencilIcon";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { TSupervisionPlanPaginatedData } from "@/features/programs/types/program/plan/supervision-plan/supervision-plan";

export const supportiveSupervisionPlanColumns: ColumnDef<TSupervisionPlanPaginatedData>[] =
  [
    {
      header: "Facility",
      id: "facility",
      accessorKey: "facility",
      size: 300,
    },
    {
      header: "State",
      id: "state",
      accessorKey: "state",
      size: 150,
    },
    {
      header: "LGA",
      id: "lga",
      accessorKey: "lga",
      size: 150,
    },

    {
      header: "Month",
      id: "month",
      accessorKey: "month",
      size: 150,
    },

    {
      header: "Year",
      id: "year",
      accessorKey: "year",
      size: 150,
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      size: 100,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "COMPLETED" && "bg-green-100 text-green-500",
              getValue() === "Reject" && "bg-red-100 text-red-500",
              getValue() === "PENDING" && "bg-yellow-100 text-yellow-500",
              getValue() === "ONGOING" && "text-blue-100 bg-blue-500",
              getValue() === "On Hold" && "text-gray-100 bg-gray-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },
    {
      header: "Approval Status",
      id: "approval_status",
      accessorKey: "approval_status",
      size: 100,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "APPROVED" && "bg-green-100 text-green-500",
              getValue() === "Reject" && "bg-red-100 text-red-500"
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
      size: 80,
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: TSupervisionPlanPaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { deleteSupervisionPlan, isLoading } = useDeleteSupervisionPlan(id);

  const onDelete = async () => {
    try {
      await deleteSupervisionPlan();
      toast.success("Supervision Plan Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
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
                href={`/dashboard/programs/plan/supportive-supervision-plan/${id}`}
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
                className='w-full'
                href={`${RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION}?id=${id}`}
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
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.SspApproveModal,
                      dialogProps: {
                        header: "Approve Supportive Supervision Plan",
                        width: "max-w-2xl",
                      },
                    })
                  );
                }}
              >
                <ApproveIcon />
                Approve
              </Button>
              <Link
                href={`/dashboard/programs/plan/supportive-supervision-plan/${id}/approval`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <ApprovalStatusIcon />
                  Approval Status
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
        title='Are you sure you want to delete this supervision plan?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
      />
    </div>
  );
};
