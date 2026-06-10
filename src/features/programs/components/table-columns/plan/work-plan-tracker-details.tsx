import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TWorkPlanTrackerData } from "@/features/programs/types/activity-tracker";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { RouteEnum } from "@/constants/RouterConstants";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { toast } from "sonner";
import { useDeleteActivityTracker } from "@/features/programs/controllers/activityTrackerController";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditIcon from "@/components/icons/EditIcon";
import { formatNumberCurrency } from "@/utils/utls";

export const getWorkPlanTrackerDetailsColumns = (
  workPlanId: string,
  exchangeRate?: number | null
): ColumnDef<TWorkPlanTrackerData>[] => [
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
    header: "Activity Code/ Number",
    accessorKey: "activity_number",
    size: 200,
    cell: ({ row }) => row.original.activity_number || "N/A",
  },

  {
    header: "Budget Line",
    accessorKey: "budget_line",
    size: 200,
    cell: ({ row }) => row.original.budget_line || "N/A",
  },

  {
    header: "Objectives/IR/Sub-Objectives",
    accessorKey: "objectives_sub_objectives",
    size: 200,
    cell: ({ row }) => row.original.objectives_sub_objectives || "N/A",
  },

  {
    header: "Activities Plans for the Month",
    accessorKey: "activity",
    size: 300,
    cell: ({ row }) => row.original.activity || "N/A",
  },

  {
    header: "Location",
    accessorKey: "location",
    size: 150,
    cell: ({ row }) => row.original.location || "N/A",
  },

  {
    header: "Lead Dept",
    accessorKey: "lead_dept",
    size: 150,
    cell: ({ row }) => row.original.lead_dept || "N/A",
  },

  {
    header: "Lead Partner",
    accessorKey: "lead_person",
    size: 150,
    cell: ({ row }) => row.original.lead_person || "N/A",
  },

  {
    header: "Frq. of Activity",
    accessorKey: "gant_chart",
    size: 150,
    cell: ({ row }) => {
      const gant_chart = row.original.gant_chart;
      if (!gant_chart) return "N/A";

      const totalFrequency = Object.values(gant_chart).reduce(
        (sum: number, value) => sum + (Number(value) || 0),
        0
      );

      // Determine frequency type based on total value
      let frequencyType = "";
      if (totalFrequency === 12) {
        frequencyType = "Monthly";
      } else if (totalFrequency === 4) {
        frequencyType = "Quarterly";
      } else if (totalFrequency === 2) {
        frequencyType = "Bi-annually";
      } else if (totalFrequency === 48) {
        frequencyType = "Weekly";
      } else if (totalFrequency === 1) {
        frequencyType = "Annually";
      } else {
        frequencyType = `${totalFrequency}x`;
      }

      return <div className=''>{frequencyType}</div>;
    },
  },

  {
    header: "Planned Output",
    accessorKey: "planned_output",
    size: 300,
    cell: ({ row }) => {
      const gant_chart = row.original.gant_chart;
      if (!gant_chart) return "N/A";

      const totalFrequency = Object.values(gant_chart).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      );

      return <div className=''>{totalFrequency}</div>;
    },
  },

  {
    header: "Description of Output",
    accessorKey: "description_of_output",
    size: 300,
    cell: ({ row }) => {
      const data = row.original;
      // Try multiple possible field paths for description
      return data.description_of_output ||
             data.work_plan_activity_data?.description_of_output ||
             data.work_plan_activity?.description_of_output ||
             data.activity?.description_of_output ||
             data.output_description ||
             "N/A";
    },
  },

  {
    header: "Achieved Results",
    accessorKey: "achieved_output",
    size: 300,
    cell: ({ row }) => {
      const data = row.original;
      // Try multiple possible field paths for achieved results
      return data.achieved_output ||
             data.achieved_results ||
             data.achieved_output_number ||
             "N/A";
    },
  },

  {
    header: "% Achievement",
    accessorKey: "achievement_percentage",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;

      // Calculate percentage - ALWAYS use frontend calculation to ensure correct logic
      let percentage = 0;

      // Always calculate manually using gant_chart for consistency
      {
        // Calculate manually from achieved vs planned
        // Try achieved_output_number first (numeric), then achieved_output (text)
        const achievedNum = parseFloat(data.achieved_output_number || data.achieved_output || data.achieved_results || "0");

        // ALWAYS use gant_chart total as planned output (this matches what the table shows)
        let plannedNum = 0;
        if (data.gant_chart) {
          plannedNum = Object.values(data.gant_chart).reduce(
            (sum, value) => sum + (Number(value) || 0),
            0
          );
        }

        // Only fallback to planned_output_number if gant_chart is not available
        if (plannedNum === 0) {
          plannedNum = parseFloat(data.planned_output_number || data.planned_output || "1");
        }

        if (plannedNum > 0) {
          percentage = Math.round((achievedNum / plannedNum) * 100);
        }
      }

      return `${percentage}%`;
    },
  },

  {
    header: "Cost Input",
    accessorKey: "cost_input",
    size: 200,
    cell: ({ row }) => row.original.cost_input || "N/A",
  },

  {
    header: "Cost Grouping",
    accessorKey: "cost_grouping",
    size: 200,
    cell: ({ row }) => row.original.cost_grouping || "N/A",
  },

  {
    header: "Status",
    accessorKey: "status",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;

      // Auto-calculate status based on achieved vs planned output
      const achievedNum = parseFloat(data.achieved_output_number || data.achieved_output || data.achieved_results || "0");

      // Get planned output from gant_chart
      let plannedNum = 0;
      if (data.gant_chart) {
        plannedNum = Object.values(data.gant_chart).reduce(
          (sum, value) => sum + (Number(value) || 0),
          0
        );
      }

      // Fallback to planned_output_number if gant_chart is not available
      if (plannedNum === 0) {
        plannedNum = parseFloat(data.planned_output_number || data.planned_output || "0");
      }

      // Determine status based on comparison
      let status = "NOT_DONE";
      let statusColor = "bg-red-500";

      if (achievedNum >= plannedNum && plannedNum > 0) {
        status = "DONE";
        statusColor = "bg-green-500";
      } else if (achievedNum > 0) {
        status = "IN_PROGRESS";
        statusColor = "bg-yellow-500";
      }

      return (
        <Badge className={statusColor}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },

  {
    header: "Total NGN",
    accessorKey: "total_amount_ngn",
    size: 150,
    cell: ({ row }) => {
      const amount = row.original.total_amount_ngn || 0;
      return formatNumberCurrency(amount, "NGN");
    },
  },

  {
    header: "Total USD",
    accessorKey: "total_amount_usd",
    size: 150,
    cell: ({ row }) => {
      const amount = row.original.total_amount_usd || 0;
      return formatNumberCurrency(amount, "USD");
    },
  },

  {
    header: "Amount Expended (NGN)",
    accessorKey: "amount_expended_ngn",
    accessorFn: (data) => formatNumberCurrency(data.amount_expended_ngn, "NGN"),
    size: 150,
  },

  {
    header: "Amount Expended (USD)",
    accessorKey: "amount_expended_usd",
    accessorFn: (data) => formatNumberCurrency(data.amount_expended_usd, "USD"),
    size: 150,
  },

  {
    header: "Exchange Rate",
    accessorKey: "exchange_rate",
    size: 150,
    cell: () => {
      // Display the system-configured exchange rate (NGN -> USD)
      if (typeof exchangeRate !== 'number' || exchangeRate === null || exchangeRate === undefined) {
        return <span className="text-gray-400">Not configured</span>;
      }
      return <span className="font-medium">₦{Number(exchangeRate).toFixed(2)} = $1</span>;
    },
  },

  {
    header: "Expenditure Rate (NGN)",
    accessorKey: "expenditure_ngn_rate",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;
      const expended = parseFloat(data.amount_expended_ngn || "0");
      const budget = parseFloat(data.total_amount_ngn || "0");

      if (budget === 0) return "0%";

      const rate = (expended / budget) * 100;
      return `${rate.toFixed(2)}%`;
    },
  },

  {
    header: "Expenditure Rate (USD)",
    accessorKey: "expenditure_usd_rate",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;
      const expended = parseFloat(data.amount_expended_usd || "0");
      const budget = parseFloat(data.total_amount_usd || "0");

      if (budget === 0) return "0%";

      const rate = (expended / budget) * 100;
      return `${rate.toFixed(2)}%`;
    },
  },

  {
    header: "Variance (NGN)",
    accessorKey: "auto_calculated_variance_ngn",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;
      const budget = parseFloat(data.total_amount_ngn || "0");
      const expended = parseFloat(data.amount_expended_ngn || "0");

      // Variance = Budget - Expended Amount
      const variance = budget - expended;

      return (
        <span className={variance < 0 ? "text-red-600 font-medium" : variance > 0 ? "text-green-600 font-medium" : ""}>
          {formatNumberCurrency(variance, "NGN")}
        </span>
      );
    },
  },

  {
    header: "Variance (USD)",
    accessorKey: "auto_calculated_variance_usd",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;
      const budget = parseFloat(data.total_amount_usd || "0");
      const expended = parseFloat(data.amount_expended_usd || "0");

      // Variance = Budget - Expended Amount
      const variance = budget - expended;

      return (
        <span className={variance < 0 ? "text-red-600 font-medium" : variance > 0 ? "text-green-600 font-medium" : ""}>
          {formatNumberCurrency(variance, "USD")}
        </span>
      );
    },
  },

  {
    header: "% of Variance (NGN)",
    accessorKey: "auto_calculated_percentage_variance_ngn",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;
      const budget = parseFloat(data.total_amount_ngn || "0");
      const expended = parseFloat(data.amount_expended_ngn || "0");

      if (budget === 0) return "0%";

      // % Variance = ((Budget - Expended) / Budget) × 100
      const variance = budget - expended;
      const percentage = (variance / budget) * 100;

      return (
        <span className={percentage < 0 ? "text-red-600 font-medium" : percentage > 0 ? "text-green-600 font-medium" : ""}>
          {percentage.toFixed(2)}%
        </span>
      );
    },
  },

  {
    header: "% of Variance (USD)",
    accessorKey: "auto_calculated_percentage_variance_usd",
    size: 150,
    cell: ({ row }) => {
      const data = row.original;
      const budget = parseFloat(data.total_amount_usd || "0");
      const expended = parseFloat(data.amount_expended_usd || "0");

      if (budget === 0) return "0%";

      // % Variance = ((Budget - Expended) / Budget) × 100
      const variance = budget - expended;
      const percentage = (variance / budget) * 100;

      return (
        <span className={percentage < 0 ? "text-red-600 font-medium" : percentage > 0 ? "text-green-600 font-medium" : ""}>
          {percentage.toFixed(2)}%
        </span>
      );
    },
  },

  {
    header: "Efficiency Output vs Expenditure (Ratio)",
    accessorKey: "efficiency_ratio",
    size: 150,
    cell: ({ row }) => row.original.efficiency_ratio || row.original.efficiency_output_expenditure_ratio || "N/A",
  },

  {
    header: "Efficiency Output vs Expenditure (Level)",
    accessorKey: "efficiency_level_text",
    size: 150,
    cell: ({ row }) => row.original.efficiency_level_text || row.original.efficiency_output_expenditure_level || "N/A",
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
    cell: ({ row }) => (
      <TableAction {...row.original} workPlanId={workPlanId} />
    ),
  },
];

// Backward compatibility export
export const workPlanTrackerDetailscolumns =
  getWorkPlanTrackerDetailsColumns("");

const TableAction = ({
  id,
  status,
  workPlanId,
}: TWorkPlanTrackerData & { workPlanId: string }) => {
  console.log({ id, workPlanId });

  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteActivityTracker, isLoading } = useDeleteActivityTracker(id);

  const handleDeleteWorkPlanTracker = async () => {
    try {
      await deleteActivityTracker();
      toast.success("Work Plan Tracker Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
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
                  search: `?plan=${workPlanId}&id=${id}`,
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
