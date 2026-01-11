import { useGetApplicantsByAdvertisement } from "../controllers/adhocApplicantController";

/**
 * Custom hook to get comprehensive applicant statistics for an advertisement
 * Provides total applicants count and status-specific breakdowns
 */
export const useApplicantCount = (advertisementId: string) => {
  const { data: applicantsData, isLoading, error } = useGetApplicantsByAdvertisement(
    advertisementId,
    {
      page: 1,
      size: 100000000, // Get all applicants to count them
      enabled: !!advertisementId,
    }
  );

  const applicants = applicantsData?.data?.results || [];
  const totalCount = applicants.length;

  // Count applicants by status
  const statusCounts = applicants.reduce((acc: any, applicant: any) => {
    const status = applicant.status || 'UNKNOWN';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const shortlistedCount = statusCounts.SHORTLISTED || 0;
  const appliedCount = statusCounts.APPLIED || 0;
  const submittedCount = statusCounts.SUBMITTED || 0;
  const rejectedCount = statusCounts.REJECTED || 0;
  const hiredCount = statusCounts.HIRED || 0;

  // Interview-eligible applicants (typically SHORTLISTED, APPLIED, SUBMITTED)
  const interviewEligibleCount = shortlistedCount + appliedCount + submittedCount;

  return {
    // Overall counts
    totalCount,
    shortlistedCount,
    interviewEligibleCount,

    // Status-specific counts
    statusCounts,
    appliedCount,
    submittedCount,
    rejectedCount,
    hiredCount,

    // Formatted strings
    totalFormatted: `${totalCount} applicant${totalCount !== 1 ? 's' : ''}`,
    shortlistedFormatted: `${shortlistedCount} shortlisted`,

    // Raw data
    applicants,
    isLoading,
    error,
  };
};