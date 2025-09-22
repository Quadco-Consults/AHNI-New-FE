import { useQuery } from "@tanstack/react-query";
import { useGetJobAdvertisements } from "./jobAdvertisementController";
import { useGetJobApplications } from "./hrJobApplicationsController";
import { useGetInterviews } from "./hrInterviewController";

// Hook to get all interviewed candidates across all advertisements
export const useAllInterviewedCandidates = () => {
  // First, get all job advertisements
  const { data: advertsData, isLoading: advertsLoading, error: advertsError } =
    useGetJobAdvertisements({
      size: 1000, // Get all advertisements
    });

  const advertisements = (advertsData as any)?.data?.results || [];

  // Get all applications (without advertisement filter to get from all ads)
  const { data: allApplicationsData, isLoading: applicationsLoading, error: applicationsError } =
    useGetJobApplications({
      size: 1000, // Get more applications
    });

  // Get all interviews (without advertisement filter to get from all ads)
  const { data: allInterviewsData, isLoading: interviewsLoading, error: interviewsError } =
    useGetInterviews({
      size: 1000, // Get all interviews
    });

  // Query to process and filter interviewed candidates
  const allInterviewedQuery = useQuery({
    queryKey: ["all-interviewed-candidates"],
    queryFn: async () => {
      console.log("🔄 Processing interviewed candidates from all advertisements...");

      const applications = (allApplicationsData as any)?.data?.results || [];
      const interviews = (allInterviewsData as any)?.data?.results || [];

      console.log(`📋 Found ${applications.length} applications and ${interviews.length} interviews`);

      if (applications.length === 0) {
        console.log("📋 No applications found");
        return [];
      }

      const allInterviewedCandidates: any[] = [];

      // Process each application to find interviewed candidates
      applications.forEach((app: any) => {
        // Find matching interview by application ID or email
        const interview = interviews.find((interview: any) => {
          if (typeof interview.application === 'string') {
            return interview.application === app.id;
          }
          if (typeof interview.application === 'object' && interview.application?.id) {
            return interview.application.id === app.id;
          }
          if (interview.application?.applicant_email && typeof interview.application.applicant_email === 'string') {
            return interview.application.applicant_email === app.applicant_email;
          }
          return false;
        });

        // Check if interview is completed
        const interviewCompleted = interview ? (
          interview.appearance_comments ||
          interview.oral_communication_comments ||
          interview.teamwork_comments ||
          interview.work_ethics_comments ||
          interview.analytical_comments ||
          interview.knowledge_comments ||
          interview.experience_comments ||
          (interview.recommendation && interview.recommendation.trim().length > 0) ||
          [
            interview.appearance_rating,
            interview.oral_communication_rating,
            interview.teamwork_rating,
            interview.work_ethics_rating,
            interview.analytical_rating,
            interview.knowledge_rating,
            interview.experience_rating
          ].some(rating => rating && rating !== 1)
        ) : false;

        if (interview && interviewCompleted) {
          const interviewScore = interview?.percentage_score ||
            (interview?.average_score ? Math.round(interview.average_score * 20) : null);

          // Find the advertisement for this application
          const advertisement = advertisements.find((ad: any) => ad.id === app.advertisement);

          // Determine the real status based on the actual application status
          // If the status is already ACCEPTED or PREFERRED, keep it
          // Otherwise, set it to INTERVIEWED since the interview is completed
          const realStatus = (app.status?.toUpperCase() === "ACCEPTED" || app.status?.toUpperCase() === "PREFERRED")
            ? app.status.toUpperCase()
            : "INTERVIEWED";

          allInterviewedCandidates.push({
            ...app,
            realStatus,
            interviewScore,
            interviewCompleted: true,
            interviewScheduled: true,
            interview,
            // Add advertisement info
            advertisementTitle: advertisement?.title || advertisement?.position?.name || "N/A",
            advertisementId: app.advertisement || "N/A",
          });
        }
      });

      console.log(`✅ Found ${allInterviewedCandidates.length} interviewed candidates`);
      return allInterviewedCandidates;
    },
    enabled: !advertsLoading && !applicationsLoading && !interviewsLoading &&
             !!allApplicationsData && !!allInterviewsData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: allInterviewedQuery.data || [],
    isLoading: advertsLoading || applicationsLoading || interviewsLoading || allInterviewedQuery.isLoading,
    error: advertsError || applicationsError || interviewsError || allInterviewedQuery.error,
    refetch: allInterviewedQuery.refetch,
  };
};