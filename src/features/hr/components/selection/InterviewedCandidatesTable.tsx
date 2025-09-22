"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import EyeIcon from "components/icons/EyeIcon";
import DataTable from "components/Table/DataTable";
import FilterIcon from "components/icons/FilterIcon";
import { useAllInterviewedCandidates } from "@/features/hr/controllers/useAllInterviewedCandidates";
import { Loading } from "components/Loading";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import SearchBar from "components/atoms/SearchBar";
import { useState } from "react";
import { usePatchJobApplicationAccepted, usePatchJobApplicationPreferred, useUpdateJobApplicationToInterviewed, usePatchJobApplicationShortlisted } from "@/features/hr/controllers/hrJobApplicationsController";
import { useQueryClient } from "@tanstack/react-query";

interface InterviewedCandidate {
  id: string;
  applicant_first_name?: string;
  applicant_middle_name?: string;
  applicant_last_name?: string;
  applicant_email: string;
  position_applied: string;
  employment_type?: string;
  status: string; // Original database status
  realStatus: string; // Computed status (should be "INTERVIEWED" for interviewed candidates)
  advertisementTitle: string;
  advertisementId: string;
  interviewScore?: number;
  interviewCompleted: boolean;
  interviewScheduled: boolean;
  interview?: any;
}

const InterviewedCandidatesTable = () => {
  const { data: interviewedCandidates, isLoading, error, refetch } = useAllInterviewedCandidates();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className='text-center py-8 border rounded-md'>
        <p className='text-red-500'>Error loading interviewed candidates</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-start gap-2'>
        <SearchBar />
        <Button className='shadow-sm' variant='ghost'>
          <FilterIcon />
        </Button>
      </div>

      {interviewedCandidates.length === 0 ? (
        <div className='text-center py-8 border rounded-md'>
          <p className='text-gray-500'>
            No interviewed candidates found across all advertisements
          </p>
        </div>
      ) : (
        <DataTable
          data={interviewedCandidates}
          columns={getColumns(refetch)}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default InterviewedCandidatesTable;

const getColumns = (refetch: () => void): ColumnDef<InterviewedCandidate>[] => [
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
    header: "Candidate Name",
    accessorKey: "applicant_name",
    size: 250,
    cell: ({ row }) => (
      <p>
        {row?.original?.applicant_first_name}{" "}
        {row?.original?.applicant_middle_name}{" "}
        {row?.original?.applicant_last_name}
      </p>
    ),
  },
  {
    header: "Position Applied",
    accessorKey: "position_applied",
    size: 200,
    cell: ({ row }) => (
      <p>{typeof row?.original?.position_applied === 'string' ? row.original.position_applied : 'N/A'}</p>
    ),
  },
  {
    header: "Advertisement",
    accessorKey: "advertisementTitle",
    size: 200,
    cell: ({ row }) => (
      <p>{row?.original?.advertisementTitle || 'N/A'}</p>
    ),
  },
  {
    header: "Employment Type",
    accessorKey: "employment_type",
    size: 150,
    cell: ({ row }) => (
      <p>{typeof row?.original?.employment_type === 'string' ? row.original.employment_type : 'N/A'}</p>
    ),
  },
  {
    header: "Candidate Email",
    accessorKey: "applicant_email",
    cell: ({ row }) => (
      <p>{typeof row?.original?.applicant_email === 'string' ? row.original.applicant_email : 'N/A'}</p>
    ),
  },
  {
    header: "Interview Score",
    accessorKey: "interviewScore",
    size: 120,
    cell: ({ row }) => {
      const score = row.original.interviewScore;
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            score && score >= 70 ? "bg-green-50 text-green-500" :
            score && score >= 50 ? "bg-yellow-50 text-yellow-500" :
            "bg-red-50 text-red-500"
          )}
        >
          {score ? `${score}%` : 'N/A'}
        </Badge>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      // Use realStatus if available, fallback to original status, then default to INTERVIEWED
      const realStatus = row.original.realStatus?.toUpperCase();
      const originalStatus = row.original.status?.toUpperCase();

      // Debug logging
      console.log(`Status Debug for ${row.original.applicant_email}:`, {
        realStatus,
        originalStatus,
        interviewCompleted: row.original.interviewCompleted,
        fullData: row.original
      });

      // Priority: realStatus > originalStatus if it's ACCEPTED/PREFERRED > INTERVIEWED
      let displayStatus = "INTERVIEWED";

      if (originalStatus === "ACCEPTED" || originalStatus === "PREFERRED") {
        displayStatus = originalStatus;
      } else if (realStatus) {
        displayStatus = realStatus;
      }

      const isAccepted = displayStatus === "ACCEPTED";
      const isPreferred = displayStatus === "PREFERRED";
      const isInterviewed = displayStatus === "INTERVIEWED";

      return (
        <Badge
          className={cn(
            "p-1 rounded-lg capitalize",
            isAccepted ? "bg-black text-white" :
            isPreferred ? "bg-purple-50 text-purple-500" :
            isInterviewed ? "bg-green-50 text-green-500" :
            "bg-gray-50 text-gray-500"
          )}
        >
          {displayStatus}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 100,
    cell: ({ row }) => <ActionList data={row.original} refetch={refetch} />,
  },
];

const ActionList = ({ data, refetch }: { data: InterviewedCandidate; refetch: () => void }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isMarkingPreferred, setIsMarkingPreferred] = useState(false);
  const queryClient = useQueryClient();

  // Check if candidate is already accepted or preferred
  const isAlreadyAccepted = data.status === "ACCEPTED" || data.realStatus === "ACCEPTED";
  const isAlreadyPreferred = data.status === "PREFERRED" || data.realStatus === "PREFERRED";

  // Debug log the data being passed
  console.log("ActionList - Received data:", data);

  const { patchJobApplicationAccepted } = usePatchJobApplicationAccepted(data?.id as string);
  const { patchJobApplicationPreferred } = usePatchJobApplicationPreferred(data?.id as string);
  const { updateJobApplicationToInterviewed } = useUpdateJobApplicationToInterviewed(data?.id as string);
  const { patchJobApplicationShortlisted } = usePatchJobApplicationShortlisted(data?.id as string);

  const handleAccepted = async () => {
    if (isAccepting) return;
    setIsAccepting(true);

    try {
      console.log("🎯 Attempting to accept application");
      console.log("📋 Current data.status:", data?.status);
      console.log("📋 Current realStatus:", data?.realStatus);
      console.log("📋 Has completed interview:", data?.interviewCompleted);
      console.log("📋 Application ID:", data?.id);

      // Check if already accepted
      if (data.status === "ACCEPTED" || data.realStatus === "ACCEPTED") {
        console.log("✅ Candidate is already accepted");
        toast.success("Candidate is already accepted!");
        return;
      }

      // Backend requires strict status progression: APPLIED → SHORTLISTED → INTERVIEWED → ACCEPTED
      // Follow the proper workflow based on current status
      console.log("🚀 Step 1: Following proper status progression workflow");

      // Step 1: Ensure shortlisted status first (since backend says "must be shortlisted before interviewed")
      if (data.status !== "SHORTLISTED") {
        console.log("🔄 Step 1a: Ensuring status is SHORTLISTED first");
        try {
          await patchJobApplicationShortlisted({});
          console.log("✅ Shortlisted status set");
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (shortlistError) {
          console.error("❌ Failed to set shortlisted status:", shortlistError);
          toast.error("Failed to update to shortlisted status.");
          return;
        }
      }

      // Step 2: Mark as interviewed
      console.log("🔄 Step 1b: Marking as INTERVIEWED");
      try {
        const interviewResult = await updateJobApplicationToInterviewed();
        console.log("✅ Interview status set:", interviewResult);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (interviewError) {
        console.error("❌ Failed to set interview status:", interviewError);
        toast.error("Failed to update to interviewed status.");
        return;
      }

      // Step 3: Now accept the candidate
      console.log("🚀 Step 1c: Accepting candidate");
      try {
        const acceptResult = await patchJobApplicationAccepted({
          status: "ACCEPTED",
        });

        console.log("✅ Accept successful:", acceptResult);
        toast.success("Candidate accepted successfully!");

        // Update the React Query cache immediately (only after API success)
        queryClient.setQueryData(["all-interviewed-candidates"], (oldData: any) => {
          if (!oldData) return oldData;

          return oldData.map((candidate: InterviewedCandidate) => {
            if (candidate.id === data.id) {
              console.log("✅ Updating candidate status to ACCEPTED in cache");
              return {
                ...candidate,
                realStatus: "ACCEPTED",
                status: "ACCEPTED"
              };
            }
            return candidate;
          });
        });

        // Refresh the data from server to sync with backend
        setTimeout(() => {
          console.log("🔄 Refreshing table data from server");
          refetch();
        }, 3000);

        return; // Success, exit early

      } catch (acceptError) {
        console.error("❌ Accept failed even after proper workflow:", acceptError);
        toast.error("Failed to accept candidate.");
        return;
      }


    } catch (error) {
      console.error("❌ Overall accept process failed:", error);
      console.error("❌ Error response:", (error as any)?.response?.data);
      console.error("❌ Error status:", (error as any)?.response?.status);

      const errorMessage = (error as any)?.response?.data?.message ||
                          (error as any)?.response?.data?.error ||
                          (error as any)?.message ||
                          "Failed to update status";

      toast.error(`Failed to accept application: ${errorMessage}`);
    } finally {
      setIsAccepting(false);
    }
  };

  const handlePreferred = async () => {
    if (isMarkingPreferred) return;
    setIsMarkingPreferred(true);

    try {
      console.log("🎯 Attempting to mark as preferred");
      console.log("📋 Current data.status:", data?.status);
      console.log("📋 Application ID:", data?.id);

      // ALWAYS sync to INTERVIEWED first for interviewed candidates
      if (data?.interviewCompleted) {
        console.log("🔄 Syncing database status to INTERVIEWED before marking as preferred");

        try {
          const updateResult = await updateJobApplicationToInterviewed();
          console.log("✅ Status sync successful:", updateResult);

          // Longer delay to ensure backend consistency
          await new Promise(resolve => setTimeout(resolve, 3000));

          console.log("📋 Status synced, now proceeding with preferred");
        } catch (syncError) {
          console.error("❌ Failed to sync status to INTERVIEWED:", syncError);
          // Continue anyway as the backend might already know the interview is completed
          console.log("⚠️ Continuing with preferred despite sync error");
        }
      }

      console.log("🚀 Calling patchJobApplicationPreferred");
      const preferredResult = await patchJobApplicationPreferred({
        status: "PREFERRED",
      });

      console.log("✅ Mark as preferred successful:", preferredResult);
      toast.success("Candidate marked as preferred successfully");

      // Update the React Query cache immediately
      queryClient.setQueryData(["all-interviewed-candidates"], (oldData: any) => {
        if (!oldData) return oldData;

        return oldData.map((candidate: InterviewedCandidate) => {
          if (candidate.id === data.id) {
            console.log("✅ Updating candidate status to PREFERRED in cache");
            return {
              ...candidate,
              realStatus: "PREFERRED",
              status: "PREFERRED"
            };
          }
          return candidate;
        });
      });

      // Refresh the data from server to sync with backend
      setTimeout(() => {
        refetch();
      }, 2000);

    } catch (error) {
      console.error("❌ Mark as preferred error:", error);
      console.error("❌ Error response:", (error as any)?.response?.data);

      const errorMessage = (error as any)?.response?.data?.message ||
                          (error as any)?.response?.data?.error ||
                          (error as any)?.message ||
                          "Failed to update status";

      toast.error(`Failed to mark as preferred: ${errorMessage}`);
    } finally {
      setIsMarkingPreferred(false);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              href={`/dashboard/hr/advertisement/${data?.advertisementId}/submitted-applications/${data?.id}`}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View Details
              </Button>
            </Link>

            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={handleAccepted}
              disabled={isAccepting || isMarkingPreferred || isAlreadyAccepted}
            >
              <CheckCheckIcon />
              {isAccepting ? "Accepting..." :
               isAlreadyAccepted ? "Already Accepted" : "Accept Candidate"}
            </Button>

            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={handlePreferred}
              disabled={isAccepting || isMarkingPreferred || isAlreadyPreferred || isAlreadyAccepted}
            >
              <CheckCheckIcon />
              {isMarkingPreferred ? "Marking..." :
               isAlreadyPreferred ? "Already Preferred" :
               isAlreadyAccepted ? "Already Accepted" : "Mark as Preferred"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};