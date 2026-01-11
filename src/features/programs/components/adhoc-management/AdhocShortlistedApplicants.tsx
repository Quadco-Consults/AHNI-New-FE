"use client";

import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import { adhocShortlistedColumns } from "@/features/programs/components/table-columns/adhoc-shortlisted";

interface AdhocShortlistedApplicantsProps {
  advertisementId: string;
}

export default function AdhocShortlistedApplicants({ advertisementId }: AdhocShortlistedApplicantsProps) {
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
    console.log('📊 AdHoc Shortlisted Applicants Debug:', {
      advertisementId,
      totalResults: data.data.results.length,
      shortlisted: data.data.results.filter((a: any) => a.status === "SHORTLISTED"),
    });
  }

  // Filter for shortlisted applicants only
  const shortlistedApplicants = data?.data?.results
    ?.filter((applicant: any) => {
      const belongsToThisAdvertisement = applicant.advertisement === advertisementId ||
                                         applicant.advertisement?.id === advertisementId;
      const isShortlisted = applicant.status === "SHORTLISTED";

      return belongsToThisAdvertisement && isShortlisted;
    })
    ?.map((applicant: any) => ({
      ...applicant,
      // Map from API response field names to expected field names
      sur_name: applicant.surname || applicant.sur_name,
      other_names: applicant.other_names,
      email_address: applicant.email || applicant.email_address,
      phone_number: applicant.phone_number,
      qualifications: applicant.qualification || applicant.qualifications,
      total_experience_years: applicant.years_of_experience || applicant.total_experience_years || 0,
    })) || [];

  console.log(`🔍 Shortlisted Applicants:`, shortlistedApplicants.length);

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Shortlisted Applicants</h1>
      <TableFilters>
        {!isFetching && (!shortlistedApplicants || shortlistedApplicants.length === 0) ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">No Shortlisted Applicants</h4>
                <p className="text-sm text-gray-500 mt-1">
                  No applicants have been shortlisted yet.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Go to "Submitted Applications" tab to shortlist applicants.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={adhocShortlistedColumns}
            data={shortlistedApplicants}
            isLoading={isFetching}
            pagination={(data?.data as any)?.pagination || (data?.data as any)?.paginator ? {
              total: ((data?.data as any)?.pagination?.count || (data?.data as any)?.paginator?.count) ?? shortlistedApplicants.length,
              pageSize: ((data?.data as any)?.pagination?.page_size || (data?.data as any)?.paginator?.page_size) ?? 10,
              onChange: (page: number) => setCurrentPage(page),
            } : undefined}
          />
        )}
      </TableFilters>
    </section>
  );
}
