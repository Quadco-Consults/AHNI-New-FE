"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProgramRoutes } from "constants/RouterConstants";
import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";
import PersonIcon from "components/icons/Person";

export const adhocShortlistedColumns: ColumnDef<IAdhocApplicant>[] =
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
      header: "Qualifications",
      id: "qualifications",
      accessorKey: "qualifications",
      size: 250,
      cell: ({ row }) => {
        const qualifications = row.original.qualifications;
        if (!qualifications) return <span className="text-gray-400">Not provided</span>;
        return (
          <span className="line-clamp-2" title={qualifications}>
            {qualifications.length > 80 ? qualifications.substring(0, 80) + "..." : qualifications}
          </span>
        );
      },
    },

    {
      header: "Experience",
      id: "experience",
      accessorKey: "total_experience_years",
      size: 120,
      cell: ({ row }) => {
        const years = row.original.total_experience_years;
        return `${years} ${years === 1 ? 'year' : 'years'}`;
      },
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status_display",
      size: 150,
    },

    {
      header: "",
      id: "action",
      size: 80,
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = (applicant: IAdhocApplicant) => {
  const params = useParams();
  const router = useRouter();
  const adhocId = params?.id as string;

  const handleConductInterview = () => {
    // Navigate to interview page
    router.push(
      ProgramRoutes.ADHOC_APPLICANT_DETAILS
        .replace(":adhocId", adhocId)
        .replace(":applicantId", applicant.id)
        .replace("/details", "/adhoc-interview")
    );
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
              View Details
            </Button>
          </Link>

          <Button
            className='w-full flex items-center justify-start gap-2'
            variant='ghost'
            onClick={handleConductInterview}
          >
            <PersonIcon />
            Conduct Interview
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
