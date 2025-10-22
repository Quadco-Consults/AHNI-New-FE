"use client";

import { useState } from "react";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import { adhocAcceptedColumns } from "@/features/programs/components/table-columns/adhoc-accepted";

interface AdhocAcceptedApplicantsProps {
  advertisementId: string;
}

export default function AdhocAcceptedApplicants({ advertisementId }: AdhocAcceptedApplicantsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetApplicantsByAdvertisement(
    advertisementId,
    {
      page: currentPage,
      size: 10,
      enabled: !!advertisementId,
    }
  );

  // Filter for hired applicants only
  const acceptedApplicants = data?.data?.results
    ?.filter((applicant: any) => {
      const belongsToThisAdvertisement = applicant.advertisement === advertisementId ||
                                         applicant.advertisement?.id === advertisementId;
      const isHired = applicant.status === "HIRED";

      console.log(`🎯 Accepted Filter - Applicant ${applicant.id}:`, {
        name: `${applicant.surname} ${applicant.other_names}`,
        status: applicant.status,
        belongsToThisAdvertisement,
        isHired,
        willBeIncluded: belongsToThisAdvertisement && isHired
      });

      return belongsToThisAdvertisement && isHired;
    })
    ?.map((applicant: any) => ({
      ...applicant,
      // Map from API response field names to expected field names
      sur_name: applicant.surname || applicant.sur_name,
      other_names: applicant.other_names,
      email_address: applicant.email || applicant.email_address,
      phone_number: applicant.phone_number,
      contract_start_date: applicant.contract_start_date,
      contract_end_date: applicant.contract_end_date,
      hired_at: applicant.selection_date || applicant.hired_at,
    })) || [];

  console.log('🎯 Accepted Applicants Debug:', {
    advertisementId,
    totalResults: data?.data?.results?.length || 0,
    acceptedCount: acceptedApplicants.length,
    allStatuses: data?.data?.results?.map((a: any) => ({ id: a.id, status: a.status }))
  });

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Accepted Candidates</h1>
      <TableFilters>
        {!isFetching && (!acceptedApplicants || acceptedApplicants.length === 0) ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">No Hired Candidates</h4>
                <p className="text-sm text-gray-500 mt-1">
                  No applicants have been hired yet.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={adhocAcceptedColumns}
            data={acceptedApplicants}
            isLoading={isFetching}
            pagination={(data?.data as any)?.pagination || (data?.data as any)?.paginator ? {
              total: ((data?.data as any)?.pagination?.count || (data?.data as any)?.paginator?.count) ?? acceptedApplicants.length,
              pageSize: ((data?.data as any)?.pagination?.page_size || (data?.data as any)?.paginator?.page_size) ?? 10,
              onChange: (page: number) => setCurrentPage(page),
            } : undefined}
          />
        )}
      </TableFilters>
    </section>
  );
}
