import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Link from "next/link";
import EyeIcon from "@/components/icons/EyeIcon";
import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";

export const adhocDatabaseColumns: ColumnDef<IAdhocApplicant>[] = [
  {
    header: "Application Number",
    id: "application_number",
    accessorKey: "application_number",
    size: 150,
    cell: ({ row }) => row.original.application_number || '-',
  },

  {
    header: "Full Name",
    id: "full_name",
    size: 200,
    cell: ({ row }) => {
      // Try full_name first, then fall back to constructing from parts
      if ((row.original as any).full_name) {
        return (row.original as any).full_name;
      }
      const surname = (row.original as any).surname || row.original.sur_name || '';
      const otherNames = row.original.other_names || '';
      return `${surname} ${otherNames}`.trim() || '-';
    },
  },

  {
    header: "Email",
    id: "email_address",
    size: 200,
    cell: ({ row }) => (row.original as any).email || row.original.email_address || '-',
  },

  {
    header: "Phone Number",
    id: "phone_number",
    accessorKey: "phone_number",
    size: 150,
    cell: ({ row }) => row.original.phone_number || '-',
  },

  {
    header: "Position",
    id: "designation",
    size: 200,
    cell: ({ row }) => {
      // Try different field names that might contain position info
      const data = row.original as any;
      return data.advertisement_title ||
             data.designation ||
             (typeof data.advertisement === 'object' && data.advertisement?.position_title) ||
             row.original.position_under_contract ||
             '-';
    },
  },

  {
    header: "Qualifications",
    id: "qualifications",
    size: 200,
    cell: ({ row }) => {
      const data = row.original as any;
      return data.qualification || row.original.qualifications || '-';
    },
  },

  {
    header: "Health Facility",
    id: "health_facility",
    size: 200,
    cell: ({ row }) => {
      const data = row.original as any;
      return data.health_facility ||
             row.original.assigned_health_facility ||
             row.original.preferred_health_facility ||
             '-';
    },
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
    header: "Acceptance Date",
    id: "offer_acceptance_date",
    accessorKey: "offer_acceptance_date",
    size: 150,
    cell: ({ row }) => {
      const date = row.original.offer_acceptance_date;
      return date ? new Date(date).toLocaleDateString() : '-';
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
      const isAccepted = row.original.offer_accepted;

      const statusColors: Record<string, string> = {
        'APPROVED': 'bg-green-100 text-green-800',
        'CONTRACT_ISSUED': 'bg-blue-100 text-blue-800',
        'HIRED': 'bg-green-100 text-green-800',
        'SELECTED': 'bg-purple-100 text-purple-800',
      };

      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {isAccepted ? 'Active' : statusDisplay || status}
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

const TableMenu = (applicant: IAdhocApplicant) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    toast.info("Delete functionality to be implemented");
    setDialogOpen(false);
  };

  const staffId = applicant.id;

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
