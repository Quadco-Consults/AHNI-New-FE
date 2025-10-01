"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Textarea } from "components/ui/textarea";
import { toast } from "sonner";
import { FileCheck, Save, Award } from "lucide-react";
import { useStartAssessment } from "@/features/contracts-grants/controllers/preAwardAssessmentController";
import { useGetSingleSubGrantSubmission } from "@/features/contracts-grants/controllers/submissionController";
import { technicalCapacityQuestions, financialPreAwardQuestions } from "./questions";
import { Loading } from "components/Loading";
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
    const { startAssessment, isLoading: isStarting } = useStartAssessment();
    const { data: submissionData, isLoading: isLoadingSubmission } = useGetSingleSubGrantSubmission(submissionId);

    const isCreating = isStarting;

    const questions = assessmentType === "technical"
        ? technicalCapacityQuestions
        : financialPreAwardQuestions;

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
                // For text type questions, check if answer exists
                if (q.options.type === "text") {
                    // Check if the main answer is provided
                    if (!answer?.answer?.trim()) {
                        return true;
                    }
                    // If requires_explanation, also check keyFindings
                    if (q.requires_explanation && !answer?.keyFindings?.trim()) {
                        return true;
                    }
                    return false;
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

        try {
            // Get partner ID from submission data
            const partnerId = submissionData?.data?.partner?.id || submissionData?.data?.partner;

            console.log("Full submission data:", submissionData);
            console.log("Extracted partner ID:", partnerId);

            if (!partnerId) {
                toast.error("Partner information not found. Cannot submit assessment.");
                return;
            }

            // Step 1: Start/create the assessment
            console.log("Starting assessment for submission:", submissionId, "partner:", partnerId);
            const response = await startAssessment(submissionId, partnerId);
            console.log("Start assessment response:", response);

            const currentAssessmentId = response?.data?.data?.id || response?.data?.id;
            console.log("Extracted assessment ID:", currentAssessmentId);

            if (!currentAssessmentId) {
                toast.error("Failed to create assessment. Please try again.");
                console.error("No assessment ID found in response:", response);
                return;
            }

            // Step 2: Build the assessment data structure with answers
            const assessmentData = {
                rating_scale: questions.rating_scale,
                forms: questions.forms.map(form => ({
                    category_name: form.category_name,
                    category_description: form.category_description || "",
                    questions: form.questions.map(q => {
                        const answer = answers[q.id];
                        return {
                            question: q.question,
                            answer: {
                                text: answer?.keyFindings || "",
                                rating_type: q.options.type === "boolean"
                                    ? (answer?.answer === "yes" ? q.options.yesRating : q.options.noRating)
                                    : "",
                                boolean: q.options.type === "boolean" ? (answer?.answer === "yes") : false
                            },
                            requires_explanation: q.requires_explanation || false
                        };
                    })
                }))
            };

            // Step 3: Update the assessment with the data using direct API call
            await AxiosWithToken.patch(
                `/contract-grants/award/assessments/${currentAssessmentId}/`,
                { assessment_data: assessmentData }
            );

            toast.success(`${assessmentType === "technical" ? "Technical Capacity" : "Financial Pre-Award"} Assessment submitted successfully!`);

            // After technical assessment, redirect to financial assessment
            if (assessmentType === "technical") {
                router.push(`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/preaward-assessment?type=financial`);
            } else {
                // After financial assessment (final stage), redirect to submission details or assessment results
                // Navigate back twice to get out of the assessment flow
                router.push(`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}`);
            }
        } catch (error: any) {
            toast.error(error?.message || "Failed to submit assessment");
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

            {/* Submission Info Card */}
            <Card className={assessmentType === "technical" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"}>
                <div>
                    <label className={`text-sm font-medium ${assessmentType === "technical" ? "text-blue-800" : "text-green-800"}`}>
                        Organization Name
                    </label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                        {submissionData?.data?.organisation_name || "N/A"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Type: <span className="font-medium">{submissionData?.data?.organisation_type?.replace(/_/g, ' ') || "N/A"}</span></span>
                        <span>Submission ID: <span className="font-medium">{submissionId}</span></span>
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
                    disabled={isCreating}
                >
                    Cancel
                </Button>

                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isCreating}
                    className={assessmentType === "technical" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                >
                    <Save size={16} className="mr-2" />
                    {isCreating ? "Submitting..." : `Submit ${assessmentType === "technical" ? "Technical" : "Financial"} Assessment`}
                </Button>
            </div>
        </section>
    );
}
