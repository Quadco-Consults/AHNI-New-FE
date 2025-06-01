/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "atoms/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import { useGetPerformanceAssesmentsQuery } from "services/hrApi/hr-performance-assessment";
import useDebounce from "utils/useDebounce";

const PerformanceManagement: React.FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = React.useState(false);
  const debouncedAdvertSearch = useDebounce("advertSearchTerm", 1000);

  // Fetch advertisements for dropdown
  const { data: performanceAssesmentData, isLoading: isLoading } =
    useGetPerformanceAssesmentsQuery({
      search: debouncedAdvertSearch,
    });

  console.log({ performanceAssesmentData });

  const columns: ColumnDef<any>[] = [
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
      header: "Description",
      accessorKey: "description",
      size: 300,
      cell: ({ row }) => <p>{row?.original?.description}</p>,
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.start_date}</p>,
    },
    {
      header: "End Date",
      accessorKey: "end_date",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.end_date}</p>,
    },
    {
      header: "Rating",
      accessorKey: "rating",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.rating}</p>,
    },
    {
      header: "Cycle Name",
      id: "cycle_name",
      size: 150,
      cell: ({ row }) => <p>{row.original.cycle_name}</p>,
    },
    {
      header: "Status",
      id: "status",
      size: 150,
      cell: ({ row }) => <p>{row?.original?.status}</p>,
    },

    {
      header: "Time Stamp",
      id: "time_stamp",
      size: 150,
      cell: ({ row }) => <p>{row?.original?.time_stamp}</p>,
    },

    {
      header: "",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    return (
      <div className='flex gap-2'>
        <Link
          to={generatePath(HrRoutes.PERFORMANCE_MANAGEMENT_DETAIL, { id: "1" })}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='ant-design:delete-twotone' fontSize={15} />
        </IconButton>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center'>
          <SearchBar onchange={() => ""} />

          <Button variant='ghost' className=''>
            <FilterIcon2 />
          </Button>
        </div>
        <div className='flex items-center'>
          <FormButton
            onClick={() => {
              navigate(HrRoutes.PERFORMANCE_MANAGEMENT_CREATE);
            }}
          >
            <AddSquareIcon />
            <p>Create New</p>
          </FormButton>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          //   onRowClick={(row) => {
          //     navigate("/c-and-g/grant-details/" + row?.original?.id);
          //   }}
          data={dummyData}
          // isLoading={true}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
      </div>
    </div>
  );
};

export default PerformanceManagement;

const dummyData = [
  {
    id: 1,
    description: "Performance review for Q1",
    start_date: "2025-01-01",
    end_date: "2025-03-31",
    rating: "Excellent",
    cycle_name: "Quarter 1",
    status: "Completed",
    time_stamp: "2025-01-15",
  },
  {
    id: 2,
    description: "Mid-year performance assessment",
    start_date: "2025-04-01",
    end_date: "2025-06-30",
    rating: "Good",
    cycle_name: "Quarter 2",
    status: "In Progress",
    time_stamp: "2025-04-10",
  },
  {
    id: 3,
    description: "Annual performance appraisal",
    start_date: "2025-07-01",
    end_date: "2025-12-31",
    rating: "Satisfactory",
    cycle_name: "Annual Review",
    status: "Pending",
    time_stamp: "2025-07-20",
  },
  {
    id: 4,
    description: "Special evaluation for leadership roles",
    start_date: "2025-02-01",
    end_date: "2025-02-28",
    rating: "Outstanding",
    cycle_name: "Leadership Evaluation",
    status: "Completed",
    time_stamp: "2025-02-25",
  },
  {
    id: 5,
    description: "End-of-year team performance review",
    start_date: "2025-11-01",
    end_date: "2025-12-31",
    rating: "Good",
    cycle_name: "Year-End Review",
    status: "In Progress",
    time_stamp: "2025-11-15",
  },
];
