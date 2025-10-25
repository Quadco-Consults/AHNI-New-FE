"use client";

import React from "react";
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
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import { LoadingSpinner } from "components/Loading";
import { useGetMyPendingAdhocInterviews, useGetAllAdhocInterviews } from "@/features/programs/controllers/adhocInterviewController";
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
    { name: "comparable_projects", label: "Worked with projects comparable to the AHNi (budget and complexity)" },
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
    const adhocId = params?.id as string;        // The consultancy/adhoc management ID
    const applicantId = params?.applicantId as string;  // The applicant ID

    // Determine if this is an AdHoc interview based on the URL path
    const isAdhocInterview = typeof window !== 'undefined' && window.location.pathname.includes('/adhoc-management/');

    // Mutation hook for updating applicant status (only for AdHoc)
    const updateApplicantStatus = useUpdateAdhocApplicantStatus(applicantId);

    // Fetch applicant data
    const { data: applicantData, isLoading } = useGetSingleConsultancyApplicant(applicantId);
    const applicantName = applicantData?.data?.name || "Applicant";

    // Fetch consultancy data to get the correct consultancy ID for interviews
    const { data: consultancyData } = useGetSingleConsultantManagement(adhocId);

    // Fetch current user profile
    const { data: userProfile, isLoading: loadingUserProfile } = useGetUserProfile();
    const currentUserId = userProfile?.data?.id;
    const isAdmin = (userProfile?.data as any)?.is_superuser || (userProfile?.data as any)?.is_staff;

    // Fetch pending interviews for the current user (both types)
    const { data: adhocInterviews, isLoading: loadingAdhocInterviews } = useGetMyPendingAdhocInterviews(isAdhocInterview);
    const { data: consultancyInterviews, isLoading: loadingConsultancyInterviews } = useGetMyPendingConsultancyInterviews(!isAdhocInterview);

    // Fetch all interviews to check committee membership (both types)
    const { data: allAdhocInterviews } = useGetAllAdhocInterviews(isAdhocInterview ? adhocId : undefined, isAdhocInterview);
    const { data: allConsultancyInterviews, isLoading: loadingAllConsultancyInterviews, error: errorAllConsultancyInterviews } = useGetAllConsultancyInterviews(isAdhocInterview ? undefined : adhocId, !isAdhocInterview);

    console.log('🔍 Hook Parameters Debug:', {
        isAdhocInterview,
        adhocId,
        consultancyIdParam: isAdhocInterview ? undefined : adhocId,
        enabledParam: !isAdhocInterview,
        loadingAllConsultancyInterviews,
        errorAllConsultancyInterviews,
    });

    console.log('🔍 Consultancy Data Debug:', {
        consultancyData: consultancyData,
        consultancyDataStructure: consultancyData?.data,
        possibleIds: {
            id: consultancyData?.data?.id,
            advertisement_id: (consultancyData?.data as any)?.advertisement_id,
            consultant_id: (consultancyData?.data as any)?.consultant_id,
            related_consultancy: (consultancyData?.data as any)?.consultancy,
            rawData: consultancyData?.data,
        },
    });

    // Test the API directly to see what's happening
    React.useEffect(() => {
        if (consultancyData?.data?.id) {
            console.log('🧪 Testing API calls directly:');

            // Test without consultancy parameter - CORRECT ENDPOINT
            AxiosWithToken.get('/contract-grants/consultancy/applicant-interviews/')
                .then(response => {
                    console.log('🧪 API call WITHOUT consultancy param (CORRECT ENDPOINT):', response.data);
                })
                .catch(error => {
                    console.log('🧪 API call WITHOUT consultancy param ERROR (CORRECT ENDPOINT):', error);
                });

            // Test with consultancy parameter - CORRECT ENDPOINT
            AxiosWithToken.get('/contract-grants/consultancy/applicant-interviews/', {
                params: { consultancy: consultancyData.data.id }
            })
                .then(response => {
                    console.log('🧪 API call WITH consultancy param (CORRECT ENDPOINT):', response.data);
                })
                .catch(error => {
                    console.log('🧪 API call WITH consultancy param ERROR (CORRECT ENDPOINT):', error);
                });
        }
    }, [consultancyData?.data?.id]);

    // Check if user is authorized to interview this applicant
    // Handle nested data structure: response.data.data or response.data
    const extractInterviews = (response: any) => {
        if (!response) return [];
        if (Array.isArray(response.data)) return response.data;
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
        : extractInterviews(consultancyInterviews);

    console.log('🔐 Interview Access Control Debug:', {
        isAdhocInterview,
        currentUserId,
        isAdmin,
        applicantId,
        pendingInterviewsCount: pendingInterviews.length,
        pendingInterviews: pendingInterviews,
        adhocInterviewsRaw: adhocInterviews,
        consultancyInterviewsRaw: consultancyInterviews,
        allAdhocInterviewsRaw: allAdhocInterviews,
        allConsultancyInterviewsRaw: allConsultancyInterviews,
        extractedPendingData: isAdhocInterview ? adhocInterviews?.data : consultancyInterviews?.data,
        extractedAllData: isAdhocInterview ? allAdhocInterviews?.data : allConsultancyInterviews?.data,
        adhocId: adhocId,
    });

    // Debug the raw API responses
    console.log('🔍 Raw API Response Analysis:', {
        allConsultancyInterviewsStructure: allConsultancyInterviews,
        allConsultancyDataPath: allConsultancyInterviews?.data,
        allConsultancyNestedPath: (allConsultancyInterviews?.data as any)?.data,
        allConsultancyResultsPath: (allConsultancyInterviews?.data as any)?.results,
    });

    // Check if user is a committee member for any interview involving this applicant
    const allInterviews = isAdhocInterview
        ? extractInterviews(allAdhocInterviews)
        : extractInterviews(allConsultancyInterviews);

    console.log('🔍 Committee Check Setup:', {
        loadingUserProfile,
        currentUserId,
        allInterviewsArray: Array.isArray(allInterviews),
        allInterviewsLength: Array.isArray(allInterviews) ? allInterviews.length : 'not array',
        allInterviews: allInterviews,
    });

    const isCommitteeMember = !loadingUserProfile && currentUserId && Array.isArray(allInterviews) && allInterviews.some((interview: any) => {
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
            fullInterview: interview,
        });

        // Special logging for our target applicant
        if (interviewApplicant === applicantId || interviewApplicants.some((app: any) => {
            const appId = typeof app === 'string' ? app : app.id;
            return appId === applicantId;
        })) {
            console.log('🎯 FOUND INTERVIEW FOR OUR APPLICANT:', {
                interviewId: interview.id,
                committeeMembers: committeeMembers,
                committeeMembersLength: committeeMembers.length,
                fullInterviewData: interview,
                applicantMatches: interviewApplicant === applicantId,
                applicantsArrayMatch: interviewApplicants.some((app: any) => {
                    const appId = typeof app === 'string' ? app : app.id;
                    return appId === applicantId;
                }),
            });
        }

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

    console.log('🔓 Committee Member Authorization Check:', {
        currentUserId,
        isCommitteeMember,
        allInterviews: allInterviews,
        reason: 'Backend committee_members serializer has been fixed - proper authorization should work now'
    });

    const isAuthorized = (!loadingUserProfile && currentUserId) && (isAdmin ||
        isCommitteeMember ||
        (Array.isArray(pendingInterviews) && pendingInterviews.some((interview: any) => {
            // Check if this applicant is part of any of the user's pending interviews
            // For AdHoc interviews, check both 'applicant' (singular) and 'applicants' (plural)
            const interviewApplicant = interview.applicant; // Singular - for AdHoc
            const interviewApplicants = interview.applicants || []; // Plural - for Consultancy

            console.log('Checking pending interview:', {
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
        })) ||
        isCommitteeMember);

    console.log('🔐 Authorization result:', {
        isAuthorized,
        isAdmin,
        hasPendingInterviews: Array.isArray(pendingInterviews) && pendingInterviews.length > 0,
        isCommitteeMember,
        allInterviewsCount: Array.isArray(allInterviews) ? allInterviews.length : 0,
        loadingUserProfile,
        currentUserId,
        userProfileLoaded: !!userProfile?.data,
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
                // For Consultancy interviews, implement multi-scorer workflow
                console.log('🔍 Finding consultancy interview for applicant:', applicantId);
                console.log('🔍 Consultancy ID:', adhocId);
                console.log('🔍 Available pending interviews:', pendingInterviews);
                console.log('🔍 Pending interviews count:', pendingInterviews.length);

                // Find the interview for this applicant
                let applicantInterview = pendingInterviews.find((interview: any) => {
                    const interviewApplicant = interview.application || interview.applicant;
                    const appId = typeof interviewApplicant === 'string' ? interviewApplicant : interviewApplicant?.id;
                    console.log('🔍 Checking pending interview:', {
                        interviewId: interview.id,
                        application: interview.application,
                        applicant: interview.applicant,
                        extractedAppId: appId,
                        targetApplicantId: applicantId,
                        matches: appId === applicantId
                    });
                    return appId === applicantId;
                });

                console.log('🔍 Found in pending?', !!applicantInterview);

                // If not in pending, fetch all interviews for this consultancy
                if (!applicantInterview) {
                    console.log('⚠️ Not in pending, fetching all interviews for consultancy:', adhocId);

                    try {
                        const allInterviewsResponse = await AxiosWithToken.get(
                            `/contract-grants/consultancy/applicant-interviews/`,
                            { params: adhocId ? { consultancy: adhocId } : undefined }
                        );

                        console.log('📋 All interviews response:', allInterviewsResponse.data);

                        let allInterviews = allInterviewsResponse.data?.data?.results || allInterviewsResponse.data?.results || [];
                        if (!Array.isArray(allInterviews) && typeof allInterviews === 'object') {
                            allInterviews = allInterviews.data || allInterviews.results || [];
                        }

                        console.log('📋 Extracted interviews array:', allInterviews);
                        console.log('📋 Total interviews found:', Array.isArray(allInterviews) ? allInterviews.length : 0);

                        if (Array.isArray(allInterviews)) {
                            const matches = allInterviews.filter((interview: any) => {
                                const appId = interview.application || interview.applicant;
                                const finalAppId = typeof appId === 'string' ? appId : appId?.id;
                                const matches = finalAppId === applicantId;
                                console.log('🔍 Checking interview:', {
                                    interviewId: interview.id,
                                    application: interview.application,
                                    applicant: interview.applicant,
                                    extractedAppId: finalAppId,
                                    matches
                                });
                                return matches;
                            });

                            console.log('📋 Matching interviews:', matches);
                            console.log('📋 Matches count:', matches.length);

                            if (matches.length > 0) {
                                applicantInterview = matches[matches.length - 1];
                                console.log('✅ Found matching interview:', applicantInterview);
                            } else {
                                console.log('❌ No matching interviews found for applicant:', applicantId);
                                console.log('❌ Available applicant IDs in interviews:', allInterviews.map((i: any) => i.application || i.applicant));
                            }
                        }
                    } catch (fetchError: any) {
                        console.error('❌ Error fetching all interviews:', fetchError);
                        console.error('❌ Error response:', fetchError.response?.data);
                    }
                }

                if (!applicantInterview) {
                    console.error('❌ FINAL: No interview found!');
                    console.error('❌ Applicant ID:', applicantId);
                    console.error('❌ Consultancy ID:', adhocId);
                    console.error('❌ Pending interviews:', pendingInterviews);

                    throw new Error(
                        'No interview found for this applicant.\n\n' +
                        'Please ensure:\n' +
                        '1. An interview has been created for this applicant\n' +
                        '2. You are assigned as a committee member\n' +
                        '3. The interview is still active\n\n' +
                        'Check the console logs for more details.'
                    );
                }

                console.log('✅ Found interview:', applicantInterview);
                console.log('🔍 Interview details:', {
                    id: applicantInterview.id,
                    interview_type: applicantInterview.interview_type,
                    committee_members: applicantInterview.committee_members,
                    committee_members_count: applicantInterview.committee_members?.length || 0
                });

                const isCommitteeInterview = applicantInterview.interview_type === 'COMMITTEE' &&
                                           applicantInterview.committee_members &&
                                           applicantInterview.committee_members.length > 0;

                console.log('🎯 Interview type check:', {
                    isCommitteeInterview,
                    interview_type: applicantInterview.interview_type,
                    hasCommitteeMembers: !!applicantInterview.committee_members,
                    committeeCount: applicantInterview.committee_members?.length || 0
                });

                if (isCommitteeInterview) {
                    console.log('🎯 COMMITTEE interview detected - using multi-scorer workflow');
                    console.log('📤 Submitting to multi-scorer endpoint:', `/contract-grants/consultancy/interview-scores/`);

                    try {
                        // Prepare payload with interview_id and applicant_id in the body
                        const multiScorerPayload = {
                            ...interviewPayload,
                            interview: applicantInterview.id,  // Add interview_id to body
                            application: applicantId,  // Add applicant_id to body (required by backend)
                        };

                        console.log('📤 Payload:', multiScorerPayload);

                        // Submit to multi-scorer endpoint (correct backend URL)
                        interviewResponse = await AxiosWithToken.post(
                            `/contract-grants/consultancy/interview-scores/`,
                            multiScorerPayload
                        );
                        console.log('✅ Score submitted successfully via multi-scorer API');
                        console.log('✅ Response:', interviewResponse.data);

                        // Check completion status using correct backend URL
                        console.log('📊 Fetching completion status from:', `/contract-grants/consultancy/interview-scores/summary/${applicantInterview.id}/`);
                        const summaryResponse = await AxiosWithToken.get(
                            `/contract-grants/consultancy/interview-scores/summary/${applicantInterview.id}/`
                        );
                        console.log('📊 Summary response:', summaryResponse.data);

                        const summaryData = summaryResponse.data?.data || summaryResponse.data;
                        const totalInterviewers = summaryData?.total_interviewers || 0;
                        const completedEvaluations = summaryData?.completed_evaluations || 0;

                        console.log('📊 Interview progress:', {
                            completed: completedEvaluations,
                            total: totalInterviewers,
                            percentage: summaryData?.completion_percentage,
                            allComplete: completedEvaluations >= totalInterviewers && totalInterviewers > 0
                        });

                        // Only update status after ALL interviewers complete
                        if (completedEvaluations >= totalInterviewers && totalInterviewers > 0) {
                            console.log('✅ ALL committee members completed! Updating status to INTERVIEWED');
                            console.log(`✅ Final: ${completedEvaluations}/${totalInterviewers} completed`);
                            console.log('✅ Committee members:', applicantInterview.committee_members);
                            console.log('✅ This was the LAST required interview for this applicant');

                            await AxiosWithToken.patch(
                                `/contract-grants/consultancy/applicants/${applicantId}/`,
                                { status: "INTERVIEWED" }
                            );
                            console.log('✅ Status successfully updated to INTERVIEWED');

                            // Store completion status for success message
                            (interviewResponse as any).isFullyComplete = true;
                            (interviewResponse as any).completionInfo = {
                                completedEvaluations,
                                totalInterviewers,
                                percentage: summaryData?.completion_percentage
                            };
                        } else {
                            console.log(`⏳ NOT all complete yet - status will remain SHORTLISTED`);
                            console.log(`⏳ Progress: ${completedEvaluations}/${totalInterviewers} committee members completed (${summaryData?.completion_percentage || 0}%)`);
                            console.log(`⏳ Still need ${totalInterviewers - completedEvaluations} more interviewer(s) to complete their evaluation`);
                            console.log(`⏳ Remaining interviewers should appear in their "Pending Interviews" list`);

                            // Store completion status for success message
                            (interviewResponse as any).isFullyComplete = false;
                            (interviewResponse as any).completionInfo = {
                                completedEvaluations,
                                totalInterviewers,
                                remaining: totalInterviewers - completedEvaluations,
                                percentage: summaryData?.completion_percentage
                            };
                        }
                    } catch (multiScorerError: any) {
                        console.error('❌ Multi-scorer API failed!');
                        console.error('❌ Error message:', multiScorerError.message);
                        console.error('❌ Response data:', multiScorerError.response?.data);
                        console.error('❌ Status code:', multiScorerError.response?.status);
                        console.error('❌ Request payload was:', {
                            interview: applicantInterview.id,
                            application: applicantId,
                            scores: interviewPayload
                        });
                        console.error('⚠️ FALLING BACK TO LEGACY ENDPOINT - THIS WILL UPDATE STATUS IMMEDIATELY!');
                        console.error('⚠️ WARNING: Legacy fallback does NOT support multi-committee scoring!');

                        // Show error to user about multi-scorer failure
                        toast.error('Multi-committee scoring failed. Using legacy mode - status will be updated immediately.');

                        // Fallback to old endpoint
                        interviewResponse = await AxiosWithToken.post(
                            `/contract-grants/consultancy/applicants/${applicantId}/interviews/`,
                            interviewPayload
                        );
                        console.log('⚠️ Legacy endpoint response:', interviewResponse.data);

                        await AxiosWithToken.patch(
                            `/contract-grants/consultancy/applicants/${applicantId}/`,
                            { status: "INTERVIEWED" }
                        );
                        console.log('⚠️ Status updated to INTERVIEWED via legacy fallback');
                    }
                } else {
                    console.log('📝 NON-COMMITTEE interview - using legacy workflow');
                    // For non-committee, use old endpoint and update status immediately
                    interviewResponse = await AxiosWithToken.post(
                        `/contract-grants/consultancy/applicants/${applicantId}/interviews/`,
                        interviewPayload
                    );
                    await AxiosWithToken.patch(
                        `/contract-grants/consultancy/applicants/${applicantId}/`,
                        { status: "INTERVIEWED" }
                    );
                }
            }

            // Show appropriate success message based on completion status
            const completionInfo = (interviewResponse as any)?.completionInfo;
            const isFullyComplete = (interviewResponse as any)?.isFullyComplete;

            if (isFullyComplete) {
                toast.success(
                    `Interview fully completed! All ${completionInfo?.totalInterviewers || ''} committee members have submitted their evaluations. ` +
                    `Your score: ${totalScore}/50. Applicant status updated to INTERVIEWED.`,
                    { duration: 5000 }
                );
            } else if (completionInfo) {
                toast.success(
                    `Your evaluation submitted successfully! Total score: ${totalScore}/50. ` +
                    `Progress: ${completionInfo.completedEvaluations}/${completionInfo.totalInterviewers} committee members completed. ` +
                    `Waiting for ${completionInfo.remaining} more interviewer(s).`,
                    { duration: 5000 }
                );
            } else {
                // Fallback message (for non-committee or legacy flow)
                toast.success(`Interview completed successfully! Total score: ${totalScore}/50`);
            }

            // Navigate back to the previous page after successful submission
            setTimeout(() => {
                router.back();
            }, 2000); // Increased to 2 seconds to give users time to read the message

        } catch (error: any) {
            console.error("Interview submission error:", error);
            console.error("Error response:", error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.response?.data?.detail
                || error.message
                || "Failed to submit interview. Please try again.";

            toast.error(`Failed to submit interview: ${errorMessage}`);
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
                        Consultant Evaluation Metric
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
