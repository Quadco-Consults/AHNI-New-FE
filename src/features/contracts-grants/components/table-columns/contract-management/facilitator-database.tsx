import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Link from "next/link";
import { useDeleteFacilitatorApplicant } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";

export const facilitatorDatabaseColumns: ColumnDef<any>[] = [
  {
    header: "Name",
    id: "name",
    accessorKey: "name",
    size: 200,
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
    header: "Qualifications",
    id: "qualifications",
    accessorKey: "qualifications",
    size: 200,
  },

  {
    header: "Experience",
    id: "experience",
    accessorKey: "experience",
    size: 200,
  },

  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        'APPROVED': 'bg-green-100 text-green-800',
        'APPLIED': 'bg-blue-100 text-blue-800',
        'SELECTED': 'bg-purple-100 text-purple-800',
        'REJECTED': 'bg-red-100 text-red-800',
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {status?.replace(/_/g, ' ') || '-'}
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

const TableMenu = (facilitator: any) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { deleteFacilitatorApplicant, isLoading } = useDeleteFacilitatorApplicant(facilitator.id);

  const handleDelete = async () => {
    try {
      await deleteFacilitatorApplicant();
      toast.success("Facilitator Deleted");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const applicantId = facilitator.id;

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit'>
            <Link href={`/dashboard/c-and-g/facilitator-database/${applicantId}`}>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View Details
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
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this facilitator?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
