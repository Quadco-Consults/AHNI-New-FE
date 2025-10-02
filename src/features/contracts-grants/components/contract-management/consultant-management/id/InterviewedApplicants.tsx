"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DataTable from "components/Table/DataTable";
import { LoadingSpinner } from "components/Loading";
import { useGetAllConsultancyApplicants, useUpdateConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import Link from "next/link";
import { Badge } from "components/ui/badge";
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
  const consultancyId = params?.id as string;

  const { data, isFetching, error } = useGetAllConsultancyApplicants({
    page,
    size: 20,
    consultants: consultancyId,
    enabled: !!consultancyId,
  });

  // Map API response to expected format for interviewed applicants
  const mappedApplicants = data?.data?.results
    ?.filter(applicant => {
      // Filter out applicants that don't belong to this consultant management
      // If consultants field is undefined, trust the backend filtering (backward compatibility)
      const belongsToThisConsultant =
        applicant.consultants === undefined || // Backend filtered already, trust it
        applicant.consultants?.includes(consultancyId) ||
        applicant.consultancy === consultancyId ||
        applicant.consultant_id === consultancyId;

      return belongsToThisConsultant;
    })
    ?.map(applicant => ({
    ...applicant,
    // Map name fields
    first_name: applicant.first_name || applicant.name || 'Unknown',
    last_name: applicant.last_name || applicant.contractor_name || '',
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

  // Filter for interviewed applicants only
  const interviewedApplicants = mappedApplicants.filter(
    (applicant) => applicant.status === "INTERVIEWED"
  );

  console.log("🔍 InterviewedApplicants Debug:");
  console.log("- Current Consultancy ID:", consultancyId);
  console.log("- Original Results Count:", data?.data?.results?.length || 0);
  console.log("- Mapped Results Count:", mappedApplicants.length);
  console.log("- Interviewed Count:", interviewedApplicants.length);
  console.log("- Is Fetching:", isFetching);

  if (interviewedApplicants.length > 0) {
    console.log("✅ INTERVIEWED APPLICANT DATA:");
    interviewedApplicants.forEach((applicant, index) => {
      console.log(`  Interviewed ${index + 1}:`, {
        name: `${applicant.first_name} ${applicant.last_name}`,
        email: applicant.email,
        status: applicant.status,
        id: applicant.id
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
        const interviewScores = (row.original as any).interview_scores;
        if (!interviewScores || !interviewScores.total_score) {
          return <span className="text-gray-400 text-sm">Not scored</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{interviewScores.total_score}</span>
            <span className="text-gray-500 text-sm">/ 50</span>
          </div>
        );
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