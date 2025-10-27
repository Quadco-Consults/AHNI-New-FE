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
          applicationId: app.id,
          applicationStatus: app.status,
          hasInterview: !!interview,
          interviewId: interview?.id,
          interviewApplication: interview?.application,
          matchedCorrectly: interview ? (
            (typeof interview.application === 'string' && interview.application === app.id) ||
            (typeof interview.application === 'object' && interview.application?.id === app.id)
          ) : 'no-interview',
        });

        // Determine if interview is completed (has evaluation data)
        // ONLY mark as completed if there are actual submitted scores, not just defaults
        const interviewCompleted = interview ? (
          // Multi-scorer: Check if interview has any submitted scores
          (interview.interviewer_scores && interview.interviewer_scores.length > 0) ||
          (interview.scores && interview.scores.length > 0) ||
          (interview.completed_evaluations && interview.total_interviewers &&
           interview.completed_evaluations >= interview.total_interviewers) ||
          // Legacy single-scorer: MUST have comments (not just ratings) to be considered completed
          // This prevents false positives from default rating values
          (
            interview.appearance_comments ||
            interview.oral_communication_comments ||
            interview.teamwork_comments ||
            interview.work_ethics_comments ||
            interview.analytical_comments ||
            interview.knowledge_comments ||
            interview.experience_comments ||
            (interview.recommendation && interview.recommendation.trim().length > 0)
          )
        ) : false;

        // Debug logging for interview completion status
        if (interview) {
          console.log(`🔍 Interview completion check for ${app.applicant_email}:`, {
            hasInterviewerScores: !!(interview.interviewer_scores && interview.interviewer_scores.length > 0),
            interviewerScoresCount: interview.interviewer_scores?.length || 0,
            hasScores: !!(interview.scores && interview.scores.length > 0),
            scoresCount: interview.scores?.length || 0,
            completedEvaluations: interview.completed_evaluations || 0,
            totalInterviewers: interview.total_interviewers || 0,
            fullyComplete: (interview.completed_evaluations >= interview.total_interviewers),
            percentageScore: interview.percentage_score,
            averageScore: interview.average_score,
            interviewCompleted: interviewCompleted,
          });
        }

        // Calculate interview score ONLY if interview is actually completed
        // Don't use default/placeholder scores
        const interviewScore = interviewCompleted ? (
          interview?.percentage_score ||
          (interview?.average_score ? Math.round(interview.average_score * 20) : null)
        ) : null;

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
  } else if (candidate.interviewCompleted) {
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