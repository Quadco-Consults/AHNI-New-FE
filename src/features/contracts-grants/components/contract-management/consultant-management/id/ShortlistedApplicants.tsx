"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "components/Card";
import { consultancyStaffColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/consultant-applicant";
import { shortlistedApplicantColumn } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/shortlisted-applicant";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetAllConsultancyStaffs } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function ShortlistedAppplicants() {
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetAllConsultancyStaffs(
    id
      ? {
          page: currentPage,
          size: 10,
          consultant_id: id,
          status: "SHORTLISTED",
        }
      : skipToken
  );

  // Enhanced Debug logging for shortlisted
  console.log("🔍 ShortlistedApplicants Debug:");
  console.log("- Current Adhoc/Consultant ID:", id);
  console.log("- Data:", data);
  console.log("- Results Count:", data?.data?.results?.length || 0);

  if (data?.data?.results) {
    console.log("🚨 SHORTLISTED APPLICANT ANALYSIS:");
    data.data.results.forEach((applicant, index) => {
      console.log(`  Shortlisted ${index + 1}:`, {
        name: applicant.name || `${applicant.first_name} ${applicant.last_name}`,
        consultant_id: applicant.consultant_id || applicant.consultancy || "NOT_SET",
        status: applicant.status,
        id: applicant.id
      });
    });
  }

  // TEMPORARY FIX: Filter applicants on client-side to ensure only correct ones show
  const filteredShortlistedApplicants = data?.data?.results?.filter(applicant => {
    const applicantConsultantId = applicant.consultant_id || applicant.consultancy;
    return applicantConsultantId === id;
  }) || [];

  console.log("✅ FILTERED SHORTLISTED (client-side):", filteredShortlistedApplicants.length, "out of", data?.data?.results?.length || 0);

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Shortlisted Applicants</h1>
      <Card>
        <TableFilters>
          {!isFetching && (!filteredShortlistedApplicants || filteredShortlistedApplicants.length === 0) ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">No Shortlisted Applicants</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Applicants who have been shortlisted will appear here.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Shortlist applicants from the "Submitted Applications" tab.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              columns={shortlistedApplicantColumn}
              data={filteredShortlistedApplicants}
              isLoading={isFetching}
              pagination={{
                total: filteredShortlistedApplicants.length, // Use filtered count
                pageSize: data?.data?.pagination?.page_size ?? 0,
                onChange: (page: number) => setCurrentPage(page),
              }}
            />
          )}
        </TableFilters>
      </Card>
    </section>
  );
}
