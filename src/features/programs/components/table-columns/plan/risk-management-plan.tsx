import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { toast } from "sonner";
import { useDeleteRiskManagementPlan } from "@/features/programs/controllers/riskPlansController";
import EditIcon from "components/icons/EditIcon";
import PencilIcon from "components/icons/PencilIcon";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useState } from "react";
import { Button } from "components/ui/button";
import Link from "next/link";
import { TRiskManagementPlanData } from "@/features/programs/types/program-validator";

export const riskManagementPlanColumns: ColumnDef<TRiskManagementPlanData>[] = [
  {
    header: "Risk Number",
    accessorKey: "risk_number",
    size: 150,
  },

  {
    header: "Risk Description",
    accessorKey: "risk_description",
    size: 300,
  },

  {
    header: "Impact Description",
    accessorKey: "impact_description",
    size: 200,
  },

  {
    header: "Impact Level",
    accessorKey: "impact_level",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "VERY_HIGH" && "bg-[#8DF384] text-[#021A0D]",
            getValue() === "VERY_LOW" && "bg-[#F97066] text-[#1A0000]",
            getValue() === "HIGH" && "bg-[#E0FDD6] text-[#096735]",
            getValue() === "LOW" && "bg-[#FECDCA] text-[#7A271A]",
            getValue() === "MEDIUM" && "bg-[#F3CB65] text-[#473200]"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },

  {
    header: "Occurence Probability",
    accessorKey: "occurence_probability",
    size: 200,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "VERY_HIGH" && "bg-[#8DF384] text-[#021A0D]",
            getValue() === "VERY_LOW" && "bg-[#F97066] text-[#1A0000]",
            getValue() === "HIGH" && "bg-[#E0FDD6] text-[#096735]",
            getValue() === "LOW" && "bg-[#FECDCA] text-[#7A271A]",
            getValue() === "MEDIUM" && "bg-[#F3CB65] text-[#473200]"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },

  {
    header: "Total Risk on Response",
    accessorKey: "total_risk_on_response",
    size: 250,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "VERY_HIGH" && "bg-[#8DF384] text-[#021A0D]",
            getValue() === "VERY_LOW" && "bg-[#F97066] text-[#1A0000]",
            getValue() === "HIGH" && "bg-[#E0FDD6] text-[#096735]",
            getValue() === "LOW" && "bg-[#FECDCA] text-[#7A271A]",
            getValue() === "MEDIUM" && "bg-[#F3CB65] text-[#473200]"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },

  {
    header: "Risk Response",
    accessorKey: "risk_response",
    size: 350,
  },

  {
    header: "Implementation Timeline",
    accessorKey: "implementation_timeline",
    size: 250,
    cell: ({ getValue }) => (
      <Badge className='bg-gray-500'>{getValue() as string}</Badge>
    ),
  },
  {
    header: "Risk Status",
    accessorKey: "risk_status",
    size: 200,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "OPEN" && "bg-[#1A9B3E] text-white",
            getValue() === "CLOSED" && "bg-[#4D4545] text-white",
            getValue() === "MITIGATED" && "bg-[#F97066] text-white"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },

  {
    header: "Risk Category",
    accessorKey: "risk_category",
    size: 180,
  },

  {
    header: "Risk Owner",
    accessorKey: "risk_owner",
    size: 200,
  },

  {
    header: "",
    id: "actions",
    size: 80,
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

const TableAction = ({ id, risk_status }: TRiskManagementPlanData) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteRiskManagementPlan, isLoading } =
    useDeleteRiskManagementPlan(id);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await deleteRiskManagementPlan();
      toast.success("Risk Management Plan Deleted");
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
              <Button
                variant='ghost'
                type='button'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.ChangeRiskStatusModal,
                      dialogProps: {
                        id,
                        status: risk_status,
                      },
                    })
                  );
                }}
              >
                <PencilIcon />
                Change Risk Status
              </Button>
              <Link
                href={`/dashboard/programs/plan/risk-management-plan/create?id=${id}`}
                className='w-full'
              >
                <Button
                  variant='ghost'
                  className='w-full flex items-center justify-start gap-2'
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
        title='Are you sure you want to delete this risk management plan?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
