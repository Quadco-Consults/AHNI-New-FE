"use client";

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
import { usePathname, useParams } from "next/navigation";
import { useDeleteAgreement } from "@/features/contracts-grants/controllers/agreementController";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { IConsultancyStaffPaginatedData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import EyeIcon from "components/icons/EyeIcon";

export const consultancyStaffColumns: ColumnDef<IConsultancyStaffPaginatedData>[] =
  [
    {
      header: "Applicant Name",
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
      header: "Start Duration Date",
      id: "start_duration_date",
      accessorKey: "start_duration_date",
      size: 200,
    },

    {
      header: "End Duration Date",
      id: "end_duration_date",
      accessorKey: "end_duration_date",
      size: 200,
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      size: 200,
    },

    {
      header: "",
      id: "action",
      size: 80,
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IConsultancyStaffPaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const params = useParams();
  const adhocId = params?.id as string;

  const pathname = usePathname();

  const type = pathname?.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

  const viewPath =
    type === "ADHOC"
      ? ProgramRoutes.ADHOC_APPLICANT_DETAILS
      : CG_ROUTES.CONSULTANCY_APPLICATION_DETAILS;

  const editPath =
    type === "ADHOC"
      ? ProgramRoutes.CREATE_ADHOC_APPLICANT
      : CG_ROUTES.CREATE_CONSULTANCY_APPLICANT;

  const { deleteAgreement, isLoading } = useDeleteAgreement();

  const handleDelete = async () => {
    try {
      await deleteAgreement(id)();
      toast.success("Adhoc Applicant Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
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
          <PopoverContent className='w-fit'>
            <Link
              href={viewPath
                .replace(":adhocId", adhocId)
                .replace(":applicantId", id)}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View
              </Button>
            </Link>

            <Link href={`${editPath.replace(":id", adhocId)}?id=${id}`}>
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
        title='Are you sure you want to delete this expenditure?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
