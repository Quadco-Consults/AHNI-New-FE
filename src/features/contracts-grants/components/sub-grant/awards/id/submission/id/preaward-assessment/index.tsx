"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileCheck, Save, Award } from "lucide-react";
import { useStartAssessment, useGetAllAssessments, useSubmitAssessment } from "@/features/contracts-grants/controllers/preAwardAssessmentController";
import { useGetSingleSubGrantSubmission } from "@/features/contracts-grants/controllers/submissionController";
import { technicalCapacityQuestions, financialPreAwardQuestions } from "./questions";
import { Loading } from "@/components/Loading";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

interface Answer {
    answer: "yes" | "no" | "";
    keyFindings: string;
}

export default function PreAwardAssessment() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const submissionId = params?.id as string;
    const assessmentType = searchParams?.get("type") || "technical";

    const [answers, setAnswers] = useState<Record<string, Answer>>({});
    const [assessmentId, setAssessmentId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { startAssessment, isLoading: isStarting } = useStartAssessment();
    const { data: submissionData, isLoading: isLoadingSubmission } = useGetSingleSubGrantSubmission(submissionId);

    // Reset assessment ID when assessment type changes
    useEffect(() => {
        setAssessmentId(null);
        setAnswers({});
    }, [assessmentType]);

    // Get existing assessments for this submission
    const { data: assessmentsData } = useGetAllAssessments({
        submission: submissionId,
        page: 1,
        size: 10,
        enabled: true,
    });

    const questions = assessmentType === "technical"
        ? technicalCapacityQuestions
        : financialPreAwardQuestions;

    // Find existing PENDING/IN_PROGRESS assessment for this type
    const existingAssessment = assessmentsData?.data?.results?.find((assessment: any) => {
        console.log("Checking assessment:", {
            id: assessment.id,
            status: assessment.status,
            forms: assessment.assessment_submission?.forms,
            firstCategory: assessment.assessment_submission?.forms?.[0]?.category_name
        });

        // Only use assessment if it's still editable (not completed)
        if (assessment.status !== 'PENDING' && assessment.status !== 'IN_PROGRESS') {
            console.log("Skipping assessment - status is:", assessment.status);
            return false;
        }

        // Skip assessments with no forms (newly created, not yet submitted)
        const forms = assessment.assessment_submission?.forms || [];
        if (forms.length === 0) {
            console.log("Skipping assessment - no forms yet");
            return false;
        }

        const firstCategory = assessment.assessment_submission?.forms?.[0]?.category_name || '';
        if (assessmentType === "technical") {
            const match = firstCategory.includes('PROGRAMMING') || firstCategory.includes('MONITORING');
            console.log("Technical check:", match);
            return match;
        } else {
            const match = firstCategory.includes('General Organization') || firstCategory.includes('Internal Audits');
            console.log("Financial check:", match);
            return match;
        }
    });

    console.log("Existing assessment found:", existingAssessment?.id);

    if (isLoadingSubmission) {
        return <Loading />;
    }

    if (!submissionData?.data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Error: Submission data not found</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const handleAnswerChange = (questionId: string, field: "answer" | "keyFindings", value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [field]: value
            }
        }));
    };

    const handleSubmit = async () => {
        // Validate all questions are answered
        const unansweredQuestions = questions.forms.flatMap(form =>
            form.questions.filter(q => {
                const answer = answers[q.id];
                // For text type questions, check if answer exists in either answer or keyFindings field
                if (q.options.type === "text") {
                    return !answer?.answer?.trim() && !answer?.keyFindings?.trim();
                }
                // For boolean questions, check if yes/no is selected
                if (!answer?.answer) {
                    return true;
                }
                // If boolean requires explanation, check keyFindings
                if (q.requires_explanation && !answer?.keyFindings?.trim()) {
                    return true;
                }
                return false;
            })
        );

        if (unansweredQuestions.length > 0) {
            toast.error(`Please answer all questions (${unansweredQuestions.length} remaining)`);
            return;
        }

        setIsSubmitting(true);
        try {
            // Get partner ID from submission data
            const partnerId = submissionData?.data?.partner?.id || submissionData?.data?.partner;

            if (!partnerId) {
                toast.error("Partner information not found. Cannot submit assessment.");
                setIsSubmitting(false);
                return;
            }

            let currentAssessmentId = assessmentId || existingAssessment?.id;

            // Step 1: Create assessment if it doesn't exist
            if (!currentAssessmentId) {
                console.log("Creating new assessment...");
                console.log("Submission ID:", submissionId);
                console.log("Partner ID:", partnerId);

                try {
                    const startResult = await startAssessment(submissionId, partnerId);
                    console.log("Start assessment result:", startResult);

                    // The result has the assessment data inside 'data' property
                    currentAssessmentId = startResult?.data?.id || startResult?.id;
                    setAssessmentId(currentAssessmentId);

                    if (!currentAssessmentId) {
                        console.error("No assessment ID found in result:", startResult);
                        toast.error("Failed to create assessment - no ID returned");
                        setIsSubmitting(false);
                        return;
                    }

                    console.log("Assessment created with ID:", currentAssessmentId);
                } catch (startError: any) {
                    console.error("Failed to start assessment:", startError);
                    toast.error(`Failed to create assessment: ${startError?.message || "Unknown error"}`);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Step 2: Transform answers to match backend structure
            const formsWithAnswers = questions.forms.map(form => {
                const maxScore = form.questions.length * 2; // Assuming max 2 points per question

                return {
                    category_name: form.category_name,
                    category: assessmentType === "technical" ? "technical" : "financial",
                    max_score: maxScore,
                    questions: form.questions.map(question => {
                        const answer = answers[question.id];
                        const isYes = answer?.answer === "yes";
                        const isNo = answer?.answer === "no";

                        // Determine rating based on yes/no answer
                        let ratingType = "low"; // Default for text questions
                        let score = 0;

                        if (question.options.type === "boolean") {
                            if (isYes) {
                                ratingType = question.options.yesRating;
                            } else if (isNo) {
                                ratingType = question.options.noRating;
                            }

                            // Calculate score based on rating
                            if (ratingType === "low") score = 0;
                            else if (ratingType.includes("med")) score = 1;
                            else if (ratingType === "high") score = 2;
                        }
                        // For text questions, rating_type should be "low" by default

                        return {
                            id: question.id,
                            question: question.question,
                            requires_explanation: question.requires_explanation,
                            answer: {
                                text: answer?.keyFindings || answer?.answer || "",
                                rating_type: ratingType,
                                boolean: isYes,
                                score: score,
                            },
                            options: {
                                type: question.options.type === "boolean" ? "yes_no_rating" : "text",
                                no_rating: false, // Always false, not null
                                text: question.question,
                                choices: question.options.type === "boolean"
                                    ? [{ yes: true, rating: [question.options.yesRating, question.options.noRating] }]
                                    : [],
                            },
                        };
                    }),
                };
            });

            const assessmentSubmission = {
                final_rating: {
                    low_risk: { min: 0, max: 29, description: "Low Risk" },
                    medium_risk: { min: 30, max: 59, description: "Medium Risk" },
                    high_risk: { min: 60, max: 89, description: "High Risk" },
                    extremely_high_risk: { min: 90, max: 100, description: "Extremely High Risk" },
                },
                rating_scale: {
                    na: 0,
                    low: 0,
                    med: 1,
                    high: 2,
                },
                forms: formsWithAnswers,
            };

            console.log("Submitting assessment:", currentAssessmentId);
            console.log("Assessment submission data:", JSON.stringify(assessmentSubmission, null, 2));

            // Step 3: Submit the assessment data using the API directly
            const AxiosWithToken = (await import("@/constants/api_management/MyHttpHelperWithToken")).default;

            try {
                const response = await AxiosWithToken.patch(
                    `/contract-grants/award/assessments/${currentAssessmentId}/submit/`,
                    {
                        assessment_submission: assessmentSubmission,
                    }
                );

                console.log("Submit response:", response.data);
                console.log("Assessment status after submit:", response.data?.data?.status);
                console.log("Assessment total_score after submit:", response.data?.data?.total_score);
            } catch (submitError: any) {
                console.error("Submit API error:", submitError);
                console.error("Error response:", submitError?.response?.data);
                throw submitError;
            }

            toast.success(`${assessmentType === "technical" ? "Technical Capacity" : "Financial Pre-Award"} Assessment submitted successfully!`);

            // Wait a bit for backend to finish processing
            await new Promise(resolve => setTimeout(resolve, 500));

            // Get the sub-grant ID from submission data
            const subGrantId = submissionData?.data?.sub_grant_id
                || (typeof submissionData?.data?.sub_grant === 'string'
                    ? submissionData?.data?.sub_grant
                    : submissionData?.data?.sub_grant?.id);

            // If technical assessment was completed, redirect to financial assessment
            if (assessmentType === "technical") {
                router.push(`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/preaward-assessment?type=financial`);
            } else {
                // If financial assessment was completed, redirect to sub-grant awards page
                if (subGrantId) {
                    // Force a refresh of the page data
                    router.refresh();
                    router.push(`/dashboard/c-and-g/sub-grant/awards/${subGrantId}`);
                } else {
                    router.back();
                }
            }
        } catch (error: any) {
            console.error("Assessment submission error:", error);
            toast.error(error?.message || "Failed to submit assessment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <BackNavigation />
                <div className="flex items-center gap-4">
                    {assessmentType === "technical" ? (
                        <div className="flex items-center gap-2">
                            <FileCheck className="text-blue-600" size={20} />
                            <span className="text-lg font-semibold text-blue-700">
                                Technical Capacity Assessment
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Award className="text-green-600" size={20} />
                            <span className="text-lg font-semibold text-green-700">
                                Financial Pre-Award Assessment (PAT)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Organization Details Card */}
            <Card className="bg-blue-50 border-blue-200">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-blue-900">Organization's Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Legal Name of the Organization</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.organisation_name || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Organization Type</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.organisation_type?.replace(/_/g, ' ') || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">MD/CEO Name & Title</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.principal_one_name || "N/A"} - {submissionData?.data?.principal_one_designaation || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Director Name & Title</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.principal_two_name || "N/A"} - {submissionData?.data?.principal_two_designation || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.address || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Telephone</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.phone_number || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.email || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Web Address</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.web_address || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">DUNS Number</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.duns_number || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Has Financial Conflict of Interest Policy</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.has_conflict_of_interest ? "Yes" : "No"}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Proposed Subaward Details Card */}
            <Card className="bg-green-50 border-green-200">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-green-900">Proposed Subaward Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Project Title</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.sub_grant?.project?.title || submissionData?.data?.sub_grant?.title || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">AHNI Project Number</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.sub_grant?.project?.project_id || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Country of Performance</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">Nigeria</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">AHNI Originating Funder / Funding Source</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.sub_grant?.project?.funding_sources?.[0]?.name || submissionData?.data?.sub_grant?.project?.funding_source || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">AHNI Grant Administrator</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.sub_grant?.sub_grant_administrator?.full_name || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">AHNI Program/Technical Staff Contact</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.sub_grant?.technical_staff?.full_name || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Subaward Period of Performance</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                {submissionData?.data?.sub_grant?.start_date || "N/A"} to {submissionData?.data?.sub_grant?.end_date || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Subaward Life of Project Value</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                USD {submissionData?.data?.sub_grant?.amount_usd || "N/A"} / NGN {submissionData?.data?.sub_grant?.amount_ngn || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Subaward Type (Proposed)</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.sub_grant?.award_type?.replace(/_/g, ' ') || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Business Unit</label>
                            <p className="text-base font-semibold text-gray-900 mt-1">{submissionData?.data?.sub_grant?.business_unit || "Nigeria"}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {questions.forms.map((form, formIndex) => (
                <Card key={formIndex} className="space-y-6">
                    <div>
                        <h1 className="text-xl font-bold text-yellow-600 uppercase">
                            {form.category_name}
                        </h1>
                        {form.category_description && (
                            <p className="text-sm text-gray-600 mt-2">
                                {form.category_description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {form.questions.map((question, qIndex) => {
                            const questionId = question.id || `${formIndex}-${qIndex}`;
                            const currentAnswer = answers[questionId];

                            return (
                                <Card key={questionId} className="p-6 bg-gray-50">
                                    <div className="flex gap-4">
                                        <span className="font-bold text-gray-700 min-w-[30px]">
                                            {qIndex + 1}.
                                        </span>

                                        <div className="flex-1 space-y-4">
                                            <h3 className="font-semibold text-gray-800">
                                                {question.question}
                                            </h3>

                                            {/* Yes/No Options */}
                                            {question.options.type === "boolean" && (
                                                <RadioGroup
                                                    value={currentAnswer?.answer || ""}
                                                    onValueChange={(value) =>
                                                        handleAnswerChange(questionId, "answer", value)
                                                    }
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id={`${questionId}-yes`} />
                                                            <Label
                                                                htmlFor={`${questionId}-yes`}
                                                                className="font-medium cursor-pointer"
                                                            >
                                                                Yes
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id={`${questionId}-no`} />
                                                            <Label
                                                                htmlFor={`${questionId}-no`}
                                                                className="font-medium cursor-pointer"
                                                            >
                                                                No
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            )}

                                            {/* Text input for non-boolean questions */}
                                            {question.options.type === "text" && (
                                                <Input
                                                    placeholder="Enter your answer"
                                                    value={currentAnswer?.answer || ""}
                                                    onChange={(e) =>
                                                        handleAnswerChange(questionId, "answer", e.target.value)
                                                    }
                                                />
                                            )}

                                            {/* Key Findings / Explanation */}
                                            {question.requires_explanation && (
                                                <div className="space-y-2">
                                                    <Label className="font-semibold text-gray-700">
                                                        Key Findings
                                                    </Label>
                                                    <Textarea
                                                        placeholder="Enter key findings or explanation..."
                                                        value={currentAnswer?.keyFindings || ""}
                                                        onChange={(e) =>
                                                            handleAnswerChange(questionId, "keyFindings", e.target.value)
                                                        }
                                                        rows={3}
                                                    />
                                                </div>
                                            )}

                                            {/* Show rating hint */}
                                            {question.options.type === "boolean" && currentAnswer?.answer && (
                                                <p className="text-xs text-gray-500">
                                                    Rating: {currentAnswer.answer === "yes"
                                                        ? question.options.yesRating
                                                        : question.options.noRating}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </Card>
            ))}

            {/* Action Buttons */}
            <div className="flex items-center justify-between sticky bottom-0 bg-white p-4 border-t shadow-lg">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                    disabled={isStarting || isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isStarting || isSubmitting}
                    className={assessmentType === "technical" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                >
                    <Save size={16} className="mr-2" />
                    {(isStarting || isSubmitting) ? "Submitting..." : `Submit ${assessmentType === "technical" ? "Technical" : "Financial"} Assessment`}
                </Button>
            </div>
        </section>
    );
}
