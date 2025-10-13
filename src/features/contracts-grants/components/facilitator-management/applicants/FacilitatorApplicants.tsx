"use client";

import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { toast } from "sonner";
import {
  useGetAllFacilitatorApplicants,
  useUpdateFacilitatorApplicantStatus
} from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import { IFacilitatorApplicantPaginatedData } from "@/features/contracts-grants/types/contract-management/facilitator-management/facilitator-application";

interface FacilitatorApplicantsProps {
  facilitatorId: string;
}

export default function FacilitatorApplicants({ facilitatorId }: FacilitatorApplicantsProps) {
  const [page, setPage] = useState(1);

  // Get facilitator applicants from API
  const { data: applicantsResponse, isLoading, refetch } = useGetAllFacilitatorApplicants({
    page,
    size: 10,
    facilitator_id: facilitatorId,
    enabled: !!facilitatorId,
  });

  const { updateFacilitatorApplicantStatus, isLoading: isUpdating } = useUpdateFacilitatorApplicantStatus();

  const applicants = applicantsResponse?.data?.results || [];
  const totalCount = applicantsResponse?.data?.pagination?.count || 0;

  // Debug logging
  console.log('🔍 FacilitatorApplicants Debug:', {
    facilitatorId,
    isLoading,
    applicantsResponse,
    applicants,
    totalCount,
    page
  });

  // Log first applicant structure to see what fields are available
  if (applicants.length > 0) {
    console.log('📋 First applicant structure:', applicants[0]);
  }


  const handleApprove = async (applicantId: string) => {
    try {
      console.log('🔍 Approving facilitator applicant:', applicantId);
      await updateFacilitatorApplicantStatus(applicantId, "APPROVED");
      toast.success("Facilitator approved successfully and moved to facilitator database");
      refetch(); // Refresh the data
    } catch (error: any) {
      console.error('❌ Failed to approve facilitator:', error);
      toast.error(error?.message || "Failed to approve facilitator");
    }
  };

  const handleReject = async (applicantId: string) => {
    try {
      console.log('🔍 Rejecting facilitator applicant:', applicantId);
      await updateFacilitatorApplicantStatus(applicantId, "REJECTED");
      toast.success("Facilitator rejected successfully");
      refetch(); // Refresh the data
    } catch (error: any) {
      console.error('❌ Failed to reject facilitator:', error);
      toast.error(error?.message || "Failed to reject facilitator");
    }
  };

  const columns: ColumnDef<IFacilitatorApplicantPaginatedData>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        // Try to get name from different possible fields
        const name = row.original.name;
        if (name && typeof name === 'string') {
          return name;
        }

        // Fallback to first_name + last_name if name field doesn't exist
        const firstName = typeof row.original.first_name === 'string' ? row.original.first_name : '';
        const lastName = typeof row.original.last_name === 'string' ? row.original.last_name : '';
        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || 'N/A';
      }
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => {
        const email = row.original.email;
        return typeof email === 'string' ? email : 'N/A';
      }
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: ({ row }) => {
        const phone = row.original.phone_number;
        return typeof phone === 'string' ? phone : 'N/A';
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusText = typeof status === 'string' ? status : 'UNKNOWN';
        return (
          <Badge
            variant="default"
            className={cn(
              "p-1 rounded-lg",
              statusText === "APPLIED" && "bg-blue-200 text-blue-500",
              statusText === "APPROVED" && "bg-green-200 text-green-500",
              statusText === "REJECTED" && "bg-red-200 text-red-500"
            )}
          >
            {statusText}
          </Badge>
        );
      }
    },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => {
        const { id, status } = row.original;

        if (status === "APPLIED") {
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApprove(id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(id)}
              >
                Reject
              </Button>
            </div>
          );
        }

        if (status === "APPROVED") {
          return (
            <span className="text-green-600 font-medium">✓ Approved</span>
          );
        }

        if (status === "REJECTED") {
          return (
            <span className="text-red-600 font-medium">✗ Rejected</span>
          );
        }

        return <span className="text-gray-500">No action available</span>;
      }
    }
  ];

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Facilitator Applicants</h2>
        <p className="text-gray-600 mb-6">
          Review and approve facilitator applications. Approved facilitators will be added to the facilitator database.
        </p>

        <TableFilters>
          <DataTable
            columns={columns}
            data={applicants}
            isLoading={isLoading || isUpdating}
            pagination={{
              total: totalCount,
              pageSize: 10,
              onChange: setPage,
            }}
          />
        </TableFilters>
      </div>
    </Card>
  );
}