import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";

import EyeIcon from "components/icons/EyeIcon";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { ChevronDown } from "lucide-react";
import TableFilters from "components/Table/TableFilters";

type projectData = {
  date: string;
  description: string;
  user: string;
  time: string;
};

const Activity = () => {
  const columns: ColumnDef<projectData>[] = [
    {
      header: "Date",
      accessorKey: "date",
      size: 150,
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 200,
    },
    {
      header: "User",
      accessorKey: "user",
      size: 200,
    },
    {
      header: "Time",
      accessorKey: "time",
      size: 200,
    },
    {
      header: "",
      id: "actions",
      cell: () => <ActionListAction />,
      // cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction = () => {
    // const ActionListAction = ({ data }: any) => {
    return (
      <div className='flex items-center gap-2'>
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='ghost' className='flex gap-2 py-6'>
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=' w-fit'>
              <div className='flex flex-col items-start justify-between gap-1'>
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      </div>
    );
  };

  return (
    <Card>
      <TableFilters>
        <DataTable data={[]} columns={columns} isLoading={false} />
      </TableFilters>
    </Card>
  );
};

export default Activity;
