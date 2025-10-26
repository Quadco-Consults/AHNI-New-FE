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
import { CG_ROUTES } from "constants/RouterConstants";
import { IConsultancyReportPaginatedData } from "definations/c&g/contract-management/consultancy-report";
import { useDeleteConsultancyReport } from "@/features/contracts-grants/controllers/consultancyReportController";
import EyeIcon from "components/icons/EyeIcon";
import { IAdhocStaffPaginatedData } from "@/features/programs/types/adhoc-staff";

export const consultantDatabaseColumns: ColumnDef<any>[] =
  [
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
      size: 200,
    },

    {
      header: "Position",
      id: "position_under_contract",
      accessorKey: "position_under_contract",
      size: 200,
    },

    {
      header: "Citizenship",
      id: "citizenship",
      accessorKey: "citizenship",
      size: 150,
    },

    {
      header: "Place of Birth",
      id: "place_of_birth",
      accessorKey: "place_of_birth",
      size: 200,
    },

    {
      header: "Start Date",
      id: "start_duration_date",
      accessorKey: "start_duration_date",
      size: 150,
      cell: ({ row }) => {
        const date = row.original.start_duration_date;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },

    {
      header: "End Date",
      id: "end_duration_date",
      accessorKey: "end_duration_date",
      size: 150,
      cell: ({ row }) => {
        const date = row.original.end_duration_date;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },

    {
      header: "Contract Number",
      id: "contract_number",
      accessorKey: "contract_number",
      size: 150,
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      size: 150,
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColors: Record<string, string> = {
          'CONTRACT_ISSUED': 'bg-green-100 text-green-800',
          'APPROVED': 'bg-blue-100 text-blue-800',
          'INTERVIEWED': 'bg-yellow-100 text-yellow-800',
          'SHORTLISTED': 'bg-purple-100 text-purple-800',
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status?.replace(/_/g, ' ') || '-'}
          </span>
        );
      },
    },

    {
      header: "Offer Accepted",
      id: "offer_accepted",
      accessorKey: "offer_accepted",
      size: 150,
      cell: ({ row }) => {
        const accepted = row.original.offer_accepted;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${accepted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {accepted ? 'Yes' : 'No'}
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

const TableMenu = (consultant: any) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { deleteConsultancyReport, isLoading } =
    useDeleteConsultancyReport();

  const handleDelete = async () => {
    try {
      await deleteConsultancyReport(consultant.id)();
      toast.success("Consultant Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const consultantId = consultant.id;

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
            <Link href={`/dashboard/c-and-g/consultancy-database/${consultantId}/view`}>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View Details
              </Button>
            </Link>
            <Link href={`/dashboard/c-and-g/consultancy-database/${consultantId}/edit`}>
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
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this consultant?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
