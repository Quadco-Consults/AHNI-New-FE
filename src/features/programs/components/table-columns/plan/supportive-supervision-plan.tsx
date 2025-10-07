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
import ApprovalSummary from "components/ApprovalSummary";

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
      header: "Approval Progress",
      id: "approval_progress",
      size: 200,
      cell: ({ row }) => {
        const rowData = row.original as any;
        const currentLevel = rowData.current_approval_level || 1;
        const approvals = rowData.approvals || [];

        // Determine total number of approval levels configured
        const totalLevels = [
          rowData.level1_approver,
          rowData.level2_approver,
          rowData.level3_approver,
        ].filter(Boolean).length;

        // Count approved levels
        const approvedCount = approvals.filter(
          (a: any) => a.status === "APPROVED"
        ).length;

        // Check if any level is rejected
        const isRejected = approvals.some((a: any) => a.status === "REJECTED");

        const getProgressColor = () => {
          if (isRejected) return "bg-red-500";
          if (approvedCount === totalLevels && totalLevels > 0) return "bg-green-500";
          if (approvedCount > 0) return "bg-blue-500";
          return "bg-gray-300";
        };

        const getStatusText = () => {
          if (totalLevels === 0) return "No Approvers";
          if (isRejected) return "Rejected";
          if (approvedCount === totalLevels) return "Fully Approved";
          if (approvedCount > 0) return `Level ${currentLevel} Pending`;
          return "Pending Approval";
        };

        if (totalLevels === 0) {
          return (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 italic">No approvers configured</p>
            </div>
          );
        }

        return (
          <div className="space-y-2">
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    getProgressColor()
                  )}
                  style={{ width: `${(approvedCount / totalLevels) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">
                {approvedCount}/{totalLevels}
              </span>
            </div>
            {/* Status text */}
            <p className="text-xs text-gray-600">{getStatusText()}</p>
          </div>
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
      let errorMessage = "Something went wrong";

      // Check for foreign key constraint error
      if (error?.message?.includes("protected foreign keys") ||
          error?.message?.includes("SupportiveSupervisionReview")) {
        errorMessage = "Cannot delete this supervision plan because it has associated evaluation reviews. Please delete the reviews first or contact an administrator.";
      } else if (error?.message?.includes("Cannot delete")) {
        errorMessage = "Cannot delete this supervision plan because it has associated records. Please remove dependent records first.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
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
                        id: id,
                      },
                    })
                  );
                }}
              >
                <ApproveIcon />
                Approve
              </Button>
              <Link
                href={`${RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL.replace(":id", id)}`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <ApprovalStatusIcon />
                  Approval Status
                </Button>
              </Link>
              <Link
                href={`${RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_REPORT.replace(":id", id)}`}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View Report
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
        title='Delete Supervision Plan'
        description='Are you sure you want to delete this supervision plan? This action cannot be undone. Note: Plans with associated evaluation reviews cannot be deleted.'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
      />
    </div>
  );
};
