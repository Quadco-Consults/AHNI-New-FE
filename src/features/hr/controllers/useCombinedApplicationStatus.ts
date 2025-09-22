import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useGetJobApplications } from "./hrJobApplicationsController";
import { useGetInterviews } from "./hrInterviewController";

// Interface for combined candidate status
interface CandidateWithRealStatus {
  id: string;
  applicant_first_name: string;
  applicant_middle_name?: string;
  applicant_last_name: string;
  applicant_email: string;
  applicant_name?: string;
  position_applied: string;
  status: string; // Original application status
  realStatus: string; // Computed real status
  advertisement: string;
  created_datetime: string;
  updated_datetime: string;
  // Interview-related fields
  interviewScore?: number;
  interviewCompleted: boolean;
  interviewScheduled: boolean;
  interview?: any;
}

// Hook to get applications with real status based on interview completion
export const useCombinedApplicationStatus = (advertisementId: string, statusFilter = "") => {
  // Get applications
  const { data: applicationsData, isLoading: applicationsLoading, error: applicationsError } =
    useGetJobApplications({
      id: advertisementId,
      status: statusFilter,
      size: 100, // Get more records
    });

  // Get interviews for this advertisement
  const { data: interviewsData, isLoading: interviewsLoading, error: interviewsError } =
    useGetInterviews({
      id: advertisementId,
      size: 1000, // Get all interviews
    });

  // Combine the data
  const combinedQuery = useQuery({
    queryKey: ["combined-application-status", advertisementId, statusFilter],
    queryFn: async (): Promise<CandidateWithRealStatus[]> => {
      console.log("🔄 Combining application and interview data...");

      const applications = (applicationsData?.data as any)?.results || [];
      const interviews = (interviewsData as any)?.data?.results || [];

      console.log("📋 Applications found:", applications.length);
      console.log("📋 Interviews found:", interviews.length);

      const candidatesWithStatus: CandidateWithRealStatus[] = applications.map((app: any) => {
        // Find matching interview by application ID or email
        const interview = interviews.find((interview: any) => {
          // Try multiple matching strategies
          if (typeof interview.application === 'string') {
            return interview.application === app.id;
          }
          if (typeof interview.application === 'object' && interview.application?.id) {
            return interview.application.id === app.id;
          }
          // Fallback: match by email (safely check if applicant_email exists and is a string)
          if (interview.application?.applicant_email && typeof interview.application.applicant_email === 'string') {
            return interview.application.applicant_email === app.applicant_email;
          }
          return false;
        });

        console.log(`👤 Processing ${app.applicant_email}:`, {
          applicationStatus: app.status,
          hasInterview: !!interview,
          interviewId: interview?.id,
        });

        // Determine if interview is completed (has evaluation data)
        const interviewCompleted = interview ? (
          interview.appearance_comments ||
          interview.oral_communication_comments ||
          interview.teamwork_comments ||
          interview.work_ethics_comments ||
          interview.analytical_comments ||
          interview.knowledge_comments ||
          interview.experience_comments ||
          (interview.recommendation && interview.recommendation.trim().length > 0) ||
          // Check if ratings are not all default (1) values
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

        // Calculate interview score if available
        const interviewScore = interview?.percentage_score ||
          (interview?.average_score ? Math.round(interview.average_score * 20) : null); // Convert 5-point scale to percentage

        // Determine real status - prioritize ACCEPTED/PREFERRED over interview status
        let realStatus = app.status;

        // Don't override ACCEPTED or PREFERRED status
        if (app.status?.toUpperCase() === "ACCEPTED" || app.status?.toUpperCase() === "PREFERRED") {
          realStatus = app.status.toUpperCase();
        } else if (interview && interviewCompleted) {
          realStatus = "INTERVIEWED";
        } else if (interview && !interviewCompleted) {
          realStatus = "INTERVIEW_SCHEDULED";
        }

        console.log(`✅ ${app.applicant_email} real status:`, {
          original: app.status,
          real: realStatus,
          interviewCompleted,
          score: interviewScore
        });

        return {
          ...app,
          realStatus,
          interviewScore,
          interviewCompleted,
          interviewScheduled: !!interview,
          interview
        };
      });

      console.log("🎯 Final candidates with real status:", candidatesWithStatus.length);
      return candidatesWithStatus;
    },
    enabled: !applicationsLoading && !interviewsLoading && !!applicationsData && !!interviewsData,
    refetchOnWindowFocus: false,
  });

  return {
    data: combinedQuery.data || [],
    isLoading: applicationsLoading || interviewsLoading || combinedQuery.isLoading,
    error: applicationsError || interviewsError || combinedQuery.error,
    refetch: combinedQuery.refetch,
  };
};

// Helper function to get status display info
export const getStatusDisplay = (candidate: CandidateWithRealStatus) => {
  // Priority order: ACCEPTED > PREFERRED > INTERVIEWED > INTERVIEW_SCHEDULED > SHORTLISTED > other

  if (candidate.status?.toLowerCase() === "accepted" || candidate.realStatus?.toLowerCase() === "accepted") {
    return {
      text: "ACCEPTED",
      color: "bg-black text-white",
      status: "ACCEPTED"
    };
  } else if (candidate.status?.toLowerCase() === "preferred" || candidate.realStatus?.toLowerCase() === "preferred") {
    return {
      text: "PREFERRED",
      color: "bg-purple-50 text-purple-500",
      status: "PREFERRED"
    };
  } else if (candidate.interviewCompleted && candidate.interviewScore) {
    return {
      text: `INTERVIEWED (${candidate.interviewScore}%)`,
      color: "bg-green-50 text-green-500",
      status: "INTERVIEWED"
    };
  } else if (candidate.interviewCompleted && !candidate.interviewScore) {
    return {
      text: "INTERVIEWED",
      color: "bg-green-50 text-green-500",
      status: "INTERVIEWED"
    };
  } else if (candidate.realStatus === "INTERVIEW_SCHEDULED") {
    return {
      text: "INTERVIEW SCHEDULED",
      color: "bg-yellow-50 text-yellow-500",
      status: "INTERVIEW_SCHEDULED"
    };
  } else if (candidate.status?.toLowerCase() === "shortlisted") {
    return {
      text: "SHORTLISTED",
      color: "bg-blue-50 text-blue-500",
      status: "SHORTLISTED"
    };
  } else {
    return {
      text: candidate.status?.toUpperCase() || "APPLIED",
      color: "bg-gray-50 text-gray-500",
      status: candidate.status || "APPLIED"
    };
  }
};