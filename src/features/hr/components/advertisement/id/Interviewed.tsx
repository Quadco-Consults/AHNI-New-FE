"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import DataTable from "components/Table/DataTable";
import { Loading } from "components/Loading";
import { useCombinedApplicationStatus } from "@/features/hr/controllers/useCombinedApplicationStatus";
import { usePatchJobApplicationAccepted } from "@/features/hr/controllers/hrJobApplicationsController";
import { JobAdvertisement } from "@/features/hr/types/job-advertisement";
import Link from "next/link";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";

interface InterviewedApplicant {
  id: string;
  applicant_first_name: string;
  applicant_middle_name?: string;
  applicant_last_name: string;
  applicant_email: string;
  position_applied: string;
  interviewScore?: number;
  interview?: any;
  advertisement: string;
}

const Interviewed = ({ id }: JobAdvertisement) => {
  // Get all applications with interview status
  const { data: combinedData, isLoading } = useCombinedApplicationStatus(id, "");

  // Filter only interviewed applicants and sort by score (highest to lowest)
  const interviewedApplicants = (combinedData || [])
    .filter((app: any) => app.interviewCompleted)
    .sort((a: any, b: any) => {
      const scoreA = Number(a.interviewScore) || 0;
      const scoreB = Number(b.interviewScore) || 0;
      return scoreB - scoreA; // Descending order
    });

  const columns: ColumnDef<InterviewedApplicant>[] = [
    {
      header: "Rank",
      size: 80,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge
            className={`px-3 py-1 ${
              row.index === 0
                ? "bg-yellow-400 text-black"
                : row.index === 1
                ? "bg-gray-300 text-black"
                : row.index === 2
                ? "bg-orange-300 text-black"
                : "bg-gray-100 text-black"
            }`}
          >
            #{row.index + 1}
          </Badge>
        </div>
      ),
    },
    {
      header: "Applicant Name",
      accessorKey: "applicant_name",
      size: 250,
      cell: ({ row }) => (
        <p>
          {row.original.applicant_first_name}{" "}
          {row.original.applicant_middle_name}{" "}
          {row.original.applicant_last_name}
        </p>
      ),
    },
    {
      header: "Position Applied",
      accessorKey: "position_applied",
      size: 200,
      cell: ({ row }) => (
        <p>
          {typeof row.original.position_applied === "string"
            ? row.original.position_applied
            : "N/A"}
        </p>
      ),
    },
    {
      header: "Email",
      accessorKey: "applicant_email",
      size: 200,
      cell: ({ row }) => (
        <p>
          {typeof row.original.applicant_email === "string"
            ? row.original.applicant_email
            : "N/A"}
        </p>
      ),
    },
    {
      header: "Interview Score",
      accessorKey: "interviewScore",
      size: 150,
      cell: ({ row }) => {
        const score = Number(row.original.interviewScore) || 0;
        return (
          <Badge
            className={`px-3 py-1 text-white ${
              score >= 80
                ? "bg-green-500"
                : score >= 60
                ? "bg-blue-500"
                : score >= 40
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {score.toFixed(1)}%
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 100,
      cell: ({ row }) => (
        <ActionList
          data={row.original}
          advertisementId={id || ""}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Interviewed Applicants</h2>
          <p className="text-sm text-gray-600">
            {interviewedApplicants.length} applicant(s) have been interviewed
          </p>
        </div>
      </div>

      <div className="my-3 border" />

      {interviewedApplicants.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">No interviewed applicants found</p>
        </div>
      ) : (
        <DataTable
          // @ts-ignore
          data={interviewedApplicants}
          columns={columns}
          isLoading={false}
        />
      )}

    </div>
  );
};

const ActionList = ({
  data,
  advertisementId,
}: {
  data: InterviewedApplicant;
  advertisementId: string;
}) => {
  const { patchJobApplicationAccepted } = usePatchJobApplicationAccepted(data.id);

  const handleSelectCandidate = async () => {
    try {
      await patchJobApplicationAccepted({ status: "ACCEPTED" });
      toast.success("Candidate selected successfully! They have been moved to the accepted list.");
    } catch (error) {
      console.error("Error selecting candidate:", error);
      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Failed to select candidate";
      toast.error(`Failed to select candidate: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col items-start justify-between gap-1">
            <Link
              href={`/dashboard/hr/advertisement/${advertisementId}/interviewed/${data.id}`}
            >
              <Button
                className="w-full flex items-center justify-start gap-2"
                variant="ghost"
              >
                <EyeIcon />
                View Details
              </Button>
            </Link>

            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
              onClick={handleSelectCandidate}
            >
              <CheckCheckIcon />
              Select Candidate
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Interviewed;
