"use client";

import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

// Placeholder interface - you'll need to create the actual facilitator applicant type
interface FacilitatorApplicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  created_datetime: string;
}

// Placeholder columns - you'll need to create actual columns similar to consultancy
const facilitatorApplicantColumns: ColumnDef<FacilitatorApplicant>[] = [
  {
    header: "Name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    size: 200,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 200,
  },
  {
    header: "Phone",
    accessorKey: "phone",
    size: 150,
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 150,
  },
  {
    header: "Date Applied",
    accessorKey: "created_datetime",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return new Date(value).toLocaleDateString("en-US");
    },
    size: 150,
  },
];

interface FacilitatorApplicantsListProps {
  facilitatorId: string;
}

export default function FacilitatorApplicantsList({ facilitatorId }: FacilitatorApplicantsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Placeholder data - you'll need to create the actual API hook
  // const { data, isFetching, error } = useGetAllFacilitatorApplicants({
  //   page: currentPage,
  //   size: 10,
  //   facilitator: facilitatorId,
  //   status: "APPLIED",
  // });

  // Temporary placeholder
  const data = null;
  const isFetching = false;
  const applicants: FacilitatorApplicant[] = [];

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Submitted Applicants</h1>
      <Card>
        <TableFilters>
          {!isFetching && (!applicants || applicants.length === 0) ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">No Applicants Found</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    No applicants have submitted applications for this facilitator position yet.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Use "Add Applicant" button to add applicants manually.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              columns={facilitatorApplicantColumns}
              data={applicants}
              isLoading={isFetching}
              pagination={{
                total: applicants.length,
                pageSize: 10,
                onChange: (page: number) => setCurrentPage(page),
              }}
            />
          )}
        </TableFilters>
      </Card>
    </section>
  );
}
