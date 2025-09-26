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
import { Eye, FileCheck } from "lucide-react";
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
  const [issuingContract, setIssuingContract] = useState<string | null>(null);
  const params = useParams();
  const consultancyId = params?.id as string;

  const { data, isFetching, error } = useGetAllConsultancyApplicants({
    page,
    size: 20,
    consultancy: consultancyId,
    enabled: !!consultancyId,
  });

  // Enhanced Debug logging for interviewed applicants
  console.log("🔍 InterviewedApplicants Debug:");
  console.log("- Current Consultancy ID:", consultancyId);
  console.log("- Raw Data:", data);
  console.log("- Results Count:", data?.data?.results?.length || 0);

  if (data?.data?.results) {
    console.log("🚨 ALL APPLICANTS ANALYSIS:");
    data.data.results.forEach((applicant, index) => {
      console.log(`  Applicant ${index + 1}:`, {
        name: `${applicant.first_name} ${applicant.last_name}`,
        consultant_id: applicant.consultant_id || applicant.consultancy || "NOT_SET",
        status: applicant.status,
        id: applicant.id
      });
    });
  }

  // First filter only interviewed applicants, then filter by correct consultant ID
  const allInterviewedApplicants = data?.data?.results?.filter(
    (applicant) => applicant.status === "INTERVIEWED"
  ) || [];

  // TEMPORARY FIX: Filter interviewed applicants to ensure only correct consultant ID
  const interviewedApplicants = allInterviewedApplicants.filter(applicant => {
    const applicantConsultantId = applicant.consultant_id || applicant.consultancy;
    return applicantConsultantId === consultancyId;
  });

  console.log("✅ FILTERED INTERVIEWED (client-side):", interviewedApplicants.length, "out of", allInterviewedApplicants.length, "interviewed applicants");

  // Contract issuance handler
  const handleIssueContract = async (applicantId: string, applicantName: string) => {
    const confirmIssue = window.confirm(
      `Are you sure you want to issue a contract to ${applicantName}?`
    );

    if (!confirmIssue) return;

    setIssuingContract(applicantId);

    try {
      // Make API call to update applicant status to CONTRACT_ISSUED
      await AxiosWithToken.patch(`/contract-grants/consultancy/applicants/${applicantId}/`, {
        status: 'CONTRACT_ISSUED'
      });

      toast.success(`Contract issued to ${applicantName} successfully!`);
      toast.info(`${applicantName} can now access the contract acceptance form.`);

      // Refresh the data to update the UI
      window.location.reload();

    } catch (error) {
      console.error("Contract issuance error:", error);

      if (error instanceof Error) {
        toast.error(`Failed to issue contract: ${error.message}`);
      } else {
        toast.error("Failed to issue contract. Please try again.");
      }
    } finally {
      setIssuingContract(null);
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
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const applicant = row.original;
        const applicantName = `${applicant.first_name} ${applicant.last_name}`;
        const isIssuing = issuingContract === applicant.id;

        return (
          <div className="flex gap-2">
            <Link
              href={`/dashboard/programs/adhoc-management/${consultancyId}/applicant/${applicant.id}/details`}
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
                Applicants will appear here after completing their interviews
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}