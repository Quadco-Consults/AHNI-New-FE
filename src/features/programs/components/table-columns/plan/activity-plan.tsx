import { ColumnDef } from "@tanstack/react-table";
import { useDeleteActivityPlan } from "@/features/programs/controllers/activityPlanController";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import EditIcon from "components/icons/EditIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import Link from "next/link";

import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { TActivityPlanData } from "@/features/programs/types/activity-plan";
import { TActivity } from "@/features/programs/types/work-plan";
import { format } from "date-fns";
import { formatNumberCurrency } from "utils/utls";
import { RouteEnum } from "constants/RouterConstants";

export const getActivityPlanDetailsColumns = (
  workPlanId: string
): ColumnDef<TActivityPlanData>[] => [
  {
    header: "Activity Type",
    accessorKey: "activity_type",
    size: 120,
    cell: ({ row }) => {
      const activityType = row.original.activity_type || "PLANNED";
      return (
        <Badge
          className={`${
            activityType === "UNPLANNED" ? "bg-orange-500" : "bg-blue-500"
          }`}
        >
          {activityType}
        </Badge>
      );
    },
  },

  {
    header: "Objective",
    accessorKey: "objectives_sub_objectives",
    size: 200,
  },

  {
    header: "IR/BL",
    accessorKey: "work_plan_activity_identifier",
    size: 150,
  },

  {
    header: "Activity Code",
    accessorKey: "activity_code",
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
    accessorFn: (data) => data.start_date ? format(new Date(data.start_date), "dd MMM yyyy") : "",
    size: 150,
  },

  {
    header: "End Date",
    accessorKey: "end_date",
    accessorFn: (data) => data.end_date ? format(new Date(data.end_date), "dd MMM yyyy") : "",
    size: 150,
  },

  {
    header: "Responsible Person / Lead Person",
    accessorKey: "responsible_person",
    size: 200,
  },

  {
    header: "Resources/Vehicle Required",
    accessorKey: "resources_required",
    accessorFn: (data: any) => data?.resources_required || "NO",
    size: 250,
  },

  {
    header: "Memo Approved",
    accessorKey: "memo_approved",
    accessorFn: (data: any) => data?.memo_approved ? "YES" : "NO",
    size: 150,
  },

  {
    header: "EA Required",
    accessorKey: "ea_required",
    accessorFn: (data: any) => data?.ea_required ? "YES" : "NO",
    size: 150,
  },

  {
    header: "Expected Result",
    accessorKey: "expected_results",
    size: 200,
  },

  {
    header: "Status",
    accessorKey: "status",
    size: 200,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      if (!status) return null;

      return (
        <Badge
          className={`${
            status === "PENDING" || status === "NOT_DONE" ? "bg-yellow-500" :
            status === "DONE" ? "bg-green-500" :
            status === "ONGOING" ? "bg-blue-500" :
            "bg-gray-500"
          }`}
        >
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },

  {
    header: "Results Achieved",
    accessorKey: "achieved_results",
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
    size: 80,
    id: "actions",
    cell: ({ row }) => (
      <TableAction {...row.original} workPlanId={workPlanId} />
    ),
  },
];

// Backward compatibility export
export const activityPlanColumns: ColumnDef<TActivityPlanData>[] =
  getActivityPlanDetailsColumns("");

const TableAction = ({
  id,
  status,
  workPlanId,
}: TActivityPlanData & { workPlanId?: string }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteActivityPlan, isLoading } = useDeleteActivityPlan(id);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await deleteActivityPlan();
      toast.success("Activity Plan Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Something went wrong");
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
                href={
                  workPlanId
                    ? {
                        pathname: RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
                        search: `?plan=${workPlanId}&id=${id}`,
                      }
                    : `/dashboard/programs/plan/activity-plan/create?id=${id}`
                }
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EditIcon />
                  Edit
                </Button>
              </Link>

              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.ACTIVITY_PLAN_STATUS_MODAL,
                      dialogProps: { id, status },
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
