"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProgramRoutes } from "@/constants/RouterConstants";
import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";
import { format, isValid } from "date-fns";

export const adhocAcceptedColumns: ColumnDef<IAdhocApplicant>[] =
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
      header: "Contract Start Date",
      id: "contract_start_date",
      accessorKey: "contract_start_date",
      size: 150,
      cell: ({ row }) => {
        const date = row.original.contract_start_date;
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
      header: "Contract End Date",
      id: "contract_end_date",
      accessorKey: "contract_end_date",
      size: 150,
      cell: ({ row }) => {
        const date = row.original.contract_end_date;
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
      header: "Hired Date",
      id: "hired_at",
      accessorKey: "hired_at",
      size: 150,
      cell: ({ row }) => {
        const date = row.original.hired_at;
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
