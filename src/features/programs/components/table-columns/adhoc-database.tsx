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

export const adhocDatabaseColumns: ColumnDef<any>[] = [
  {
    header: "Full Name",
    id: "full_name",
    accessorKey: "full_name",
    size: 200,
    cell: ({ row }) => {
      const surname = row.original.surname || '';
      const otherNames = row.original.other_names || '';
      return `${surname} ${otherNames}`.trim() || '-';
    },
  },

  {
    header: "Email",
    id: "email",
    accessorKey: "email",
    size: 200,
  },

  {
    header: "Phone Number",
    id: "phone_number",
    accessorKey: "phone_number",
    size: 150,
  },

  {
    header: "Designation",
    id: "designation",
    accessorKey: "designation",
    size: 200,
  },

  {
    header: "Gender",
    id: "gender_display",
    accessorKey: "gender_display",
    size: 100,
  },

  {
    header: "State of Origin",
    id: "state_of_origin",
    accessorKey: "state_of_origin",
    size: 150,
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
    header: "Contract Number",
    id: "contract_number",
    accessorKey: "contract_number",
    size: 150,
    cell: ({ row }) => row.original.contract_number || '-',
  },

  {
    header: "Status",
    id: "status_display",
    accessorKey: "status_display",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status_display;
      const statusColors: Record<string, string> = {
        'Hired': 'bg-green-100 text-green-800',
        'Active': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {status || '-'}
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

const TableMenu = (applicant: any) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    toast.info("Delete functionality to be implemented");
    setDialogOpen(false);
  };

  const applicantId = applicant.id;

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <Link href={`/dashboard/programs/adhoc-database/${applicantId}/view`}>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
            >
              <EyeIcon />
              View
            </Button>
          </Link>
          <Link href={`/dashboard/programs/adhoc-database/${applicantId}/edit`}>
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
