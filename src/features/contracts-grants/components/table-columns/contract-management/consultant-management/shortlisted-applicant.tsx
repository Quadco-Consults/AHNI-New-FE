"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { IConsultancyStaffPaginatedData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";

export const shortlistedApplicantColumn: ColumnDef<IConsultancyStaffPaginatedData>[] =
  [
    {
      header: "Applicant Name",
      id: "name",
      accessorKey: "name",
      size: 200,
    },

    {
      header: "Email",
      id: "email",
      accessorKey: "email",
      size: 200,
    },

    {
      header: "Phone Number",
      id: "phone_number",
      accessorKey: "phone_number",
      size: 200,
    },

    {
      header: "Start Duration Date",
      id: "start_duration_date",
      accessorKey: "start_duration_date",
      size: 200,
    },

    {
      header: "End Duration Date",
      id: "end_duration_date",
      accessorKey: "end_duration_date",
      size: 200,
    },

    {
      header: "Interview Score",
      id: "interview_score",
      size: 200,
      cell: ({ row }) => {
        const schedule = row.original.schedule;
        const averageScores = row.original.average_scores;
        const interviewScores = row.original.interview_scores;

        // For multi-scorer/committee interviews
        if (schedule) {
          const totalInterviewers = schedule.total_interviewers || 0;
          const completedEvaluations = schedule.completed_evaluations || 0;
          const isComplete = completedEvaluations >= totalInterviewers && totalInterviewers > 0;

          if (completedEvaluations === 0) {
            return (
              <div className='flex flex-col'>
                <span className="text-gray-400 text-sm">Pending</span>
                <span className="text-xs text-gray-400">0/{totalInterviewers} completed</span>
              </div>
            );
          }

          return (
            <div className='flex flex-col gap-1'>
              {isComplete && averageScores ? (
                <div className='flex items-center gap-2'>
                  <span className="font-semibold text-green-700">
                    {Math.round(averageScores.total * 10) / 10}
                  </span>
                  <span className="text-gray-500 text-sm">/ 50</span>
                  <span className="text-xs text-green-600">(avg)</span>
                </div>
              ) : (
                <span className="text-yellow-600 text-sm font-medium">In Progress</span>
              )}
              <span className="text-xs text-gray-500">
                {completedEvaluations}/{totalInterviewers} completed
              </span>
            </div>
          );
        }

        // Legacy single-interviewer fallback
        if (interviewScores && interviewScores.total_score) {
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{interviewScores.total_score}</span>
              <span className="text-gray-500 text-sm">/ 50</span>
            </div>
          );
        }

        return <span className="text-gray-400 text-sm">Not interviewed</span>;
      },
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      size: 200,
    },

    {
      header: "",
      id: "action",
      size: 80,
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = (applicant: any) => {
  const { id, interview_scores, schedule_id, has_interview } = applicant;
  const { id: adhocId } = useParams();

  const pathname = usePathname();

  const type = pathname && pathname.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

  // Check if an interview has been created/scheduled
  // Priority: has_interview flag from parent (most reliable), then schedule_id, then interview_date
  const interviewCreated = has_interview || schedule_id || (interview_scores && interview_scores.interview_date);

  console.log('🔍 Interview Detection & Routing:', {
    applicantId: id,
    pathname,
    type,
    has_interview,
    schedule_id,
    interview_date: interview_scores?.interview_date,
    interviewCreated,
    interview_scores,
    interviewUrl: type === "ADHOC"
      ? `/dashboard/programs/adhoc-management/${adhocId}/applicant/${id}/adhoc-interview`
      : `/dashboard/c-and-g/consultancy/${adhocId}/applicant/${id}/interview`
  });

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
            <Link
              href={
                type === "ADHOC"
                  ? `/dashboard/programs/adhoc-management/${adhocId}/applicant/${id}/details`
                  : `/dashboard/c-and-g/consultancy/${adhocId}/applicant/${id}/details`
              }
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                View
              </Button>
            </Link>

            {interviewCreated && (
              <Link
                href={
                  type === "ADHOC"
                    ? `/dashboard/programs/adhoc-management/${adhocId}/applicant/${id}/adhoc-interview`
                    : `/dashboard/c-and-g/consultancy/${adhocId}/applicant/${id}/interview`
                }
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  Interview Candidate
                </Button>
              </Link>
            )}
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};
