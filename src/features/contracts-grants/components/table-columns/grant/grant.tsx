"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IGrantPaginatedData } from "@/features/contracts-grants/types/grants";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import { CG_ROUTES } from "@/constants/RouterConstants";
import EyeIcon from "@/components/icons/EyeIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import { formatNumberCurrency } from "@/utils/utls";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { useAppDispatch } from "@/hooks/useStore";

export const grantColumns: ColumnDef<IGrantPaginatedData>[] = [
  {
    header: "Project",
    id: "title",
    accessorKey: "title",
    size: 200,
  },

  {
    header: "Project ID",
    id: "project_id",
    accessorKey: "project_id",
    size: 200,
  },

  //   {
  //     header: "Donor",
  //     id: "funding_sources",
  //     accessorFn: ({ funding_sources }) => funding_sources[0]?.name,

  //     //   funding_sources?.join(", ") || "N/A";
  //     size: 200,
  //   },
  {
    header: "Donor",
    id: "funding_sources",
    accessorFn: ({ funding_sources }) =>
      funding_sources
        ?.map((fs) => fs.name)
        .filter(Boolean)
        .join(", ") || "N/A",
    size: 200,
  },

  {
    header: "Intervention Area",
    id: "intervention_areas",
    accessorFn: ({ intervention_areas }) =>
      intervention_areas
        ?.map((ia) => ia.code)
        .filter(Boolean)
        .join(", ") || "N/A",
    size: 200,
  },

  {
    header: "Award Type",
    id: "award_type",
    accessorKey: "award_type",
    size: 200,
  },

  {
    header: "Award Amount",
    id: "award_amount",
    accessorKey: "award_amount",
    accessorFn: (data) => formatNumberCurrency(data.award_amount, "USD"),
    size: 200,
  },

  {
    header: "Total Obligations",
    id: "total_obligation_amount",
    accessorFn: ({ total_obligation_amount }) =>
      total_obligation_amount
        ? formatNumberCurrency(total_obligation_amount, "USD")
        : "N/A",
    size: 200,
  },

  {
    header: "Status",
    accessorKey: "status",
    size: 200,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "IN_PROGRESS" && "bg-green-200 text-green-500",
            getValue() === "CLOSED" && "bg-red-200 text-red-500",
            getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
            getValue() === "On Hold" && "text-grey-200 bg-grey-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },

  {
    header: "Modification",
    id: "modification",
    accessorFn: ({ modifications }) => {
      if (!modifications || modifications.length === 0) return "N/A";
      // Sort by date descending
      const sorted = [...modifications].sort(
        (a, b) =>
          new Date(b.created_datetime).getTime() -
          new Date(a.created_datetime).getTime()
      );

      return formatNumberCurrency(sorted[0]?.amount, "USD") || "N/A";
    },
    size: 200,
  },

  {
    header: "Monthly Spend",
    id: "monthly_spend",
    accessorFn: ({ current_month_expenditure_amount }) =>
      current_month_expenditure_amount
        ? formatNumberCurrency(current_month_expenditure_amount, "USD")
        : "N/A",
    size: 200,
  },

  {
    header: "Total Expenditure",
    id: "total_expenditure_amount",
    accessorFn: ({ total_expenditure_amount }) =>
      total_expenditure_amount
        ? formatNumberCurrency(total_expenditure_amount, "USD")
        : "N/A",
    size: 200,
  },
  {
    header: "",
    id: "action",
    cell: ({ row }) => <TableMenu {...row.original} />,
  },
];

// const TableMenu = ({ id }: IGrantPaginatedData) => {
const TableMenu = (data) => {
  const { id } = data;

  const dispatch = useAppDispatch();

  // Don't render anything if there's no valid id
  if (!id) {
    return null;
  }

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
            <div className='flex flex-col items-start justify-between gap-1'>
              {id && (
                <Link
                  className='w-full'
                  href={`/dashboard/c-and-g/grant/${id}`}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <EyeIcon />
                    View
                  </Button>
                </Link>
              )}

              {id && (
                <Link
                  className='w-full'
                  href={{
                    pathname: CG_ROUTES.CREATE_GRANT,
                    search: `?id=${id}`,
                  }}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <PencilIcon />
                    Edit
                  </Button>
                </Link>
              )}
              {id && (
                <Button
                  onClick={() =>
                    dispatch(
                      openDialog({
                        type: DialogType.MODIFY_GRANT,
                        dialogProps: {
                          header: "Modify Grant",
                          data: data,
                        },
                      })
                    )
                  }
                  variant='ghost'
                  className='w-full flex items-center justify-start gap-2'
                  size='sm'
                >
                  Modify Grant
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};
