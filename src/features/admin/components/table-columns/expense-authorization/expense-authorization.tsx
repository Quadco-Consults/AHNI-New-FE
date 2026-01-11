import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AdminRoutes } from "@/constants/RouterConstants";
import { IExpenseAuthorizationPaginatedData } from "definations/admin/expense-authorization";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useDeleteExpenseAuthorizationMutation } from "@/features/admin/controllers/expenseAuthorizationController";
import { toast } from "sonner";

export const expenseAuthorizationColumns: ColumnDef<IExpenseAuthorizationPaginatedData>[] =
  [
    {
      header: "Projects",
      id: "projects",
      accessorFn: ({ destinations }) => {
        if (!destinations || destinations.length === 0) return "N/A";
        return destinations.map((dest) => {
          // Handle both project_title (paginated) and project.title (single) formats
          return (dest as any).project_title || (dest as any).project?.title || "N/A";
        }).join(", ");
      },
      size: 300,
      cell: ({ row }) => {
        const destinations = row.original.destinations;

        if (!destinations || destinations.length === 0) return "N/A";

        if (destinations.length === 1) {
          const project = (destinations[0] as any).project_title || (destinations[0] as any).project?.title || "N/A";
          return project;
        }

        return (
          <div className='space-y-1'>
            {destinations.map((dest: any, index: number) => {
              const project = dest.project_title || dest.project?.title || "N/A";
              return (
                <div key={dest.id || index} className='text-sm'>
                  {`${index + 1}) ${project}`}
                </div>
              );
            })}
          </div>
        );
      },
    },

    {
      header: "Activity",
      id: "activity",
      accessorFn: ({ work_plan_activity_details }) =>
        work_plan_activity_details?.activity_name || "N/A",
      size: 250,
    },

    {
      header: "Employee ID Number",
      id: "employee_id",
      accessorKey: "created_by.employee_id",

      size: 250,
    },

    {
      header: "Employee Full Name",
      id: "full_name",
      accessorKey: "created_by.full_name",
      // accessorFn: ({ created_by: { first_name, last_name } }) =>
      //     `${first_name} ${last_name}`,
      size: 250,
    },

    {
      header: "Employee Email",
      id: "email",
      accessorFn: ({ created_by: { email } }) => email,
      size: 250,
    },

    {
      header: "Employee Phone Number",
      id: "mobile_number",
      accessorFn: ({ created_by: { mobile_number } }) => mobile_number,
      size: 250,
    },

    {
      header: "Employee Address",
      id: "address",
      accessorKey: "address",
      size: 250,
    },

    {
      header: "EA Number",
      id: "ta_number",
      accessorKey: "ta_number",
      size: 250,
    },

    {
      header: "Department",
      id: "department",
      accessorFn: ({ department }) => {
        if (typeof department === 'string') return department;
        return (department as any)?.name || "N/A";
      },
      size: 250,
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      size: 250,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "APPROVED" && "bg-green-200 text-green-500",
              getValue() === "REVIEWED" && "bg-blue-200 text-blue-700",
              getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
              getValue() === "AUTHORIZED" && "bg-purple-200 text-purple-700"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },

    {
      header: "Security Clearance",
      id: "security_clearance_status",
      accessorKey: "security_clearance_status",
      size: 250,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "CLEARED" && "bg-green-200 text-green-500",
              getValue() === "REJECTED" && "bg-red-200 text-red-500",
              getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
              getValue() === "On Hold" && "text-grey-200 bg-grey-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },

    {
      header: "",
      accessorKey: "actions",
      size: 80,
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IExpenseAuthorizationPaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { deleteExpenseAuthorization, isLoading } =
    useDeleteExpenseAuthorizationMutation(id);

  const handleDelete = async () => {
    try {
      await deleteExpenseAuthorization();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='flex gap-2 py-6'>
          <MoreOptionsHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit'>
        <div className='flex flex-col items-start justify-between gap-1'>
          <Link
            href={`${AdminRoutes.EXPENSE_AUTHORIZATION_DETAIL}/${id}`}
            className='w-full'
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
              pathname: AdminRoutes.EXPENSE_AUTHORIZATION_CREATE,
              search: `?id=${id}`,
            }}
            className='w-full'
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

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this expense authorization?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </Popover>
  );
};
