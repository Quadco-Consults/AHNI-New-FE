import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import { InterviewResults } from "definations/hr-types/advertisement";

import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";

import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";

const InterviewTable = () => {
  return (
    <div className='space-y-6'>
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
      <h4 className='text-lg font-medium'>AVERAGE INTERVIEW SCORE ANALYSIS </h4>
      <DataTable data={data} columns={columns} isLoading={false} />
    </div>
  );
};

export default InterviewTable;

const data = [
  {
    name: "James Septimus",
    appearance: 8,
    communication: 7,
    teamwork: 9,
    ethics: 8,
    analytical: 8,
    technical: 9,
    knowledge: 7,
    experience: 6,
    average: 7.7,
    percentage: "77%",
  },
  {
    name: "Amelia Clarke",
    appearance: 9,
    communication: 8,
    teamwork: 8,
    ethics: 9,
    analytical: 7,
    technical: 8,
    knowledge: 8,
    experience: 7,
    average: 8.0,
    percentage: "80%",
  },
  {
    name: "Michael Roberts",
    appearance: 6,
    communication: 7,
    teamwork: 6,
    ethics: 8,
    analytical: 6,
    technical: 7,
    knowledge: 7,
    experience: 6,
    average: 6.7,
    percentage: "67%",
  },
  {
    name: "Sophia Bennett",
    appearance: 9,
    communication: 9,
    teamwork: 10,
    ethics: 9,
    analytical: 9,
    technical: 10,
    knowledge: 9,
    experience: 8,
    average: 9.1,
    percentage: "91%",
  },
  {
    name: "Liam Carter",
    appearance: 7,
    communication: 6,
    teamwork: 8,
    ethics: 7,
    analytical: 8,
    technical: 7,
    knowledge: 7,
    experience: 6,
    average: 7.1,
    percentage: "71%",
  },
];

const columns: ColumnDef<InterviewResults>[] = [
  {
    id: "select",
    size: 50,
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
    header: "Application Name",
    accessorKey: "name",
    size: 250,
  },
  {
    header: "Appearance",
    accessorKey: "appearance",
    size: 200,
  },
  {
    header: "Communication",
    accessorKey: "communication",
    size: 250,
  },
  {
    header: "Teamwork",
    accessorKey: "teamwork",
  },
  {
    header: "Ethics",
    accessorKey: "ethics",
  },
  {
    header: "Analytical",
    accessorKey: "analytical",
  },
  {
    header: "Technical",
    accessorKey: "technical",
  },
  {
    header: "Knowledge",
    accessorKey: "knowledge",
  },
  {
    header: "Experience",
    accessorKey: "experience",
  },
  {
    header: "Average",
    accessorKey: "average",
  },
  {
    header: "Percentage",
    accessorKey: "percentage",
  },
  {
    header: "Actions",
    id: "actions",
    size: 100,
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
                to={generatePath(HrRoutes.ADVERTISEMENT_DETAIL_SUB_APP, {
                  id: 1,
                  appID: 2,
                })}
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
