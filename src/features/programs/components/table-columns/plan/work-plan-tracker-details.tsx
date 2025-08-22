import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { TWorkPlanTrackerData } from "definations/program-types/activity-tracker";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import Link from "next/link";
import DeleteIcon from "components/icons/DeleteIcon";
import { RouteEnum } from "constants/RouterConstants";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { toast } from "sonner";
import { useDeleteActivityTracker } from "@/features/programs/controllers/activity-tracker";
import { Button } from "components/ui/button";
import { useState } from "react";
import EditIcon from "components/icons/EditIcon";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { formatNumberCurrency } from "utils/utls";

export const workPlanTrackerDetailscolumns: ColumnDef<TWorkPlanTrackerData>[] =
  [
    {
      header: "Activity Code/ Number",
      accessorKey: "activity_number",
      size: 200,
    },

    {
      header: "Budget Line",
      accessorKey: "budget_line.name",
      size: 200,
    },

    {
      header: "Objectives/IR/Sub-Objectives",
      accessorKey: "objectives_sub_objectives",
      size: 200,
    },

    {
      header: "Activities Plans for the Month",
      accessorKey: "activity",
      size: 300,
    },

    {
      header: "Location",
      accessorKey: "location",
      size: 150,
    },

    {
      header: "Lead Dept",
      accessorKey: "lead_dept",
      size: 150,
    },

    {
      header: "Lead Partner",
      accessorKey: "lead_person",
      size: 150,
    },

    {
      header: "Frq. of Activity",
      accessorKey: "",
      size: 150,
      cell: ({ row }) => {
        // @ts-ignore
        const { gant_chart } = row.original;
        const length = Object.keys(gant_chart).length;

        return <div className=''>{length}</div>;
      },
    },

    {
      header: "Planned Output",
      accessorKey: "planned_output",
      size: 300,
    },

    {
      header: "Description of Output",
      accessorKey: "output_description",
      size: 300,
    },

    {
      header: "Achieved Output",
      accessorKey: "achieved_output",
      size: 300,
    },

    {
      header: "% Achievement",
      accessorFn: (data) => `${data.achievement_percentage ?? 0}%`,
      size: 150,
    },

    {
      header: "Cost Input",
      accessorKey: "_",
      size: 200,
    },

    {
      header: "Cost Grouping",
      accessorKey: "_",
      size: 200,
    },

    {
      header: "Status",
      accessorKey: "status",
      size: 150,
      cell: ({ getValue }) => {
        const status = getValue();

        return (
          <Badge
            className={`${
              status === "PENDING" ? "bg-yellow-500" : "bg-green-500"
            }`}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },

    {
      header: "Total NGN",
      accessorKey: "total_amount_ngn",
      accessorFn: (data) => formatNumberCurrency(data.total_amount_ngn, "NGN"),
      size: 150,
    },

    {
      header: "Total USD",
      accessorKey: "total_amount_usd",
      accessorFn: (data) => formatNumberCurrency(data.total_amount_usd, "USD"),

      size: 150,
    },

    {
      header: "Amount Expended (NGN)",
      accessorKey: "amount_expended_ngn",
      accessorFn: (data) =>
        formatNumberCurrency(data.amount_expended_ngn, "NGN"),

      size: 150,
    },

    {
      header: "Amount Expended (USD)",
      accessorKey: "amount_expended_usd",
      accessorFn: (data) =>
        formatNumberCurrency(data.amount_expended_usd, "USD"),

      size: 150,
    },

    {
      header: "Implementation USD Rate",
      accessorKey: "implementation_usd_rate",
      accessorFn: (data) =>
        formatNumberCurrency(data.implementation_usd_rate, "USD"),

      size: 150,
    },

    {
      header: "Expenditure Rate (NGN)",
      accessorKey: "expenditure_ngn_rate",
      accessorFn: (data) =>
        formatNumberCurrency(data.expenditure_ngn_rate, "NGN"),

      size: 150,
    },

    {
      header: "Expenditure Rate (USD)",
      accessorKey: "expenditure_usd_rate",
      accessorFn: (data) =>
        formatNumberCurrency(data.expenditure_usd_rate, "USD"),

      size: 150,
    },

    {
      header: "Variance (NGN)",
      accessorFn: (data) => formatNumberCurrency(data.variance_ngn, "NGN"),

      accessorKey: "variance_ngn",
      size: 150,
    },

    {
      header: "Variance (USD)",
      accessorKey: "variance_usd",
      accessorFn: (data) => formatNumberCurrency(data.variance_usd, "USD"),

      size: 150,
    },

    {
      header: "% of Variance (NGN)",
      accessorFn: (data) => `${data.percentage_variance_ngn ?? 0}%`,
      size: 150,
    },

    {
      header: "% ofVariance (USD)",
      accessorFn: (data) => `${data.percentage_variance_usd ?? 0}%`,
      size: 150,
    },

    {
      header: "Efficiency Output vs Expenditure (Ratio)",
      accessorKey: "efficiency_output_expenditure_ratio",
      size: 150,
    },

    {
      header: "Efficiency Output vs Expenditure (Level)",
      accessorKey: "efficiency_output_expenditure_level",
      size: 150,
    },

    {
      header: "Comments (e.g Provide reasons for non completion, variance)",
      accessorKey: "comments",
      size: 300,
    },

    {
      header: "",
      size: 80,
      id: "actions",
      cell: ({ row }) => <TableAction {...row.original} />,
    },
  ];

const TableAction = ({ id, status }: TWorkPlanTrackerData) => {
  const dispatch = useAppDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteWorkPlanTracker, { isLoading }] =
    useDeleteActivityTracker();

  const handleDeleteWorkPlanTracker = async () => {
    try {
      await deleteWorkPlanTracker(id).unwrap();
      toast.success("Work Plan Tracker Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
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
                href={{
                  pathname: RouteEnum.PROGRAM_ACTIVITY_TRACKER_CREATE,
                  search: `?id=${id}`,
                }}
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
                variant='ghost'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.ChangeWorkPlanStatusModal,
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
        title='Are you sure you want to delete this work plan tracker?'
        onCancel={() => setDialogOpen(false)}
        onOk={handleDeleteWorkPlanTracker}
        loading={isLoading}
      />
    </div>
  );
};
