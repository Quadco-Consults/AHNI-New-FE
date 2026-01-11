"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "@/components/Card";
import { consultancyStaffColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/consultant-applicant";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetAllConsultancyStaffs } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import { useGetAllConsultancyInterviews } from "@/features/contracts-grants/controllers/consultancyInterviewController";

export default function ConsultancyStaffList() {
  const params = useParams();
  const id = params?.id as string;
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);

  // Detect if we're in adhoc mode
  const isAdhoc = !!(pathname && pathname.includes("adhoc-management"));

  // Call appropriate API based on type - disable the one we're not using
  const consultancyQuery = useGetAllConsultancyStaffs({
    page: currentPage,
    size: 10,
    consultants: id,
    // Remove status filter to get all applicants (APPLIED, INTERVIEWED, etc.)
    // status: "APPLIED",
    enabled: !isAdhoc, // Only enable if NOT adhoc
  });

  const adhocQuery = useGetApplicantsByAdvertisement(
    id as string,
    {
      page: currentPage,
      size: 10,
      // Note: Backend doesn't support status filter yet, so we fetch all and filter client-side
      // status: "SUBMITTED",
      enabled: isAdhoc && !!id, // Only enable if IS adhoc
    }
  );

  // Fetch interview data for consultancy applicants
  const interviewQuery = useGetAllConsultancyInterviews(
    !isAdhoc ? id : undefined, // Only fetch for consultancy, not adhoc
    !isAdhoc && !!id // Only enable for consultancy
  );

  // Use the appropriate query result
  const { data, isFetching, error } = isAdhoc ? adhocQuery : consultancyQuery;

  // Debug: Log raw applicant data to see statuses (only in development)
  if (isAdhoc && data?.data?.results && process.env.NODE_ENV === 'development') {
    console.log('📊 Raw Applicant Statuses:', data.data.results.map((a: any) => ({
      id: a.id,
      name: `${a.sur_name} ${a.other_names}`,
      status: a.status,
      status_display: a.status_display
    })));
  }

  // Debug: Log raw API response to understand data structure
  if (data?.data?.results && data.data.results.length > 0) {
    console.log("🔍 RAW API DATA - First applicant structure:", data.data.results[0]);
    console.log("🔍 RAW API DATA - All field keys:", Object.keys(data.data.results[0]));
  }

  // Debug: Log interview data
  if (interviewQuery.data?.data && interviewQuery.data.data.length > 0) {
    console.log("🔍 RAW INTERVIEW DATA - First interview structure:", interviewQuery.data.data[0]);
    console.log("🔍 RAW INTERVIEW DATA - Total interviews:", interviewQuery.data.data.length);
  }

  // Function to merge interview data with applicant data
  const mergeInterviewData = (applicants: any[], interviews: any[]) => {
    if (!interviews || !Array.isArray(interviews) || interviews.length === 0) return applicants;

    return applicants.map(applicant => {
      // Find all interviews for this applicant
      const applicantInterviews = interviews.filter(interview =>
        interview.applicant === applicant.id
      );

      if (applicantInterviews.length === 0) {
        return applicant;
      }

      console.log(`🔗 Linking ${applicantInterviews.length} interviews to applicant ${applicant.name}`);

      // Calculate aggregated interview data
      const completedInterviews = applicantInterviews.filter(interview =>
        interview.total_score > 0 || interview.relevant_experience !== null
      );

      let interviewData: any = {
        interview_data: applicantInterviews,
        total_interviews: applicantInterviews.length,
        completed_interviews: completedInterviews.length,
      };

      // Calculate average score if we have completed interviews
      if (completedInterviews.length > 0) {
        let totalScore = 0;
        let scoreCount = 0;

        completedInterviews.forEach(interview => {
          if (interview.total_score && interview.total_score > 0) {
            totalScore += interview.total_score;
            scoreCount++;
          }
        });

        if (scoreCount > 0) {
          interviewData.average_score = totalScore / scoreCount;
          interviewData.total_score = totalScore / scoreCount; // Use average as total_score
        }
      }

      // Add the most recent interview date
      const sortedInterviews = applicantInterviews.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (sortedInterviews.length > 0) {
        interviewData.interview_date = sortedInterviews[0].date;
        interviewData.date = sortedInterviews[0].date;
      }

      return {
        ...applicant,
        ...interviewData
      };
    });
  };

  // Get interview data for merging - ensure it's always an array
  const interviewData = Array.isArray(interviewQuery.data?.data)
    ? interviewQuery.data.data
    : [];

  // Map API response to expected format and merge with interview data
  const baseApplicants = data?.data?.results
    ?.filter((applicant: any) => {
      if (isAdhoc) {
        // For adhoc, filter by:
        // 1. Advertisement ID (backend filter doesn't work properly)
        const belongsToThisAdvertisement = applicant.advertisement === id;

        // 2. Status: show APPLIED, SUBMITTED, or INTERVIEWED
        const hasCorrectStatus = ['APPLIED', 'SUBMITTED', 'INTERVIEWED'].includes(applicant.status);

        return belongsToThisAdvertisement && hasCorrectStatus;
      }
      // For consultancy, filter out applicants that don't belong to this consultant management
      // Also allow all statuses: APPLIED, INTERVIEWED, etc.
      const belongsToThisConsultant =
        applicant.consultants === undefined ||
        applicant.consultants?.includes(id) ||
        applicant.consultancy === id ||
        applicant.consultant_id === id;

      // Allow APPLIED, INTERVIEWED, and other relevant statuses
      const hasValidStatus = ['APPLIED', 'INTERVIEWED', 'SHORTLISTED', 'ACCEPTED'].includes(applicant.status);

      return belongsToThisConsultant && hasValidStatus;
    })
    ?.map((applicant: any) => {
      // Extract name components
      const firstName = applicant.first_name || applicant.other_names || applicant.name || 'Unknown';
      const lastName = applicant.last_name || applicant.sur_name || applicant.contractor_name || '';

      return {
        ...applicant,
        // Map name fields - handle both consultancy and adhoc structures
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(), // Combined name for table display
        email: applicant.email || applicant.email_address,
        // Map position field from various possible field names
        position_under_contract: applicant.position_under_contract ||
                                applicant.position ||
                                applicant.job_title ||
                                applicant.role ||
                                'Position not specified',
        // Ensure consultant_id is present for consultancy
        consultant_id: applicant.consultant_id || id,
        consultancy: applicant.consultancy || id,
        // Keep adhoc-specific fields
        advertisement: applicant.advertisement,
      };
    }) || [];

  // Merge interview data with applicants (only for consultancy)
  const mappedApplicants = !isAdhoc
    ? mergeInterviewData(baseApplicants, interviewData)
    : baseApplicants;

  console.log(`🔍 ${isAdhoc ? 'Adhoc' : 'Consultancy'} Staff List Debug:`);
  console.log(`- Current ${isAdhoc ? 'Advertisement' : 'Consultant'} ID:`, id);
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
        position_under_contract: applicant.position_under_contract,
        position_data: {
          position_under_contract: applicant.position_under_contract,
          position: applicant.position,
          job_title: applicant.job_title,
          role: applicant.role,
        },
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
              pagination={(data?.data as any)?.pagination || (data?.data as any)?.paginator ? {
                total: ((data?.data as any)?.pagination?.count || (data?.data as any)?.paginator?.count) ?? mappedApplicants.length,
                pageSize: ((data?.data as any)?.pagination?.page_size || (data?.data as any)?.paginator?.page_size) ?? 10,
                onChange: (page: number) => setCurrentPage(page),
              } : undefined}
            />
          )}
        </TableFilters>
      </Card>
    </section>
  );
}
