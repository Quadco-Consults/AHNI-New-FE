"use client";

import { ColumnDef } from "@tanstack/react-table";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import DownIcon from "components/icons/DownIcon";
import EyeIcon from "components/icons/EyeIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import SearchIcon from "components/icons/SearchIcon";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { HrRoutes } from "constants/RouterConstants";
import { cn } from "lib/utils";
import Link from "next/link";

const SeparationManagement = () => {
  return (
    <div className='space-y-6'>
      <div className='flex-items'>
        <Button variant='custom' className='bg-[#FFF2F2] text-[#FF0000]'>
          <p>Bulk Actions</p>
          <DownIcon />
        </Button>
        <Link href={HrRoutes.SEPARATION_MANAGEMENT_CREATE}>
          <Button>
            <AddSquareIcon />
            Add New
          </Button>
        </Link>
      </div>

      <Card className='space-y-4'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 border-none bg-none focus:outline-none outline-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>
        <DataTable data={data} columns={columns} isLoading={false} />
      </Card>
    </div>
  );
};

export default SeparationManagement;

type SeparationManagementResults = {
  name: string;
  position: string;
  method: string;
  location: string;
  project: string;
  grade: string;
  submit_date: string;
  exit_date: string;
  status: string;
};

const data = Array(5).fill({
  name: "ISAAC OLUGBENLE",
  position: "Technical Assistant-COMM ART",
  method: "End of Project",
  location: "Akwa Ibom",
  project: "ACEBAY",
  grade: "5",
  submit_date: "14-03-2022",
  exit_date: "14-03-2022",
  status: "Completed",
});

const columns: ColumnDef<SeparationManagementResults>[] = [
  {
    id: "select",
    size: 80,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
  },
  {
    header: "Name",
    accessorKey: "name",
    size: 250,
  },
  {
    header: "Position",
    accessorKey: "position",
    size: 250,
  },
  {
    header: "Method",
    accessorKey: "method",
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Project",
    accessorKey: "project",
  },
  {
    header: "Grade",
    accessorKey: "grade",
  },
  {
    header: "Submit Date",
    accessorKey: "submit_date",
  },
  {
    header: "Exit Date",
    accessorKey: "exit_date",
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 100,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Completed"
              ? "bg-green-200 text-green-500"
              : "bg-red-200 text-red-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 50,
    cell: () => <ActionList />,
  },
];

const ActionList = () => {
  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                href="/dashboard/hr/separation-management/1"
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>

              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <DeleteIcon />
                delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};
