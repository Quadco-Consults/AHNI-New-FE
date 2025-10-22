"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProgramRoutes } from "constants/RouterConstants";
import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";

export const adhocInterviewedColumns: ColumnDef<IAdhocApplicant>[] =
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
      size: 150,
    },

    {
      header: "Interview Score",
      id: "interview_score",
      size: 150,
      cell: ({ row }) => {
        // Check for multi-scorer average score first
        if (row.original.average_scores?.percentage) {
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold">{row.original.average_scores.percentage.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">
                ({row.original.completed_evaluations}/{row.original.total_interviewers})
              </span>
            </div>
          );
        }
        // Fallback to legacy single-interviewer score
        if (row.original.interview_score) {
          return <span className="font-semibold">{row.original.interview_score}%</span>;
        }
        return <span className="text-gray-400">Not scored</span>;
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
  const adhocId = params?.id as string;

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
        </PopoverContent>
      </Popover>
    </div>
  );
};
