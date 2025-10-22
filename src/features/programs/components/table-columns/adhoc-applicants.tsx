"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import EyeIcon from "components/icons/EyeIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDeleteAdhocApplicant } from "@/features/programs/controllers/adhocApplicantController";
import { ProgramRoutes } from "constants/RouterConstants";
import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";
import { format, isValid } from "date-fns";

export const adhocApplicantsColumns: ColumnDef<IAdhocApplicant & { start_duration_date?: string; end_duration_date?: string }>[] =
  [
    {
      header: "Applicant Name",
      id: "name",
      accessorFn: (row) => `${row.sur_name} ${row.other_names}`,
      size: 200,
    },

    {
      header: "Email",
      id: "email",
      accessorKey: "email_address",
      size: 200,
    },

    {
      header: "Phone Number",
      id: "phone_number",
      accessorKey: "phone_number",
      size: 200,
    },

    {
      header: "Start Duration Date",
      id: "start_duration_date",
      accessorKey: "start_duration_date",
      size: 200,
      cell: ({ row }) => {
        const date = row.original.start_duration_date;
        if (!date) return <span className="text-gray-400">Not set</span>;
        try {
          const parsedDate = new Date(date);
          return isValid(parsedDate) ? format(parsedDate, "MMM dd, yyyy") : "Invalid date";
        } catch {
          return "Invalid date";
        }
      },
    },

    {
      header: "End Duration Date",
      id: "end_duration_date",
      accessorKey: "end_duration_date",
      size: 200,
      cell: ({ row }) => {
        const date = row.original.end_duration_date;
        if (!date) return <span className="text-gray-400">Not set</span>;
        try {
          const parsedDate = new Date(date);
          return isValid(parsedDate) ? format(parsedDate, "MMM dd, yyyy") : "Invalid date";
        } catch {
          return "Invalid date";
        }
      },
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status_display",
      size: 200,
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

  const params = useParams();
  const adhocId = params?.id as string;

  const deleteMutation = useDeleteAdhocApplicant();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(applicant.id);
      toast.success("Applicant Deleted");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message ?? "Something went wrong");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <Link
            href={ProgramRoutes.ADHOC_APPLICANT_DETAILS
              .replace(":adhocId", adhocId)
              .replace(":applicantId", applicant.id)}
          >
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
            >
              <EyeIcon />
              View
            </Button>
          </Link>

          <Link href={`${ProgramRoutes.CREATE_ADHOC_APPLICANT.replace(":id", adhocId)}?id=${applicant.id}`}>
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
        title='Are you sure you want to delete this applicant?'
        loading={deleteMutation.isPending}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
