"use client";

import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    facilitators: facilitatorId, // Use facilitators (many-to-many field)
    enabled: !!facilitatorId,
  });

  const { updateFacilitatorApplicantStatus, isLoading: isUpdating } = useUpdateFacilitatorApplicantStatus();

  const applicants = applicantsResponse?.data?.results || [];
  const totalCount = applicantsResponse?.data?.pagination?.count || 0;


  const handleSelect = async (applicantId: string) => {
    try {
      await updateFacilitatorApplicantStatus(applicantId, "SELECTED");
      toast.success("Facilitator selected successfully");
      refetch(); // Refresh the data
    } catch (error) {
      toast.error("Failed to select facilitator");
    }
  };

  const handleReject = async (applicantId: string) => {
    try {
      await updateFacilitatorApplicantStatus(applicantId, "REJECTED");
      toast.success("Facilitator rejected successfully");
      refetch(); // Refresh the data
    } catch (error) {
      toast.error("Failed to reject facilitator");
    }
  };

  const columns: ColumnDef<IFacilitatorApplicantPaginatedData>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        const name = row.original.name;
        return typeof name === 'string' && name ? name : 'N/A';
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
              statusText === "SELECTED" && "bg-green-200 text-green-500", // Keep for backward compatibility
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
                onClick={() => handleSelect(id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Select
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

        return <span className="text-gray-500">No action available</span>;
      }
    }
  ];

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Facilitator Applicants</h2>
        <p className="text-gray-600 mb-6">
          Manage facilitator applications. Select qualified candidates directly without interviews.
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