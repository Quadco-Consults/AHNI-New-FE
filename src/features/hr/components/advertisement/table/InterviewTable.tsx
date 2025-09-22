"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import { InterviewResults } from "definations/hr-types/advertisement";

import { useParams } from "next/navigation";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { Loading } from "components/Loading";
import { Button } from "components/ui/button";
import { useGetInterviews } from "@/features/hr/controllers/hrInterviewController";

const InterviewTable = () => {
  const params = useParams();
  const paramsID = params?.id as string;
  const { data, isLoading } = useGetInterviews({ id: paramsID });

  if (isLoading) {
    return <Loading />;
  }

  // Filter to only show conducted interviews (those with actual evaluation data)
  const allInterviews = (data?.data as any)?.results || [];

  // An interview is considered "conducted" if it has:
  // 1. Comments in any evaluation field (indicates actual evaluation)
  // 2. OR ratings that are not all default (1) values
  // 3. OR has a recommendation filled out
  const conductedInterviews = allInterviews.filter((interview: any) => {
    const hasComments = interview.appearance_comments ||
                       interview.oral_communication_comments ||
                       interview.teamwork_comments ||
                       interview.work_ethics_comments ||
                       interview.analytical_comments ||
                       interview.knowledge_comments ||
                       interview.experience_comments;

    const hasRecommendation = interview.recommendation && interview.recommendation.trim().length > 0;

    // Check if ratings are not all default (1) values
    const ratings = [
      interview.appearance_rating,
      interview.oral_communication_rating,
      interview.teamwork_rating,
      interview.work_ethics_rating,
      interview.analytical_rating,
      interview.knowledge_rating,
      interview.experience_rating
    ];
    const hasNonDefaultRatings = ratings.some(rating => rating && rating !== 1);

    return hasComments || hasRecommendation || hasNonDefaultRatings;
  });

  const scheduledInterviews = allInterviews.filter((interview: any) => {
    const hasComments = interview.appearance_comments ||
                       interview.oral_communication_comments ||
                       interview.teamwork_comments ||
                       interview.work_ethics_comments ||
                       interview.analytical_comments ||
                       interview.knowledge_comments ||
                       interview.experience_comments;

    const hasRecommendation = interview.recommendation && interview.recommendation.trim().length > 0;

    const ratings = [
      interview.appearance_rating,
      interview.oral_communication_rating,
      interview.teamwork_rating,
      interview.work_ethics_rating,
      interview.analytical_rating,
      interview.knowledge_rating,
      interview.experience_rating
    ];
    const hasNonDefaultRatings = ratings.some(rating => rating && rating !== 1);

    return !(hasComments || hasRecommendation || hasNonDefaultRatings);
  });
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


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start gap-2">
        <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
          <SearchIcon />
          <input
            placeholder="Search"
            type="text"
            className="ml-2 h-6 w-full border-none bg-none focus:outline-none outline-none"
          />
        </span>
        <Button className="shadow-sm" variant="ghost">
          <FilterIcon />
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">COMPLETED INTERVIEWS - SCORE ANALYSIS</h4>
        <div className="text-sm text-gray-600">
          <span className="mr-4">📅 Scheduled: {scheduledInterviews.length}</span>
          <span>✅ Completed: {conductedInterviews.length}</span>
        </div>
      </div>
      {conductedInterviews.length > 0 ? (
        <DataTable
          // @ts-ignore
          data={conductedInterviews}
          columns={columns}
          isLoading={false}
        />
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500 mb-2">No completed interviews yet</p>
          <p className="text-sm text-gray-400">
            Interviews will appear here after they have been conducted and evaluated
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewTable;
