"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "components/Card";
import { consultancyStaffColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/consultant-applicant";
import { shortlistedApplicantColumn } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/shortlisted-applicant";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetAllConsultancyStaffs } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetShortlistedApplicants } from "@/features/programs/controllers/adhocApplicantController";

export default function ShortlistedAppplicants() {
  const params = useParams();
  const id = params?.id as string;
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);

  // Detect if we're in adhoc mode
  const isAdhoc = !!(pathname && pathname.includes("adhoc-management"));

  console.log("🔍 Query Parameters:", {
    page: currentPage,
    size: 10,
    consultants: id,
    filteringByStatus: "SHORTLISTED (frontend filtering)",
    isAdhoc,
  });

  // Call appropriate API based on type
  const consultancyQuery = useGetAllConsultancyStaffs(
    !isAdhoc && id
      ? {
          page: currentPage,
          size: 10,
          consultants: id,
        }
      : skipToken
  );

  const adhocQuery = useGetShortlistedApplicants({
    page: currentPage,
    size: 10,
    advertisement_id: id,
    enabled: isAdhoc && !!id,
  });

  // Use the appropriate query result
  const { data, isFetching } = isAdhoc ? adhocQuery : consultancyQuery;

  // Map API response to expected format for shortlisted applicants
  const mappedShortlistedApplicants = data?.data?.results
    ?.filter((applicant: any) => {
      if (isAdhoc) {
        // For adhoc, API already filters by advertisement_id
        return true;
      }
      // Filter out applicants that don't belong to this consultant management
      const belongsToThisConsultant =
        applicant.consultants === undefined || // Backend filtered already, trust it
        applicant.consultants?.includes(id) ||
        applicant.consultancy === id ||
        applicant.consultant_id === id;

      // Also filter by status (SHORTLISTED) since we removed it from the API call
      const isShortlisted = applicant.status === "SHORTLISTED";

      if (!belongsToThisConsultant) {
        console.warn("⚠️ Filtering out applicant with wrong consultant_id:", {
          applicantName: applicant.name,
          applicantId: applicant.id,
          applicantConsultants: applicant.consultants,
          applicantConsultancy: applicant.consultancy,
          expectedId: id
        });
      }

      return belongsToThisConsultant && isShortlisted;
    })
    ?.map((applicant: any) => ({
      ...applicant,
      // Map name fields - handle both consultancy and adhoc structures
      first_name: applicant.first_name || applicant.other_names || applicant.name || 'Unknown',
      last_name: applicant.last_name || applicant.sur_name || applicant.contractor_name || '',
      name: applicant.name || `${applicant.first_name || applicant.other_names || ''} ${applicant.last_name || applicant.sur_name || ''}`.trim() || 'Unknown',
      email: applicant.email || applicant.email_address,
      // Ensure consultant_id is present for consultancy
      consultant_id: applicant.consultant_id || id,
      consultancy: applicant.consultancy || id,
      // Handle potentially problematic fields
      technical_monitor_user: typeof applicant.technical_monitor_user === 'object'
        ? applicant.technical_monitor_user?.name || 'N/A'
        : applicant.technical_monitor_user || 'N/A',
      location: typeof applicant.location === 'object'
        ? applicant.location?.name || 'N/A'
        : applicant.location || 'N/A',
      project: typeof applicant.project === 'object'
        ? applicant.project?.name || 'N/A'
        : applicant.project || 'N/A',
      contract_request: typeof applicant.contract_request === 'object'
        ? applicant.contract_request?.name || 'N/A'
        : applicant.contract_request || 'N/A',
    })) || [];

  console.log("🔍 ShortlistedApplicants Debug:");
  console.log("- Current Consultant ID:", id);
  console.log("- Original Results Count:", data?.data?.results?.length || 0);
  console.log("- Mapped Results Count:", mappedShortlistedApplicants.length);
  console.log("- Is Fetching:", isFetching);

  // Log raw applicant data to see consultancy values
  if (data?.data?.results && data.data.results.length > 0) {
    console.log("📋 Raw API Response - All Applicants:");
    data.data.results.forEach((applicant, index) => {
      console.log(`  Applicant ${index + 1}:`, {
        name: applicant.name,
        id: applicant.id,
        consultants: applicant.consultants,
        consultancy: applicant.consultancy,
        consultant_id: applicant.consultant_id,
        status: applicant.status,
        expectedId: id,
        belongsHere: applicant.consultants?.includes(id as string)
      });
    });
  }

  if (mappedShortlistedApplicants.length > 0) {
    console.log("✅ SHORTLISTED APPLICANT DATA:");
    mappedShortlistedApplicants.forEach((applicant, index) => {
      console.log(`  Shortlisted ${index + 1}:`, {
        name: `${applicant.first_name} ${applicant.last_name}`,
        email: applicant.email,
        status: applicant.status,
        id: applicant.id,
        consultancy: applicant.consultancy,
        consultant_id: applicant.consultant_id,
        expectedConsultantId: id
      });
    });
  }

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Shortlisted Applicants</h1>
      <Card>
        <TableFilters>
          {!isFetching && (!mappedShortlistedApplicants || mappedShortlistedApplicants.length === 0) ? (
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
              data={mappedShortlistedApplicants}
              isLoading={isFetching}
              pagination={{
                total: ((data?.data as any)?.pagination?.count || (data?.data as any)?.paginator?.count) ?? mappedShortlistedApplicants.length,
                pageSize: ((data?.data as any)?.pagination?.page_size || (data?.data as any)?.paginator?.page_size) ?? 10,
                onChange: (page: number) => setCurrentPage(page),
              }}
            />
          )}
        </TableFilters>
      </Card>
    </section>
  );
}
