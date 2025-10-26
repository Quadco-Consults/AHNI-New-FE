"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useDeleteConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { IConsultancyStaffPaginatedData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import EyeIcon from "components/icons/EyeIcon";

export const consultancyStaffColumns: ColumnDef<IConsultancyStaffPaginatedData>[] =
  [
    {
      header: "S/N",
      id: "serial",
      size: 60,
      cell: ({ row }) => row.index + 1,
    },

    {
      header: "Full Name",
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
      header: "Phone",
      id: "phone_number",
      accessorKey: "phone_number",
      size: 150,
    },

    {
      header: "Position",
      id: "position_under_contract",
      accessorKey: "position_under_contract",
      size: 180,
      cell: ({ row }) => {
        const applicant = row.original;

        // Try multiple field names for position
        const position = applicant.position_under_contract ||
                         applicant.position ||
                         applicant.job_title ||
                         applicant.role;

        // Debug logging
        console.log("🔍 Position Debug for applicant:", {
          id: applicant.id,
          name: applicant.name,
          position_under_contract: applicant.position_under_contract,
          position: applicant.position,
          job_title: applicant.job_title,
          role: applicant.role,
          resolved_position: position
        });

        return position && position.trim() !== '' ? position : "Position not specified";
      },
    },

    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      size: 120,
    },

    {
      header: "Interview Date",
      id: "interview_date",
      size: 130,
      cell: ({ row }) => {
        const applicant = row.original;

        // Try to get interview date from various possible sources
        const interviewDate = applicant.interview_date ||
                             applicant.date ||
                             applicant.schedule?.date ||
                             applicant.interview_scores?.interview_date;

        if (interviewDate) {
          try {
            const date = new Date(interviewDate);
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          } catch (error) {
            console.warn("Invalid interview date format:", interviewDate);
          }
        }

        // Fallback based on status
        if (applicant.status === 'INTERVIEWED') {
          return "Interview completed";
        }

        return "Not scheduled";
      },
    },

    {
      header: "Interview Score",
      id: "interview_score",
      size: 130,
      cell: ({ row }) => {
        const applicant = row.original;

        // Debug: Log the applicant data structure
        console.log("🔍 Interview Score Debug for applicant:", {
          id: applicant.id,
          name: applicant.name,
          status: applicant.status,
          interview_data: applicant.interview_data || applicant.interviews,
          average_score: applicant.average_score,
          total_score: applicant.total_score,
          all_score_related_keys: Object.keys(applicant).filter(key =>
            key.toLowerCase().includes('score') ||
            key.toLowerCase().includes('interview')
          ),
        });

        // Method 1: Check if applicant has interview_data array (linked interview records)
        const interviews = applicant.interview_data || applicant.interviews || applicant.scores;
        if (interviews && Array.isArray(interviews) && interviews.length > 0) {
          // Filter interviews with actual scores (non-zero total_score and valid individual scores)
          const completedInterviews = interviews.filter((interview: any) => {
            const hasValidTotalScore = interview.total_score && interview.total_score > 0;
            const hasIndividualScores = interview.relevant_experience !== null ||
                                      interview.communication_skills !== null ||
                                      interview.technical_skill !== null;
            return hasValidTotalScore || hasIndividualScores;
          });

          console.log(`📊 Found ${completedInterviews.length} completed interviews out of ${interviews.length} total`);

          if (completedInterviews.length > 0) {
            // Calculate average score from completed interviews
            let totalScore = 0;
            let scoreCount = 0;

            completedInterviews.forEach((interview: any) => {
              if (interview.total_score && interview.total_score > 0) {
                totalScore += interview.total_score;
                scoreCount++;
              } else {
                // Calculate from individual criteria if total_score is not available
                const criteriaScores = [
                  interview.relevant_experience,
                  interview.project_management,
                  interview.recent_experience,
                  interview.comparable_projects,
                  interview.communication_skills,
                  interview.technical_skill,
                  interview.relevant_qualification,
                  interview.academic_credentials,
                  interview.timeline_management,
                  interview.toolset_framework
                ].filter(score => score !== null && score > 0);

                if (criteriaScores.length > 0) {
                  const interviewTotal = criteriaScores.reduce((sum, score) => sum + score, 0);
                  totalScore += interviewTotal;
                  scoreCount++;
                }
              }
            });

            if (scoreCount > 0) {
              const averageScore = totalScore / scoreCount;
              // Assuming max possible score is 50 (10 criteria × 5 points each)
              const percentage = (averageScore / 50) * 100;
              console.log(`✅ Calculated average from ${scoreCount} interviews: ${averageScore} -> ${percentage.toFixed(1)}%`);
              return `${percentage.toFixed(1)}%`;
            }
          }

          // Check for incomplete interviews (committee interviews with total_score but null individual scores)
          const incompleteInterviews = interviews.filter((interview: any) =>
            interview.total_score > 0 && interview.relevant_experience === null
          );

          if (incompleteInterviews.length > 0) {
            const completedCount = completedInterviews.length;
            const totalCount = interviews.length;
            return `Scoring in progress (${completedCount}/${totalCount})`;
          }
        }

        // Method 2: Check for direct score fields on applicant
        if (applicant.total_score && applicant.total_score > 0) {
          const percentage = (applicant.total_score / 50) * 100;
          console.log(`✅ Using applicant total_score: ${applicant.total_score} -> ${percentage.toFixed(1)}%`);
          return `${percentage.toFixed(1)}%`;
        }

        if (applicant.average_score && applicant.average_score > 0) {
          const percentage = (applicant.average_score / 50) * 100;
          console.log(`✅ Using applicant average_score: ${applicant.average_score} -> ${percentage.toFixed(1)}%`);
          return `${percentage.toFixed(1)}%`;
        }

        // Method 3: Check legacy interview_scores object
        const legacyScores = applicant.interview_scores;
        if (legacyScores && typeof legacyScores === 'object') {
          if (legacyScores.total_score && legacyScores.total_score > 0) {
            const percentage = (legacyScores.total_score / 50) * 100;
            console.log(`✅ Using legacy interview_scores: ${percentage.toFixed(1)}%`);
            return `${percentage.toFixed(1)}%`;
          }

          // Calculate from individual criteria
          const criteriaScores = [
            legacyScores.relevant_experience,
            legacyScores.project_management,
            legacyScores.recent_experience,
            legacyScores.comparable_projects,
            legacyScores.communication_skills,
            legacyScores.technical_skill,
            legacyScores.relevant_qualification,
            legacyScores.academic_credentials,
            legacyScores.timeline_management,
            legacyScores.toolset_framework
          ].filter(score => typeof score === 'number' && score > 0);

          if (criteriaScores.length > 0) {
            const totalScore = criteriaScores.reduce((sum, score) => sum + score, 0);
            const percentage = (totalScore / 50) * 100;
            console.log(`✅ Calculated from legacy criteria: ${percentage.toFixed(1)}%`);
            return `${percentage.toFixed(1)}%`;
          }
        }

        // Fallback based on status
        if (applicant.status === 'INTERVIEWED') {
          console.warn("⚠️ Applicant is INTERVIEWED but no scores found");
          return "Interview completed";
        }

        return "Not scored";
      },
    },

    {
      header: "Actions",
      id: "action",
      size: 80,
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IConsultancyStaffPaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const params = useParams();
  const adhocId = params?.id as string;

  const pathname = usePathname();

  const type = pathname?.includes("adhoc-management")
    ? "ADHOC"
    : pathname?.includes("facilitator-management")
    ? "FACILITATOR"
    : "CONSULTANT";

  const viewPath =
    type === "ADHOC"
      ? ProgramRoutes.ADHOC_APPLICANT_DETAILS
      : type === "FACILITATOR"
      ? CG_ROUTES.FACILITATOR_APPLICANT_DETAILS
      : CG_ROUTES.CONSULTANCY_APPLICANT_DETAILS;

  const editPath =
    type === "ADHOC"
      ? ProgramRoutes.CREATE_ADHOC_APPLICANT
      : type === "FACILITATOR"
      ? CG_ROUTES.CREATE_FACILITATOR_ADVERT_APPLICANT
      : CG_ROUTES.CREATE_CONSULTANCY_APPLICANT;

  const { deleteConsultancyApplicant, isLoading } = useDeleteConsultancyApplicant(id);

  const handleDelete = async () => {
    try {
      await deleteConsultancyApplicant();
      toast.success("Applicant Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

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
              href={viewPath
                .replace(":adhocId", adhocId)
                .replace(":applicantId", id)}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View
              </Button>
            </Link>

            <Link href={`${editPath.replace(":id", adhocId)}?id=${id}`}>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>

            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this expenditure?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
