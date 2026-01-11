"use client";

import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import { adhocApplicantsColumns } from "@/features/programs/components/table-columns/adhoc-applicants";

interface AdhocApplicantsListProps {
  advertisementId: string;
  advertisementStartDate?: string;
  advertisementEndDate?: string;
}

export default function AdhocApplicantsList({
  advertisementId,
  advertisementStartDate,
  advertisementEndDate,
}: AdhocApplicantsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching, error } = useGetApplicantsByAdvertisement(
    advertisementId,
    {
      page: currentPage,
      size: 10,
      enabled: !!advertisementId,
    }
  );

  // Debug: Log raw applicant data
  if (data?.data?.results && process.env.NODE_ENV === 'development') {
    console.log('📊 AdHoc Applicants Debug:', {
      advertisementId,
      advertisementStartDate,
      advertisementEndDate,
      totalResults: data.data.results.length,
      applicants: data.data.results.map((a: any) => ({
        id: a.id,
        name: `${a.sur_name} ${a.other_names}`,
        status: a.status,
        advertisement: a.advertisement,
      }))
    });
  }

  // Map API response to expected format with advertisement dates
  const mappedApplicants = data?.data?.results
    ?.filter((applicant: any) => {
      // Filter by advertisement ID and status
      const belongsToThisAdvertisement = applicant.advertisement === advertisementId ||
                                         applicant.advertisement?.id === advertisementId;
      const hasCorrectStatus = applicant.status === "APPLIED" || applicant.status === "SUBMITTED";

      return belongsToThisAdvertisement && hasCorrectStatus;
    })
    ?.map((applicant: any) => ({
      ...applicant,
      // Map from API response field names to expected field names
      sur_name: applicant.surname || applicant.sur_name,
      other_names: applicant.other_names,
      email_address: applicant.email || applicant.email_address,
      phone_number: applicant.phone_number,
      // Add advertisement dates for the table columns
      start_duration_date: advertisementStartDate,
      end_duration_date: advertisementEndDate,
    })) || [];

  console.log(`🔍 AdHoc Applicants List:`);
  console.log(`- Advertisement ID:`, advertisementId);
  console.log(`- Start Date:`, advertisementStartDate);
  console.log(`- End Date:`, advertisementEndDate);
  console.log("- Original Results Count:", data?.data?.results?.length || 0);
  console.log("- Mapped Results Count:", mappedApplicants.length);
  console.log("- Error:", error);
  console.log("- Is Fetching:", isFetching);

  if (mappedApplicants.length > 0) {
    console.log("✅ APPLICANT DATA:");
    mappedApplicants.forEach((applicant, index) => {
      console.log(`  Applicant ${index + 1}:`, {
        name: applicant.name,
        email: applicant.email,
        status: applicant.status,
        start_date: applicant.start_duration_date,
        end_date: applicant.end_duration_date,
        id: applicant.id
      });
    });
  }

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Submitted Applications</h1>
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
                  No applicants have submitted applications for this position yet.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Use "Add Applicant" button to add applicants manually.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={adhocApplicantsColumns}
            data={mappedApplicants}
            isLoading={isFetching}
            pagination={(data?.data as any)?.pagination || (data?.data as any)?.paginator ? {
              total: ((data?.data as any)?.pagination?.count || (data?.data as any)?.paginator?.count) ?? mappedApplicants.length,
              pageSize: ((data?.data as any)?.pagination?.page_size || (data?.data as any)?.paginator?.page_size) ?? 10,
              onChange: (page: number) => setCurrentPage(page),
            } : undefined}
          />
        )}
      </TableFilters>
    </section>
  );
}
