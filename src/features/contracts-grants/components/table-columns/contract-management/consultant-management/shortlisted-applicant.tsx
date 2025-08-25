"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { IConsultancyStaffPaginatedData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useState } from "react";

export const shortlistedApplicantColumn: ColumnDef<IConsultancyStaffPaginatedData>[] =
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
      header: "Interview Score",
      id: "score",
      accessorKey: "score",
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { id: adhocId } = useParams();

  const pathname = usePathname();

  const type = pathname.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

  const path =
    type === "ADHOC"
      ? ProgramRoutes.ADHOC_APPLICANT_INTERVIEW
      : CG_ROUTES.CREATE_CONSULTANCY_APPLICANT;

  const dispatch = useAppDispatch();

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
              href={
                type === "ADHOC"
                  ? `/dashboard/programs/adhoc-management/${adhocId}/applicant/${id}/adhoc-interview`
                  : `/dashboard/c-and-g/consultant-management/${adhocId}/applicant/${id}`
              }
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                Interview Consultant
              </Button>
            </Link>

            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => {
                dispatch(
                  openDialog({
                    type: DialogType.PREFERRED_CONSULTANT_MODAL,
                    dialogProps: {
                      header: "Select Preferred Consultant",
                      size: "lg",
                    },
                  })
                );
              }}
            >
              Preferred Consultant
            </Button>

            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setIsDialogOpen(true)}
            >
              Issue Contract
            </Button>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to issue a contract to Dave Wilson?'
        message='Are you sure you want to proceed with issuing a contract to Dave Wilson? This action will formally initiate the contracting process, notifying them and granting access to the contract details for review and signature.'
        loading={false}
        onCancel={() => setIsDialogOpen(false)}
        onOk={() => {}}
      />
    </div>
  );
};
