import { ColumnDef } from "@tanstack/react-table";
import { TWorkPlanTrackerData } from "definations/program-types/activity-tracker";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import Link from "next/link";
import DeleteIcon from "components/icons/DeleteIcon";
import { RouteEnum } from "constants/RouterConstants";
import ConfirmationDialog from "components/ConfirmationDialog";
import { toast } from "sonner";
import { useDeleteActivityTracker } from "@/features/programs/controllers/activityTrackerController";
import { Button } from "components/ui/button";
import { useState } from "react";
import { EyeIcon } from "lucide-react";

export const workPlanTrackercolumns: ColumnDef<TWorkPlanTrackerData>[] = [
  {
    header: "Project Name",
    accessorKey: "project",
    size: 200,
  },

  {
    header: "Financial Year",
    accessorKey: "financial_year",
    size: 200,
  },
  {
    header: "",
    size: 80,
    id: "actions",
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

const TableAction = ({ id }: TWorkPlanTrackerData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteActivityTracker: deleteWorkPlanTracker, isLoading } =
    useDeleteActivityTracker();

  const handleDeleteWorkPlanTracker = async () => {
    try {
      await deleteWorkPlanTracker(id);
      toast.success("Work Plan Tracker Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
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
                href={`/dashboard/programs/plan/activity-tracker/${id}`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
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
        title='Are you sure you want to delete this work plan tracker?'
        onCancel={() => setDialogOpen(false)}
        onOk={handleDeleteWorkPlanTracker}
        loading={isLoading}
      />
    </div>
  );
};
