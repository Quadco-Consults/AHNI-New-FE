import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Link from "next/link";
import EyeIcon from "components/icons/EyeIcon";
import { IAdhocStaffDatabase } from "@/features/programs/types/adhoc-management";

export const adhocDatabaseColumns: ColumnDef<IAdhocStaffDatabase>[] = [
  {
    header: "Staff Number",
    id: "staff_number",
    accessorKey: "staff_number",
    size: 150,
    cell: ({ row }) => row.original.staff_number || '-',
  },

  {
    header: "Full Name",
    id: "full_name",
    accessorKey: "full_name",
    size: 200,
    cell: ({ row }) => {
      const surname = row.original.sur_name || '';
      const otherNames = row.original.other_names || '';
      return `${otherNames} ${surname}`.trim() || '-';
    },
  },

  {
    header: "Email",
    id: "email_address",
    accessorKey: "email_address",
    size: 200,
    cell: ({ row }) => row.original.email_address || '-',
  },

  {
    header: "Phone Number",
    id: "phone_number",
    accessorKey: "phone_number",
    size: 150,
    cell: ({ row }) => row.original.phone_number || '-',
  },

  {
    header: "Designation",
    id: "designation",
    accessorKey: "designation",
    size: 200,
    cell: ({ row }) => row.original.designation || '-',
  },

  {
    header: "Project",
    id: "project",
    accessorKey: "project",
    size: 200,
    cell: ({ row }) => {
      const project = row.original.project;
      return typeof project === 'object' ? project?.name : project || '-';
    },
  },

  {
    header: "Health Facility",
    id: "health_facility",
    accessorKey: "health_facility",
    size: 200,
    cell: ({ row }) => row.original.health_facility || '-',
  },

  {
    header: "Gender",
    id: "gender",
    accessorKey: "gender",
    size: 100,
    cell: ({ row }) => row.original.gender || '-',
  },

  {
    header: "State of Origin",
    id: "state_of_origin",
    accessorKey: "state_of_origin",
    size: 150,
    cell: ({ row }) => row.original.state_of_origin || '-',
  },

  {
    header: "Contract Start",
    id: "contract_start_date",
    accessorKey: "contract_start_date",
    size: 150,
    cell: ({ row }) => {
      const date = row.original.contract_start_date;
      return date ? new Date(date).toLocaleDateString() : '-';
    },
  },

  {
    header: "Contract End",
    id: "contract_end_date",
    accessorKey: "contract_end_date",
    size: 150,
    cell: ({ row }) => {
      const date = row.original.contract_end_date;
      return date ? new Date(date).toLocaleDateString() : '-';
    },
  },

  {
    header: "Salary",
    id: "salary",
    accessorKey: "salary",
    size: 150,
    cell: ({ row }) => {
      const salary = row.original.salary;
      const currency = row.original.currency || 'NGN';
      return salary ? `${currency} ${parseFloat(salary).toLocaleString()}` : '-';
    },
  },

  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusDisplay = row.original.status_display || status;
      const statusColors: Record<string, string> = {
        'ACTIVE': 'bg-green-100 text-green-800',
        'ON_LEAVE': 'bg-yellow-100 text-yellow-800',
        'SUSPENDED': 'bg-orange-100 text-orange-800',
        'TERMINATED': 'bg-red-100 text-red-800',
        'CONTRACT_EXPIRED': 'bg-gray-100 text-gray-800',
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {statusDisplay || '-'}
        </span>
      );
    },
  },

  {
    header: "",
    id: "action",
    size: 80,
    cell: ({ row }) => <TableMenu {...row.original} />,
  },
];

const TableMenu = (staff: IAdhocStaffDatabase) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    toast.info("Delete functionality to be implemented");
    setDialogOpen(false);
  };

  const staffId = staff.id;

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <Link href={`/dashboard/programs/adhoc-database/${staffId}/view`}>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
            >
              <EyeIcon />
              View Details
            </Button>
          </Link>
          <Link href={`/dashboard/programs/adhoc-database/${staffId}/edit`}>
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
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this adhoc staff member?'
        loading={false}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
