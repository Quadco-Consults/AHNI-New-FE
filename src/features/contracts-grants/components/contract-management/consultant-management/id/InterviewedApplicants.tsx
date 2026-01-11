"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import DataTable from "@/components/Table/DataTable";
import { LoadingSpinner } from "@/components/Loading";
import { useGetAllConsultancyApplicants, useUpdateConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import { useGetAllConsultancyInterviews } from "@/features/contracts-grants/controllers/consultancyInterviewController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { Eye, CheckCircle, FileCheck } from "lucide-react";
import { toast } from "sonner";

interface InterviewedApplicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  position?: string;
  status: string;
  created_datetime: string;
  updated_datetime: string;
}

export default function InterviewedApplicants() {
  const [page, setPage] = useState(1);
  const [acceptingApplicant, setAcceptingApplicant] = useState<string | null>(null);
  const params = useParams();
  const pathname = usePathname();
  const consultancyId = params?.id as string;

  // Detect if we're in adhoc mode
  const isAdhoc = !!(pathname && pathname.includes("adhoc-management"));

  // Call appropriate API based on type
  const consultancyQuery = useGetAllConsultancyApplicants({
    page,
    size: 20,
    consultants: consultancyId,
    enabled: !isAdhoc && !!consultancyId,
  });

  const adhocQuery = useGetApplicantsByAdvertisement(
    consultancyId,
    {
      page,
      size: 20,
      status: "INTERVIEWED",
      enabled: isAdhoc && !!consultancyId,
    }
  );

  // Fetch interview data for consultancy applicants
  const interviewQuery = useGetAllConsultancyInterviews(
    !isAdhoc ? consultancyId : undefined, // Only fetch for consultancy, not adhoc
    !isAdhoc && !!consultancyId // Only enable for consultancy
  );

  // Use the appropriate query result
  const { data, isFetching, error } = isAdhoc ? adhocQuery : consultancyQuery;

  // Map API response to expected format for interviewed applicants
  const mappedApplicants = data?.data?.results
    ?.filter((applicant: any) => {
      if (isAdhoc) {
        // For adhoc, API already filters by advertisement_id
        return true;
      }
      // Filter out applicants that don't belong to this consultant management
      // If consultants field is undefined, trust the backend filtering (backward compatibility)
      const belongsToThisConsultant =
        applicant.consultants === undefined || // Backend filtered already, trust it
        applicant.consultants?.includes(consultancyId) ||
        applicant.consultancy === consultancyId ||
        applicant.consultant_id === consultancyId;

      return belongsToThisConsultant;
    })
    ?.map((applicant: any) => ({
    ...applicant,
    // Map name fields - handle both consultancy and adhoc structures
    first_name: applicant.first_name || applicant.other_names || applicant.name || 'Unknown',
    last_name: applicant.last_name || applicant.sur_name || applicant.contractor_name || '',
    email: applicant.email || applicant.email_address,
    // Map position field from various possible field names
    position: applicant.position_under_contract ||
              applicant.position ||
              applicant.job_title ||
              applicant.role ||
              'Position not specified',
    // Ensure consultant_id is present
    consultant_id: applicant.consultant_id || consultancyId,
    consultancy: applicant.consultancy || consultancyId,
    // Handle potentially problematic fields
    technical_monitor_user: typeof applicant.technical_monitor_user === 'object'
      ? applicant.technical_monitor_user?.name || 'N/A'
      : applicant.technical_monitor_user || 'N/A',
    location: typeof applicant.location === 'object'
      ? applicant.location?.name || 'N/A'
      : applicant.location || 'N/A',
    project: typeof applicant.project === 'object'
      ? applicant.project?.name || 'N/A'
      : applicant.project || 'N/A',
    contract_request: typeof applicant.contract_request === 'object'
      ? applicant.contract_request?.name || 'N/A'
      : applicant.contract_request || 'N/A',
  })) || [];

  // Function to merge interview data with applicant data
  const mergeInterviewData = (applicants: any[], interviews: any) => {
    // Handle different interview data structures
    const interviewArray = Array.isArray(interviews)
      ? interviews
      : interviews?.data
      ? (Array.isArray(interviews.data) ? interviews.data : [])
      : [];

    if (!interviewArray || interviewArray.length === 0) return applicants;

    return applicants.map(applicant => {
      // Find all interviews for this applicant
      const applicantInterviews = interviewArray.filter((interview: any) =>
        interview.applicant === applicant.id
      );

      if (applicantInterviews.length === 0) {
        return applicant;
      }

      // Calculate aggregated interview data
      const completedInterviews = applicantInterviews.filter((interview: any) =>
        interview.total_score > 0 || interview.relevant_experience !== null
      );

      if (completedInterviews.length === 0) {
        return applicant;
      }

      // Calculate average score
      let totalScore = 0;
      let scoreCount = 0;

      completedInterviews.forEach((interview: any) => {
        if (interview.total_score && interview.total_score > 0) {
          totalScore += interview.total_score;
          scoreCount++;
        }
      });

      if (scoreCount > 0) {
        const averageScore = totalScore / scoreCount;
        return {
          ...applicant,
          total_score: averageScore,
          average_score: averageScore,
          interview_data: applicantInterviews
        };
      }

      return applicant;
    });
  };

  // Get interview data for merging
  const interviewData = interviewQuery.data?.data || [];

  // Debug: Log the interview data structure
  console.log("🔍 Interview Data Structure Debug:", {
    raw_response: interviewQuery.data,
    data_field: interviewQuery.data?.data,
    data_type: typeof interviewQuery.data?.data,
    is_array: Array.isArray(interviewQuery.data?.data),
    length: interviewQuery.data?.data?.length || 0,
    first_item: interviewQuery.data?.data?.[0] || null
  });

  // Merge interview data with applicants (only for consultancy)
  const applicantsWithScores = !isAdhoc
    ? mergeInterviewData(mappedApplicants, interviewData)
    : mappedApplicants;

  // Filter for interviewed applicants only
  const interviewedApplicants = applicantsWithScores.filter(
    (applicant) => applicant.status === "INTERVIEWED"
  );

  console.log("🔍 InterviewedApplicants Debug:");
  console.log("- Current Consultancy ID:", consultancyId);
  console.log("- Original Results Count:", data?.data?.results?.length || 0);
  console.log("- Mapped Results Count:", mappedApplicants.length);
  console.log("- Interview Data Count:", interviewData.length);
  console.log("- Applicants With Scores Count:", applicantsWithScores.length);
  console.log("- Interviewed Count:", interviewedApplicants.length);
  console.log("- Is Fetching:", isFetching);

  if (interviewedApplicants.length > 0) {
    console.log("✅ INTERVIEWED APPLICANT DATA:");
    interviewedApplicants.forEach((applicant, index) => {
      console.log(`  Interviewed ${index + 1}:`, {
        name: `${applicant.first_name} ${applicant.last_name}`,
        email: applicant.email,
        position: applicant.position,
        status: applicant.status,
        id: applicant.id,
        total_score: applicant.total_score,
        average_score: applicant.average_score,
        has_interview_data: !!applicant.interview_data,
        position_fields: {
          position_under_contract: applicant.position_under_contract,
          position: applicant.position,
          job_title: applicant.job_title,
          role: applicant.role
        }
      });
    });
  }

  // Accept applicant handler
  const handleAcceptApplicant = async (applicantId: string, applicantName: string) => {
    const confirmAccept = window.confirm(
      `Are you sure you want to accept ${applicantName} as a candidate?`
    );

    if (!confirmAccept) return;

    setAcceptingApplicant(applicantId);

    try {
      // Make API call to update applicant status to ACCEPTED
      console.log("Accepting applicant:", applicantId);
      const response = await AxiosWithToken.patch(`/contract-grants/consultancy/applicants/${applicantId}/`, {
        status: 'ACCEPTED'
      });
      console.log("Accept response:", response);

      toast.success(`${applicantName} has been accepted successfully!`);
      toast.info(`You can now issue a contract to ${applicantName} from the Accepted Candidates tab.`);

      // Refresh the data to update the UI
      window.location.reload();

    } catch (error: any) {
      console.error("Accept applicant error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);

      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.response?.data?.detail
        || error.message
        || "Failed to accept applicant. Please try again.";

      toast.error(`Failed to accept applicant: ${errorMessage}`);
    } finally {
      setAcceptingApplicant(null);
    }
  };

  const columns: ColumnDef<InterviewedApplicant>[] = [
    {
      header: "S/N",
      accessorFn: (_, index) => index + 1,
      size: 60,
    },
    {
      header: "Full Name",
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue() as string}</div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-600">{getValue() as string}</div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone_number",
      cell: ({ getValue }) => (
        <div className="text-sm">{getValue() as string || "N/A"}</div>
      ),
    },
    {
      header: "Position",
      accessorKey: "position",
      cell: ({ getValue }) => (
        <div className="text-sm">{getValue() as string || "N/A"}</div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {getValue() as string}
        </Badge>
      ),
    },
    {
      header: "Interview Date",
      accessorKey: "updated_datetime",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        if (!date || !isValid(new Date(date))) return "N/A";
        return format(new Date(date), "MMM dd, yyyy");
      },
    },
    {
      header: "Interview Score",
      id: "interview_score",
      size: 150,
      cell: ({ row }) => {
        const applicant = row.original as any;

        console.log("🔍 Interview Score Cell Debug:", {
          applicant_id: applicant.id,
          name: `${applicant.first_name} ${applicant.last_name}`,
          status: applicant.status,
          total_score: applicant.total_score,
          average_score: applicant.average_score,
          interview_scores: applicant.interview_scores,
          interview_data: applicant.interview_data,
          all_score_keys: Object.keys(applicant).filter(key =>
            key.toLowerCase().includes('score') || key.toLowerCase().includes('interview')
          )
        });

        // Method 1: Check direct scores from merged interview data
        const directScore = applicant.total_score || applicant.average_score;
        if (directScore && directScore > 0) {
          const percentage = (directScore / 50) * 100;
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{directScore.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">/ 50</span>
              <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
            </div>
          );
        }

        // Method 2: Check interview_data array (from merged data)
        const interviewData = applicant.interview_data;
        if (interviewData && Array.isArray(interviewData) && interviewData.length > 0) {
          const completedInterviews = interviewData.filter((interview: any) =>
            interview.total_score && interview.total_score > 0
          );

          if (completedInterviews.length > 0) {
            const totalScore = completedInterviews.reduce((sum: number, interview: any) =>
              sum + interview.total_score, 0
            );
            const averageScore = totalScore / completedInterviews.length;
            const percentage = (averageScore / 50) * 100;

            return (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{averageScore.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">/ 50</span>
                <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
              </div>
            );
          }
        }

        // Method 3: Check legacy interview_scores object
        const interviewScores = applicant.interview_scores;
        if (interviewScores && interviewScores.total_score && interviewScores.total_score > 0) {
          const percentage = (interviewScores.total_score / 50) * 100;
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{interviewScores.total_score}</span>
              <span className="text-gray-500 text-sm">/ 50</span>
              <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
            </div>
          );
        }

        // For interviewed applicants without scores, show pending status
        if (applicant.status === 'INTERVIEWED') {
          return <span className="text-orange-500 text-sm">Score pending</span>;
        }

        return <span className="text-gray-400 text-sm">Not scored</span>;
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const applicant = row.original;
        const applicantName = `${applicant.first_name} ${applicant.last_name}`;
        const isAccepting = acceptingApplicant === applicant.id;

        return (
          <div className="flex gap-2">
            <Link
              href={`/dashboard/c-and-g/consultancy/${consultancyId}/applicant/${applicant.id}/details`}
            >
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
              disabled={isAccepting}
              onClick={() => handleAcceptApplicant(applicant.id, applicantName)}
            >
              <CheckCircle className="h-3 w-3" />
              {isAccepting ? "Accepting..." : "Accept Candidate"}
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading interviewed applicants: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Interviewed Applicants</h3>
          <p className="text-sm text-gray-600">
            Applicants who have completed their interviews and are ready for contract issuance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {interviewedApplicants.length} Interviewed
          </Badge>
        </div>
      </div>

      {isFetching ? (
        <LoadingSpinner />
      ) : interviewedApplicants.length > 0 ? (
        <DataTable
          columns={columns}
          data={interviewedApplicants}
          isLoading={isFetching}
          pagination={{
            total: interviewedApplicants.length,
            pageSize: 20,
            onChange: setPage,
          }}
        />
      ) : (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">No Interviewed Applicants</h4>
              <p className="text-sm text-gray-500 mt-1">
                Applicants will appear here after completing their interviews. Accept candidates to move them to the Accepted Candidates tab.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}