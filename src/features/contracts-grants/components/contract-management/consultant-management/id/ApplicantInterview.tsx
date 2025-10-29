"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import Card from "components/Card";
import FormSelect from "components/atoms/FormSelect";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useGetSingleConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { LoadingSpinner } from "components/Loading";
import { useGetMyPendingAdhocInterviews } from "@/features/programs/controllers/adhocInterviewController";
import { useGetMyPendingConsultancyInterviews, useGetAllConsultancyInterviews } from "@/features/contracts-grants/controllers/consultancyInterviewController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { useUpdateAdhocApplicantStatus } from "@/features/programs/controllers/adhocApplicantController";
import { AlertCircle, ShieldX } from "lucide-react";

const guide = [
    { main: "Unacceptable", sub: "(Did not meet any requirements)" },
    { main: "Marginal", sub: "(Meets some requirements, but not others)" },
    { main: "Acceptable", sub: "(Meets most but not all reuirements)" },
    { main: "Excellent", sub: "(Meets all exceeds all requirements)" },
];

const scoreOptions = ["1", "2", "3", "4", "5"].map((value) => ({
    label: value,
    value,
}));

const evaluationCriteria = [
    { name: "relevant_experience", label: "Has done similar work previously (nature of task)" },
    { name: "project_management", label: "Understands project management and the potential task(s)" },
    { name: "recent_experience", label: "Experience is recent (2-3 years)" },
    { name: "comparable_projects", label: "Worked with projects comparable to the AHNI (budget and complexity)" },
    { name: "communication_skills", label: "Excellent Communication Skills" },
    { name: "technical_skill", label: "Relevant Technical Skill" },
    { name: "relevant_qualification", label: "Qualifications are relevant to the consultancy" },
    { name: "academic_credentials", label: "Strong academic credentials" },
    { name: "timeline_management", label: "Demonstrated ability to manage the project/consultancy timelines" },
    { name: "toolset_framework", label: "Proven toolset and framework" },
];

export default function ApplicantInterviewPage() {
    const router = useRouter();
    const params = useParams();
    // Handle URL parameters based on Next.js App Router structure:
    // /dashboard/programs/adhoc-management/[id]/applicant/[applicantId]/adhoc-interview/page.tsx
    const managementId = params?.id as string;        // The consultancy/adhoc management ID
    const applicantId = params?.applicantId as string;  // The applicant ID

    // Determine the interview type based on the URL path
    // Check the management type first (adhoc-management vs consultant-management)
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    // Since this component is in consultant-management folder, we can override based on the file location
    // This ensures that if we're in the consultant-management context, it's always a consultant interview
    const isAdhocInterview = pathname.includes('/adhoc-management/');
    const isConsultantInterview = !isAdhocInterview; // If not adhoc, then it's consultant (since this component is in consultant folder)

    // Debug the URL detection
    console.log('🔍 URL Detection Debug:', {
        pathname,
        isAdhocInterview,
        isConsultantInterview,
        managementId,
        applicantId,
        logicUsed: 'If NOT adhoc-management path, then consultant interview (since component is in consultant folder)',
        explanation: 'This component is in consultant-management context, so unless explicitly adhoc-management, it should be CONSULTANT interview',
        titleWillShow: isAdhocInterview ? "Adhoc Interview" : isConsultantInterview ? "Consultant Interview" : "Interview"
    });

    // Mutation hook for updating applicant status (only for AdHoc)
    const updateApplicantStatus = useUpdateAdhocApplicantStatus(applicantId);

    // Fetch applicant data
    const { data: applicantData, isLoading } = useGetSingleConsultancyApplicant(applicantId);
    const applicantName = applicantData?.data?.name || "Applicant";

    // Fetch current user profile
    const { data: userProfile } = useGetUserProfile();
    const currentUserId = userProfile?.data?.id;
    const isAdmin = (userProfile?.data as any)?.is_superuser || (userProfile?.data as any)?.is_staff;

    // Fetch pending interviews for the current user (both types)
    const { data: adhocInterviews, isLoading: loadingAdhocInterviews } = useGetMyPendingAdhocInterviews(isAdhocInterview);
    const { data: consultancyInterviews, isLoading: loadingConsultancyInterviews } = useGetMyPendingConsultancyInterviews(isConsultantInterview);

    // Fetch all interviews to check committee membership (both types)
    const { data: allConsultancyInterviews } = useGetAllConsultancyInterviews(isConsultantInterview ? managementId : undefined, isConsultantInterview);

    // Check if user is authorized to interview this applicant
    // Handle nested data structure: response.data.data or response.data
    const extractInterviews = (response: any) => {
        if (!response) return [];

        // For consultancy interviews: ApiResponse<ConsultancyInterviewSchedule[]> -> response.data is the array
        if (Array.isArray(response.data)) return response.data;

        // For other interview types that might have nested structure
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            // If data is an object, it might contain the interviews array
            const dataObj = response.data;
            if (Array.isArray(dataObj.interviews)) return dataObj.interviews;
            if (Array.isArray(dataObj.results)) return dataObj.results;
        }
        return [];
    };

    const pendingInterviews = isAdhocInterview
        ? extractInterviews(adhocInterviews)
        : isConsultantInterview
        ? extractInterviews(consultancyInterviews)
        : [];

    // Check if user is a committee member for any interview involving this applicant
    const allInterviews = isAdhocInterview
        ? extractInterviews(adhocInterviews) // For adhoc, use pending interviews
        : extractInterviews(allConsultancyInterviews);

    const isCommitteeMember = currentUserId && Array.isArray(allInterviews) && allInterviews.some((interview: any) => {
        // Check if this applicant is part of this interview
        const interviewApplicant = interview.applicant; // Singular - for AdHoc
        const interviewApplicants = interview.applicants || []; // Plural - for Consultancy
        const committeeMembers = interview.committee_members || [];

        console.log('🔍 Checking committee membership:', {
            interviewId: interview.id,
            committeeMembers: committeeMembers,
            currentUserId: currentUserId,
            applicant: interviewApplicant,
            applicants: interviewApplicants,
            lookingFor: applicantId,
        });

        // First check if this interview involves our applicant
        let hasApplicant = false;

        // Check singular applicant field (AdHoc interviews)
        if (interviewApplicant) {
            const appId = typeof interviewApplicant === 'string' ? interviewApplicant : interviewApplicant.id;
            if (appId === applicantId) hasApplicant = true;
        }

        // Check plural applicants field (Consultancy interviews)
        if (interviewApplicants.some((app: any) => {
            const appId = typeof app === 'string' ? app : app.id;
            return appId === applicantId;
        })) {
            hasApplicant = true;
        }

        // If this interview involves our applicant, check if user is a committee member
        if (hasApplicant) {
            const isUserInCommittee = committeeMembers.includes(currentUserId);
            console.log('🔍 User in committee for this interview?', isUserInCommittee);
            return isUserInCommittee;
        }

        return false;
    });

    // Debug committee membership and authorization
    console.log('🔐 Interview Access Control Debug:', {
        isAdhocInterview,
        isConsultantInterview,
        currentUserId,
        isAdmin,
        applicantId,
        pendingInterviewsCount: pendingInterviews.length,
        allInterviewsCount: Array.isArray(allInterviews) ? allInterviews.length : 0,
        isCommitteeMember,
        loadingStates: {
            loadingAdhocInterviews,
            loadingConsultancyInterviews
        }
    });

    const isAuthorized = currentUserId && (isAdmin ||
        isCommitteeMember ||
        (Array.isArray(pendingInterviews) && pendingInterviews.some((interview: any) => {
            // Check if this applicant is part of any of the user's pending interviews
            // For AdHoc interviews, check both 'applicant' (singular) and 'applicants' (plural)
            const interviewApplicant = interview.applicant; // Singular - for AdHoc
            const interviewApplicants = interview.applicants || []; // Plural - for Consultancy

            console.log('Checking interview:', {
                interviewId: interview.id,
                applicant: interviewApplicant,
                applicants: interviewApplicants,
                lookingFor: applicantId,
            });

            // Check singular applicant field (AdHoc interviews)
            if (interviewApplicant) {
                const appId = typeof interviewApplicant === 'string' ? interviewApplicant : interviewApplicant.id;
                console.log('Comparing (singular):', appId, '===', applicantId, '?', appId === applicantId);
                if (appId === applicantId) return true;
            }

            // Check plural applicants field (Consultancy interviews)
            return interviewApplicants.some((app: any) => {
                const appId = typeof app === 'string' ? app : app.id;
                console.log('Comparing (plural):', appId, '===', applicantId, '?', appId === applicantId);
                return appId === applicantId;
            });
        })));

    console.log('🔐 Authorization result:', {
        isAuthorized,
        isAdmin,
        isCommitteeMember,
        hasPendingInterviews: Array.isArray(pendingInterviews) && pendingInterviews.length > 0,
        allInterviewsCount: Array.isArray(allInterviews) ? allInterviews.length : 0,
        currentUserId,
    });

    const form = useForm({
        defaultValues: {
            // Interview type - required field
            interview_type: "NON_COMMITTEE",
            // Initialize all scoring fields with empty values - matching backend field names
            relevant_experience: "",
            project_management: "",
            recent_experience: "",
            comparable_projects: "",
            communication_skills: "",
            technical_skill: "",
            relevant_qualification: "",
            academic_credentials: "",
            timeline_management: "",
            toolset_framework: "",
        }
    });

    const onSubmit = async (data: any) => {
        console.log('Interview scores submitted:', data);

        // Calculate total score - exclude interview_type from calculation
        const { interview_type, ...scoreData } = data;
        const scores = Object.values(scoreData).filter(val => val !== "").map(Number);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        console.log('Individual scores:', scores);
        console.log('Total score:', totalScore);

        if (scores.length === 0) {
            toast.error('Please fill in at least one score before submitting.');
            return;
        }

        if (scores.length < 10) {
            toast.error('Please fill in all evaluation criteria before submitting.');
            return;
        }

        try {
            // Step 1: Submit interview scores
            const interviewPayload = {
                ...data, // This contains all the scores with correct field names
            };

            console.log('Submitting interview scores:', interviewPayload);
            console.log('Is AdHoc interview?', isAdhocInterview);

            let interviewResponse;

            if (isAdhocInterview) {
                // For AdHoc interviews, submit to the interview-scores endpoint
                console.log('🔍 Finding interview for applicant:', applicantId);
                console.log('🔍 Available pending interviews:', pendingInterviews);
                console.log('🔍 Pending interviews count:', pendingInterviews.length);

                // First, try to find in pending interviews
                let applicantInterview = pendingInterviews.find((interview: any) => {
                    const interviewApplicant = interview.applicant;
                    const appId = typeof interviewApplicant === 'string' ? interviewApplicant : interviewApplicant?.id;
                    console.log('🔍 Checking pending interview:', {
                        interviewId: interview.id,
                        interviewApplicant,
                        extractedAppId: appId,
                        matchesTarget: appId === applicantId
                    });
                    return appId === applicantId;
                });

                // If not found in pending (user already submitted), fetch all interviews and filter
                if (!applicantInterview) {
                    console.log('⚠️ Interview not in pending list. Fetching all interviews...');
                    try {
                        // Try fetching all interviews for the advertisement
                        const allInterviewsResponse = await AxiosWithToken.get(
                            `/programs/adhoc/interviews/`
                        );
                        console.log('📋 Raw all interviews response:', allInterviewsResponse);
                        console.log('📋 Response data:', allInterviewsResponse.data);

                        // Extract interviews from various possible response structures
                        let allInterviews = allInterviewsResponse.data?.data || allInterviewsResponse.data?.results || [];

                        // If data is an object with nested data, extract it
                        if (!Array.isArray(allInterviews) && typeof allInterviews === 'object') {
                            allInterviews = allInterviews.data || allInterviews.results || [];
                        }

                        console.log('📋 Extracted all interviews:', allInterviews);
                        console.log('📋 Is array?', Array.isArray(allInterviews));
                        console.log('📋 Length:', Array.isArray(allInterviews) ? allInterviews.length : 0);

                        // Filter for interviews matching this applicant
                        if (Array.isArray(allInterviews) && allInterviews.length > 0) {
                            const matchingInterviews = allInterviews.filter((interview: any) => {
                                const interviewApplicant = interview.applicant;
                                const appId = typeof interviewApplicant === 'string' ? interviewApplicant : interviewApplicant?.id;
                                const matches = appId === applicantId;
                                console.log('🔍 Checking interview:', {
                                    interviewId: interview.id,
                                    applicantId: appId,
                                    matches
                                });
                                return matches;
                            });

                            console.log('📋 Matching interviews:', matchingInterviews);

                            if (matchingInterviews.length > 0) {
                                // Use the most recent one
                                applicantInterview = matchingInterviews[matchingInterviews.length - 1];
                                console.log('✅ Found interview from all interviews:', applicantInterview);
                            } else {
                                console.log('⚠️ No matching interviews found for applicant:', applicantId);
                            }
                        } else {
                            console.log('⚠️ No interviews found in response');
                        }
                    } catch (fetchError: any) {
                        console.error('❌ Error fetching all interviews:', fetchError);
                        console.error('❌ Error response:', fetchError?.response?.data);
                    }
                }

                console.log('🔍 Final interview to use:', applicantInterview);

                if (!applicantInterview) {
                    console.error('❌ Interview not found! Available pending interviews:', pendingInterviews);
                    console.error('❌ Looking for applicant ID:', applicantId);
                    throw new Error('No interview found for this applicant. Please ensure an interview has been created.');
                }

                console.log('Found interview ID:', applicantInterview.id);

                // Submit score to AdHoc interview-scores endpoint
                interviewResponse = await AxiosWithToken.post(
                    `/programs/adhoc/interview-scores/`,
                    {
                        interview: applicantInterview.id,
                        ...interviewPayload
                    }
                );
                console.log('AdHoc interview score submitted successfully:', interviewResponse.data);

                // Check if all committee members have submitted their scores
                try {
                    // Fetch the interview details to get the committee members count
                    const interviewDetailsResponse = await AxiosWithToken.get(
                        `/programs/adhoc/interviews/${applicantInterview.id}/`
                    );
                    const committeeMembers = interviewDetailsResponse.data?.data?.committee_members || [];
                    const totalCommitteeMembers = committeeMembers.length;

                    console.log('📊 Committee Info:', {
                        interviewId: applicantInterview.id,
                        totalCommitteeMembers,
                        committeeMembers
                    });

                    // Fetch all scores and filter by interview ID
                    // Note: The endpoint /interviews/{id}/scores/ doesn't exist (404)
                    // So we fetch all scores and filter client-side
                    console.log('🔄 Fetching all interview scores...');

                    let scoresResponse;
                    try {
                        scoresResponse = await AxiosWithToken.get(
                            `/programs/adhoc/interview-scores/`
                        );
                        console.log('📦 Raw scores response:', scoresResponse);
                        console.log('📦 Scores response data:', scoresResponse.data);
                    } catch (scoresError: any) {
                        console.error('❌ Failed to fetch scores:', scoresError);
                        console.error('❌ Scores fetch error response:', scoresError?.response?.data);
                        throw scoresError; // Re-throw to be caught by outer catch
                    }

                    // Extract all scores from response
                    let allScores = scoresResponse.data?.data || scoresResponse.data?.results || [];

                    // Handle nested data structure
                    if (!Array.isArray(allScores) && typeof allScores === 'object') {
                        allScores = allScores.data || allScores.results || [];
                    }

                    console.log('📦 All scores fetched:', allScores);
                    console.log('📦 Is array?', Array.isArray(allScores));

                    // Filter scores for this specific interview
                    const submittedScores = Array.isArray(allScores)
                        ? allScores.filter((score: any) => {
                            const scoreInterviewId = typeof score.interview === 'string'
                                ? score.interview
                                : score.interview?.id;
                            const matches = scoreInterviewId === applicantInterview.id;
                            console.log('🔍 Checking score:', {
                                scoreId: score.id,
                                scoreInterviewId,
                                targetInterviewId: applicantInterview.id,
                                matches
                            });
                            return matches;
                        })
                        : [];

                    console.log('📦 Filtered submitted scores for this interview:', submittedScores);
                    console.log('📦 Filtered scores count:', submittedScores.length);

                    const totalSubmittedScores = Array.isArray(submittedScores) ? submittedScores.length : 0;
                    console.log('📦 Total submitted scores count:', totalSubmittedScores);

                    console.log('📝 Scores Info:', {
                        totalSubmittedScores,
                        submittedScores,
                        allSubmitted: totalSubmittedScores >= totalCommitteeMembers
                    });

                    // Only update applicant status if all committee members have submitted
                    if (totalSubmittedScores >= totalCommitteeMembers && totalCommitteeMembers > 0) {
                        console.log('✅ All committee members have submitted! Updating applicant status to INTERVIEWED');
                        console.log('🔧 Mutation details:', {
                            applicantId,
                            mutationExists: !!updateApplicantStatus,
                            mutateAsyncExists: !!updateApplicantStatus.mutateAsync
                        });
                        try {
                            const result = await updateApplicantStatus.mutateAsync({ status: "INTERVIEWED" });
                            console.log('✅ Applicant status updated successfully:', result);
                            console.log('✅ Cache invalidated - data will refresh');
                        } catch (updateError: any) {
                            console.error('❌ Failed to update applicant status:', updateError);
                            console.error('❌ Error details:', {
                                message: updateError?.message,
                                response: updateError?.response?.data,
                                status: updateError?.response?.status
                            });
                            // Don't throw - the score submission was successful
                        }
                    } else {
                        console.log('⏳ Waiting for remaining committee members to submit their scores');
                        console.log(`⏳ Currently ${totalSubmittedScores}/${totalCommitteeMembers} committee members have submitted`);
                    }
                } catch (statusError: any) {
                    console.error('❌ Error checking interview completion status:', statusError);
                    console.error('❌ Error response:', statusError?.response?.data);
                    console.error('❌ Full error object:', {
                        message: statusError?.message,
                        status: statusError?.response?.status,
                        statusText: statusError?.response?.statusText,
                        data: statusError?.response?.data
                    });
                    // Don't throw here - the score submission was successful
                }

                console.log('✨ Finished status update check for AdHoc interview');
            } else {
                // For Consultancy interviews - implement proper committee logic
                console.log('🔍 Finding consultancy interview for applicant:', applicantId);
                console.log('🔍 Available pending consultancy interviews:', pendingInterviews);

                // Find the interview for this applicant
                let applicantInterview = pendingInterviews.find((interview: any) => {
                    const interviewApplicants = interview.applicants || [];
                    return interviewApplicants.some((app: any) => {
                        const appId = typeof app === 'string' ? app : app.id;
                        return appId === applicantId;
                    });
                });

                // If not found in pending interviews, try to find in all interviews (fallback)
                if (!applicantInterview) {
                    console.log('🔍 Interview not found in pending list, searching all interviews...');
                    const allInterviews = extractInterviews(allConsultancyInterviews);
                    console.log('🔍 All consultancy interviews:', allInterviews);

                    applicantInterview = allInterviews.find((interview: any) => {
                        const interviewApplicants = interview.applicants || [];
                        return interviewApplicants.some((app: any) => {
                            const appId = typeof app === 'string' ? app : app.id;
                            return appId === applicantId;
                        });
                    });

                    if (applicantInterview) {
                        console.log('✅ Found interview in all interviews list:', applicantInterview.id);
                    }
                }

                if (!applicantInterview) {
                    console.error('❌ Consultancy interview not found!');
                    console.error('📊 Debug Info:', {
                        applicantId,
                        pendingInterviewsCount: pendingInterviews.length,
                        allInterviewsCount: extractInterviews(allConsultancyInterviews).length,
                        currentUserId,
                        isAdmin
                    });
                    throw new Error('No consultancy interview found for this applicant. Please ensure an interview has been created and you are assigned as an interviewer.');
                }

                console.log('Found consultancy interview ID:', applicantInterview.id);

                // Submit score to consultancy interview endpoint
                interviewResponse = await AxiosWithToken.post(
                    `/contract-grants/consultancy/interviews/${applicantInterview.id}/scores/`,
                    interviewPayload
                );
                console.log('Consultancy interview score submitted successfully:', interviewResponse.data);

                // Check if all committee members have submitted their scores
                try {
                    // Get interview details to check committee size
                    const interviewDetails = applicantInterview;
                    const interviewers = interviewDetails.interviewers || interviewDetails.interviewer_details || [];
                    const totalInterviewers = Array.isArray(interviewers) ? interviewers.length : 1;

                    console.log('📊 Consultancy Committee Info:', {
                        interviewId: applicantInterview.id,
                        totalInterviewers,
                        interviewers
                    });

                    // Fetch submitted scores for this interview
                    let submittedScoresCount = 0;
                    try {
                        const scoresResponse = await AxiosWithToken.get(
                            `/contract-grants/consultancy/interviews/${applicantInterview.id}/scores/`
                        );
                        const submittedScores = scoresResponse.data?.data || scoresResponse.data?.results || [];
                        submittedScoresCount = Array.isArray(submittedScores) ? submittedScores.length : 0;

                        console.log('📦 Consultancy submitted scores:', submittedScores);
                        console.log('📦 Total submitted scores:', submittedScoresCount);
                    } catch (scoresError) {
                        console.warn('⚠️ Could not fetch scores, assuming this is the first submission');
                        submittedScoresCount = 1; // This submission
                    }

                    console.log('📝 Consultancy Scores Info:', {
                        totalInterviewers,
                        submittedScoresCount,
                        allSubmitted: submittedScoresCount >= totalInterviewers
                    });

                    // Only update applicant status if all interviewers have submitted
                    if (submittedScoresCount >= totalInterviewers && totalInterviewers > 0) {
                        console.log('✅ All consultancy committee members have submitted! Updating applicant status to INTERVIEWED');

                        const statusResponse = await AxiosWithToken.patch(
                            `/contract-grants/consultancy/applicants/${applicantId}/`,
                            { status: "INTERVIEWED" }
                        );
                        console.log('✅ Consultancy applicant status updated successfully:', statusResponse.data);
                    } else {
                        console.log('⏳ Waiting for remaining consultancy committee members to submit their scores');
                        console.log(`⏳ Currently ${submittedScoresCount}/${totalInterviewers} committee members have submitted`);
                    }
                } catch (statusError: any) {
                    console.error('❌ Error checking consultancy interview completion status:', statusError);
                    // Don't throw - the score submission was successful
                }
            }

            toast.success(`Interview completed successfully! Total score: ${totalScore}/50`);

            // Navigate to the appropriate database page after successful submission
            setTimeout(() => {
                if (isAdhocInterview) {
                    // For AdHoc interviews, go to adhoc database
                    router.push('/dashboard/programs/adhoc-database');
                } else {
                    // For Consultancy interviews, go to consultancy database
                    router.push('/dashboard/c-and-g/consultancy-database');
                }
            }, 1500);

        } catch (error: any) {
            console.error("Interview submission error:", error);
            console.error("Error response:", error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.response?.data?.detail
                || error.message
                || "Failed to submit interview. Please try again.";

            // Enhanced error message for interview not found errors
            if (errorMessage.includes('No consultancy interview found') || errorMessage.includes('interview not found')) {
                toast.error(
                    `Failed to submit interview: ${errorMessage}`,
                    {
                        description: isConsultantInterview
                            ? "Please contact an administrator to ensure a consultancy interview has been scheduled for this applicant and you are assigned as an interviewer."
                            : "Please contact an administrator to ensure an adhoc interview has been scheduled for this applicant.",
                        duration: 8000
                    }
                );
            } else {
                toast.error(`Failed to submit interview: ${errorMessage}`);
            }
        }
    };

    // Show loading while fetching data
    if (isLoading || loadingAdhocInterviews || loadingConsultancyInterviews) {
        return <LoadingSpinner />;
    }

    // Show access denied if user is not authorized
    if (!isAuthorized) {
        return (
            <section>
                <BackNavigation />
                <Card className="p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <ShieldX className="w-10 h-10 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                            <p className="text-gray-600 max-w-md">
                                You are not authorized to conduct this interview. Only interview committee members assigned to this applicant can access this page.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span>If you believe this is an error, please contact the administrator.</span>
                        </div>
                        <Button
                            onClick={() => router.back()}
                            size="lg"
                            className="mt-4"
                        >
                            Go Back
                        </Button>
                    </div>
                </Card>
            </section>
        );
    }

    return (
        <section>
            <BackNavigation />

            <Card className="space-y-5">
                <div>
                    <h1 className="text-[#DEA004] font-bold text-lg">
                        {isAdhocInterview ? "Adhoc Interview" : isConsultantInterview ? "Consultant Interview" : "Interview"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Interviewing: <span className="font-semibold text-gray-900">{applicantName}</span>
                    </p>
                </div>

                <p className="text-sm">
                    Kindly use this matrix to comparatively evaluate consulting
                    candidates. For each consultant, next to each criteria enter
                    a ranking ranging between 1 and 4, where:
                </p>

                <ul className="text-sm list-disc pl-[15px] space-y-5">
                    {guide.map(({ main, sub }) => (
                        <li key={main}>
                            <span className="text-red-500 font-semibold">
                                {main}&nbsp;
                            </span>
                            {sub}
                        </li>
                    ))}
                </ul>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg text-[#DEA004] font-bold mb-4">
                                Relevant Experience Requirements
                            </h2>
                            <div className="space-y-4">
                                {evaluationCriteria.map((criteria) => (
                                    <div key={criteria.name} className="bg-white p-4 rounded border border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <label className="text-sm font-medium text-gray-700">
                                                {criteria.label}
                                            </label>
                                            <FormSelect
                                                name={criteria.name}
                                                placeholder="Select Score"
                                                options={scoreOptions}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <div className="flex items-center">
                                <h3 className="font-bold">Total Score:</h3>&nbsp;
                                <p>{
                                    (() => {
                                        const { interview_type, ...scoreFields } = form.watch();
                                        return Object.values(scoreFields).filter(val => val !== "").reduce((sum, score) => {
                                            const numScore = Number(score);
                                            return !isNaN(numScore) ? sum + numScore : sum;
                                        }, 0);
                                    })()
                                }/50</p>
                            </div>
                            <div className="flex items-center justify-end gap-x-5">
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    type="button"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <FormButton size="lg" type="submit">
                                    Submit
                                </FormButton>
                            </div>
                        </div>
                    </form>
                </Form>
            </Card>
        </section>
    );
}
