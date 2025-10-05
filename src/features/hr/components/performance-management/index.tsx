"use client";

/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import { useGetPerformanceAssesments } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import useDebounce from "utils/useDebounce";
import { Badge } from "components/ui/badge";
import { getEvaluationProgress, getRatingLabel } from "@/features/hr/utils/performanceCalculations";

const PerformanceManagement: React.FC = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = React.useState(false);
  const debouncedAdvertSearch = useDebounce("advertSearchTerm", 1000);

  // Fetch advertisements for dropdown
  const { data: performanceAssesmentData, isLoading: isLoading, refetch } =
    useGetPerformanceAssesments({
      search: debouncedAdvertSearch,
      page: 1,
      size: 20,
    });

  // Refetch data when component mounts or becomes visible
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    console.log("=== PERFORMANCE ASSESSMENT DEBUG ===");
    console.log("Full response:", performanceAssesmentData);
    console.log("Results:", performanceAssesmentData?.data?.results);
    console.log("Results length:", performanceAssesmentData?.data?.results?.length);
    console.log("Pagination:", performanceAssesmentData?.data?.pagination);
    console.log("Is Loading:", isLoading);

    if (performanceAssesmentData && !isLoading) {
      if (!performanceAssesmentData?.data?.results) {
        console.error("❌ No results in response!");
      } else if (performanceAssesmentData?.data?.results?.length === 0) {
        console.warn("⚠️ No assessments found");
      } else {
        console.log("✅ Successfully loaded", performanceAssesmentData?.data?.results?.length, "assessments");
      }
    }
  }, [performanceAssesmentData, isLoading]);

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
      header: "Employee",
      accessorKey: "employee",
      size: 200,
      cell: ({ row }) => {
        const employee = row?.original?.employee;
        if (typeof employee === 'object') {
          return <p>{`${employee.legal_firstname} ${employee.legal_lastname}`}</p>;
        }
        return <p>N/A</p>;
      },
    },
    {
      header: "Final Rating",
      accessorKey: "final_rating",
      size: 150,
      cell: ({ row }) => {
        const rating = row?.original?.final_rating;
        if (rating) {
          return (
            <div className="flex flex-col">
              <p className="font-semibold">{rating}/5</p>
              <p className="text-xs text-gray-600">{getRatingLabel(rating)}</p>
            </div>
          );
        }
        return <Badge variant="outline">Pending</Badge>;
      },
    },
    {
      header: "Progress",
      id: "progress",
      size: 150,
      cell: ({ row }) => {
        const evaluators = row?.original?.evaluators || [];
        const progress = getEvaluationProgress(evaluators);
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs">{progress}%</span>
          </div>
        );
      },
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
      cell: ({ row }) => {
        const status = row?.original?.status || 'draft';
        const variant =
          status === 'completed' || status === 'approved' ? 'default' :
          status === 'in_progress' ? 'secondary' :
          'outline';

        return <Badge variant={variant} className="capitalize">{status.replace('_', ' ')}</Badge>;
      },
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
    const assessmentId = data?.original?.id;

    return (
      <div className='flex gap-2'>
        <Link
          href={`/dashboard/hr/performance-management/${assessmentId}`}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton
          className='bg-[#F9F9F9] hover:text-red-600'
          onClick={() => {
            // TODO: Implement delete functionality
            console.log('Delete assessment:', assessmentId);
          }}
        >
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
              router.push(HrRoutes.PERFORMANCE_MANAGEMENT_CREATE);
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
          //     router.push("/c-and-g/grant-details/" + row?.original?.id);
          //   }}
          data={performanceAssesmentData?.data?.results || []}
          isLoading={isLoading}
          pagination={{
            total: performanceAssesmentData?.data?.pagination?.count || 0,
            pageSize: 20,
            onChange: (page: number) => {
              console.log("Page changed to:", page);
            },
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
