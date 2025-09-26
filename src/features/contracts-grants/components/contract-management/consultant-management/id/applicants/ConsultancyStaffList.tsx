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
    consultant_id: id,
    status: "APPLIED",
  });

  // Enhanced Debug logs
  console.log("🔍 ConsultancyStaffList Debug:");
  console.log("- Current Adhoc/Consultant ID:", id);
  console.log("- API URL:", `/contract-grants/consultancy/applicants/?page=${currentPage}&size=10&consultant_id=${id}&status=APPLIED`);
  console.log("- Has Data:", !!data);
  console.log("- Has Results:", !!data?.data?.results);
  console.log("- Results Count:", data?.data?.results?.length || 0);
  console.log("- Error:", error);
  console.log("- Is Fetching:", isFetching);

  // CRITICAL: Show which consultant_id each applicant is associated with
  if (data?.data?.results) {
    console.log("🚨 APPLICANT ANALYSIS:");
    data.data.results.forEach((applicant, index) => {
      console.log(`  Applicant ${index + 1}:`, {
        name: `${applicant.first_name} ${applicant.last_name}`,
        email: applicant.email,
        consultant_id: applicant.consultant_id || applicant.consultancy || "NOT_SET",
        status: applicant.status,
        id: applicant.id,
        created_datetime: applicant.created_datetime
      });
    });

    // Check if any applicants have different consultant_ids
    const wrongApplicants = data.data.results.filter(applicant =>
      applicant.consultant_id !== id && applicant.consultancy !== id
    );

    if (wrongApplicants.length > 0) {
      console.log("❌ FOUND APPLICANTS WITH WRONG CONSULTANT_ID:");
      wrongApplicants.forEach(applicant => {
        console.log("  Wrong applicant:", {
          name: `${applicant.first_name} ${applicant.last_name}`,
          expected_id: id,
          actual_consultant_id: applicant.consultant_id || applicant.consultancy,
          applicant_id: applicant.id
        });
      });
    }
  }

  // TEMPORARY FIX: Filter applicants on client-side to ensure only correct ones show
  const filteredApplicants = data?.data?.results?.filter(applicant => {
    const applicantConsultantId = applicant.consultant_id || applicant.consultancy;
    return applicantConsultantId === id;
  }) || [];

  console.log("✅ FILTERED APPLICANTS (client-side):", filteredApplicants.length, "out of", data?.data?.results?.length || 0);

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Submitted Applications</h1>
      <Card>
        <TableFilters>
          {!isFetching && (!filteredApplicants || filteredApplicants.length === 0) ? (
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
              data={filteredApplicants}
              isLoading={isFetching}
              pagination={data?.data?.pagination ? {
                total: filteredApplicants.length, // Use filtered count for pagination
                pageSize: data.data.pagination.page_size ?? 0,
                onChange: (page: number) => setCurrentPage(page),
              } : undefined}
            />
          )}
        </TableFilters>
      </Card>
    </section>
  );
}
