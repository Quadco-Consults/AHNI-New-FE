"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import DataTable from "@/components/Table/DataTable";
import { LoadingSpinner } from "@/components/Loading";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { Eye, FileCheck } from "lucide-react";
import { toast } from "sonner";

interface AcceptedApplicant {
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

export default function AcceptedApplicants() {
  const [page, setPage] = useState(1);
  const [issuingContract, setIssuingContract] = useState<string | null>(null);
  const params = useParams();
  const pathname = usePathname();
  const consultancyId = params?.id as string;

  // Detect if we're in adhoc mode
  const isAdhoc = pathname && pathname.includes("adhoc-management");

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
      status: "SELECTED",
      enabled: isAdhoc && !!consultancyId,
    }
  );

  // Use the appropriate query result
  const { data, isFetching, error } = isAdhoc ? adhocQuery : consultancyQuery;

  // Map API response to expected format for accepted applicants
  const mappedApplicants = data?.data?.results
    ?.filter(applicant => {
      if (isAdhoc) {
        // For adhoc, API already filters by advertisement_id
        return true;
      }
      // Filter out applicants that don't belong to this consultant management
      const belongsToThisConsultant =
        applicant.consultants === undefined || // Backend filtered already, trust it
        applicant.consultants?.includes(consultancyId) ||
        applicant.consultancy === consultancyId ||
        applicant.consultant_id === consultancyId;

      return belongsToThisConsultant;
    })
    ?.map(applicant => ({
    ...applicant,
    // Map name fields - handle both consultancy and adhoc structures
    first_name: applicant.first_name || applicant.other_names || applicant.name || 'Unknown',
    last_name: applicant.last_name || applicant.sur_name || applicant.contractor_name || '',
    email: applicant.email || applicant.email_address,
    phone_number: applicant.phone_number,
    // Ensure consultant_id is present for consultancy
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

  // Filter for accepted applicants only (ACCEPTED for consultancy, SELECTED/HIRED for adhoc)
  const acceptedApplicants = mappedApplicants.filter(
    (applicant) => isAdhoc
      ? (applicant.status === "SELECTED" || applicant.status === "HIRED")
      : applicant.status === "ACCEPTED"
  );

  console.log("🔍 AcceptedApplicants Debug:");
  console.log("- Current Consultancy ID:", consultancyId);
  console.log("- Original Results Count:", data?.data?.results?.length || 0);
  console.log("- Mapped Results Count:", mappedApplicants.length);
  console.log("- Accepted Count:", acceptedApplicants.length);
  console.log("- Is Fetching:", isFetching);

  if (acceptedApplicants.length > 0) {
    console.log("✅ ACCEPTED APPLICANT DATA:");
    acceptedApplicants.forEach((applicant, index) => {
      console.log(`  Accepted ${index + 1}:`, {
        name: `${applicant.first_name} ${applicant.last_name}`,
        email: applicant.email,
        status: applicant.status,
        id: applicant.id
      });
    });
  }

  // Contract issuance handler
  const handleIssueContract = async (applicantId: string, applicantName: string) => {
    const confirmIssue = window.confirm(
      `Are you sure you want to issue a contract to ${applicantName}?`
    );

    if (!confirmIssue) return;

    setIssuingContract(applicantId);

    try {
      // Make API call to update applicant status to CONTRACT_ISSUED
      console.log("Issuing contract to applicant:", applicantId);
      const response = await AxiosWithToken.patch(`/contract-grants/consultancy/applicants/${applicantId}/`, {
        status: 'CONTRACT_ISSUED'
      });
      console.log("Contract issuance response:", response);

      toast.success(`Contract issued to ${applicantName} successfully!`);
      toast.info(`${applicantName} can now access the contract acceptance form.`);

      // Refresh the data to update the UI
      window.location.reload();

    } catch (error: any) {
      console.error("Contract issuance error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);

      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.response?.data?.detail
        || error.message
        || "Failed to issue contract. Please try again.";

      toast.error(`Failed to issue contract: ${errorMessage}`);
    } finally {
      setIssuingContract(null);
    }
  };

  const columns: ColumnDef<AcceptedApplicant>[] = [
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
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {getValue() as string}
        </Badge>
      ),
    },
    {
      header: "Accepted Date",
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
            <span className="text-gray-500 text-sm">/ 55</span>
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
        const isIssuing = issuingContract === applicant.id;

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
              disabled={isIssuing}
              onClick={() => handleIssueContract(applicant.id, applicantName)}
            >
              <FileCheck className="h-3 w-3" />
              {isIssuing ? "Issuing..." : "Issue Contract"}
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading accepted applicants: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Accepted Candidates</h3>
          <p className="text-sm text-gray-600">
            Candidates who have been accepted after interview review and are ready for contract issuance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {acceptedApplicants.length} Accepted
          </Badge>
        </div>
      </div>

      {isFetching ? (
        <LoadingSpinner />
      ) : acceptedApplicants.length > 0 ? (
        <DataTable
          columns={columns}
          data={acceptedApplicants}
          isLoading={isFetching}
          pagination={{
            total: acceptedApplicants.length,
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
              <h4 className="font-medium text-gray-700">No Accepted Candidates</h4>
              <p className="text-sm text-gray-500 mt-1">
                Candidates will appear here after you accept them from the Interviewed Applicants tab
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}