"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "components/Card";
import { consultancyStaffColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/consultant-applicant";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetAllConsultancyStaffs } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function ConsultancyStaffList() {
  const { id } = useParams();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);

  // Simplified API call
  const { data, isFetching, error } = useGetAllConsultancyStaffs({
    page: currentPage,
    size: 10,
    consultants: id,
    status: "APPLIED",
  });

  // Map API response to expected format
  const mappedApplicants = data?.data?.results
    ?.filter(applicant => {
      // Filter out applicants that don't belong to this consultant management
      const belongsToThisConsultant =
        applicant.consultants === undefined ||
        applicant.consultants?.includes(id as string) ||
        applicant.consultancy === id ||
        applicant.consultant_id === id;
      return belongsToThisConsultant;
    })
    ?.map(applicant => ({
    ...applicant,
    // Map name fields
    first_name: applicant.first_name || applicant.name || 'Unknown',
    last_name: applicant.last_name || applicant.contractor_name || '',
    // Ensure consultant_id is present
    consultant_id: applicant.consultant_id || id,
    consultancy: applicant.consultancy || id
  })) || [];

  console.log("🔍 ConsultancyStaffList Debug:");
  console.log("- Current Consultant ID:", id);
  console.log("- Original Results Count:", data?.data?.results?.length || 0);
  console.log("- Mapped Results Count:", mappedApplicants.length);
  console.log("- Error:", error);
  console.log("- Is Fetching:", isFetching);

  if (mappedApplicants.length > 0) {
    console.log("✅ APPLICANT DATA:");
    mappedApplicants.forEach((applicant, index) => {
      console.log(`  Applicant ${index + 1}:`, {
        name: `${applicant.first_name} ${applicant.last_name}`,
        email: applicant.email,
        status: applicant.status,
        id: applicant.id
      });
    });
  }

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Submitted Applications</h1>
      <Card>
        <TableFilters>
          {!isFetching && (!mappedApplicants || mappedApplicants.length === 0) ? (
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
                    No applicants have submitted applications for this {pathname?.includes("adhoc-management") ? "adhoc position" : "consultancy"} yet.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Use "Add Applicant" button to add applicants manually.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              columns={consultancyStaffColumns}
              data={mappedApplicants}
              isLoading={isFetching}
              pagination={data?.data?.pagination ? {
                total: data.data.pagination.count ?? mappedApplicants.length,
                pageSize: data.data.pagination.page_size ?? 10,
                onChange: (page: number) => setCurrentPage(page),
              } : undefined}
            />
          )}
        </TableFilters>
      </Card>
    </section>
  );
}
