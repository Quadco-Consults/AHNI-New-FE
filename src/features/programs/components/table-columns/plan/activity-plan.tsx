import { ColumnDef } from "@tanstack/react-table";
import { useDeleteActivityPlan } from "@/features/programs/controllers/activityPlanController";
// import { format } from "date-fns";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import Link from "next/link";

import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { TActivityPlanData } from "@/features/programs/types/activity-plan";
import { format } from "date-fns";

export const activityPlanColumns: ColumnDef<TActivityPlanData>[] = [
  // {
  //     header: "Project",
  //     accessorKey: "project",
  //     size: 150,
  // },
  {
    header: "Objective",
    accessorKey: "_",
    size: 200,
  },

  {
    header: "IR/BL",
    accessorKey: "work_plan_activity_identifier",
    size: 150,
  },
  {
    header: "Activity Code",
    accessorKey: "work_plan_activity_identifier",
    size: 150,
  },

  {
    header: "Budget Line",
    accessorKey: "budget_line",
    size: 200,
  },
  {
    header: "Activity Description",
    accessorKey: "activity_description",
    size: 400,
  },

  {
    header: "Month",
    accessorKey: "month",
    size: 200,
  },

  {
    header: "Start Date",
    accessorKey: "start_date",
    accessorFn: (data) => `${format(new Date(data.start_date), "dd MMM yyyy")}`,
    size: 150,
  },
  {
    header: "End Date",
    accessorKey: "end_date",
    accessorFn: (data) => `${format(new Date(data.end_date), "dd MMM yyyy")}`,
    size: 150,
  },
  {
    header: "Responsible Person / Lead Person",
    accessorKey: "responsible_person",
    size: 200,
  },
  {
    header: "Resources/Vehicle Required",
    accessorFn: (data) => ` ${data?.is_resources_requied ? "YES" : "NO"}`,
    size: 250,
  },
  {
    header: "Memo Approved",
    accessorFn: (data) => ` ${data?.is_memo_required ? "YES" : "NO"}`,
    size: 150,
  },
  {
    header: "EA Required",
    accessorFn: (data) => ` ${data?.is_ea_required ? "YES" : "NO"}`,
    size: 150,
  },

  {
    header: "Expected Result",
    accessorKey: "expected_result",
    size: 200,
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 200,
  },

  {
    header: "Results Achieved",
    accessorKey: "achieved_results",
    // accessorFn: (data) => ` ${data?.is_results_achieved ? "YES" : "NO"}`,
    size: 300,
  },

  {
    header: "Follow Up Action",
    accessorKey: "follow_up_actions",
    size: 200,
  },

  {
    header: "Comments",
    accessorKey: "comments",
    size: 300,
  },

  {
    header: "Driver / Vehicle Assigned",
    accessorKey: "driver_vehicle",
    size: 200,
  },

  {
    header: "",
    id: "actions",
    size: 300,
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

const TableAction = ({ id }: TActivityPlanData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteActivityPlan, isLoading } = useDeleteActivityPlan(id);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await deleteActivityPlan();
      toast.success("Activity Plan Deleted");
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
                href={`/dashboard/programs/plan/activity-plan/create?id=${id}`}
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
                variant='ghost'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.ACTIVITY_PLAN_STATUS_MODAL,
                      dialogProps: { id },
                    })
                  );
                }}
              >
                <PencilIcon /> Change Status
              </Button>

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
        title='Are you sure you want to delete this activity plan?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
