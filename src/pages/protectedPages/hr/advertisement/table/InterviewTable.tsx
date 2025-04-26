import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import { InterviewResults } from "definations/hr-types/advertisement";

import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link, useParams } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";

import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon"; 
import { Loading } from "components/shared/Loading";
import { useGetInterviewsQuery } from "services/hrApi/hr-interview";

const InterviewTable = () => {
  const { data, isLoading } = useGetInterviewsQuery({});

  const { id: paramsID } = useParams();

  if (isLoading) {
    return <Loading />;
  }
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
      accessorKey: "application.applicant_name",
      size: 250,
    },
    {
      header: "Appearance",
      accessorKey: "appearance_rating",
      size: 200,
    },
    {
      header: "Communication",
      accessorKey: "oral_communication_rating",
      size: 250,
    },
    {
      header: "Teamwork",
      accessorKey: "teamwork_rating",
    },
    {
      header: "Ethics",
      accessorKey: "work_ethics_rating",
    },
    {
      header: "Analytical",
      accessorKey: "analytical_rating",
    },
    {
      header: "Technical",
      accessorKey: "technical_rating",
    },
    {
      header: "Knowledge",
      accessorKey: "knowledge_rating",
    },
    {
      header: "Experience",
      accessorKey: "experience_rating",
    },
    {
      header: "Average",
      accessorKey: "average_score",
    },
    {
      header: "Percentage",
      accessorKey: "percentage_score",
    },
    // {
    //   header: "Actions",
    //   id: "actions",
    //   size: 100,
    //   cell: ({ row }) => <ActionList data={row.original} />,
    // },
  ];

  const ActionList = ({ data }: any) => {
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
                  to={generatePath(HrRoutes.ADVERTISEMENT_INTERVIEW_DETAILS, {
                    id: paramsID,
                    appID: data?.id,
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-start gap-2'>
        <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
          <SearchIcon />
          <input
            placeholder='Search'
            type='text'
            className='ml-2 h-6 w-full border-none bg-none focus:outline-none outline-none'
          />
        </span>
        <Button className='shadow-sm' variant='ghost'>
          <FilterIcon />
        </Button>
      </div>
      <h4 className='text-lg font-medium'>AVERAGE INTERVIEW SCORE ANALYSIS </h4>
      <DataTable
        // @ts-ignore
        data={data?.data?.results}
        columns={columns}
        isLoading={false}
      />
    </div>
  );
};

export default InterviewTable;
