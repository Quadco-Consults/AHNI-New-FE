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
import { FileCheck, Save } from "lucide-react";
import { useCreateAssessment } from "@/features/contracts-grants/controllers/preAwardAssessmentController";
import { technicalCapacityQuestions, financialPreAwardQuestions } from "./questions";

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
    const { createAssessment, isLoading } = useCreateAssessment();

    const questions = assessmentType === "technical"
        ? technicalCapacityQuestions
        : financialPreAwardQuestions;

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
            form.questions.filter(q => !answers[q.id]?.answer)
        );

        if (unansweredQuestions.length > 0) {
            toast.error(`Please answer all questions (${unansweredQuestions.length} remaining)`);
            return;
        }

        try {
            // Transform answers to API format
            const assessmentData = {
                rating_scale: questions.rating_scale,
                forms: questions.forms.map(form => ({
                    category_name: form.category_name,
                    category_description: form.category_description,
                    questions: form.questions.map(q => ({
                        question: q.question,
                        answer: {
                            text: answers[q.id]?.keyFindings || "",
                            rating_type: answers[q.id]?.answer === "yes" ? q.options.yesRating : q.options.noRating,
                            boolean: answers[q.id]?.answer === "yes"
                        },
                        requires_explanation: q.requires_explanation
                    }))
                }))
            };

            await createAssessment({
                submission: submissionId,
                assessment_data: assessmentData
            });

            toast.success("Assessment submitted successfully!");
            router.back();
        } catch (error: any) {
            toast.error(error?.message || "Failed to submit assessment");
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <BackNavigation />
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">
                        {assessmentType === "technical" ? "Technical Capacity" : "Financial Pre-Award (PAT)"} Assessment
                    </span>
                </div>
            </div>

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
                    disabled={isLoading}
                >
                    Cancel
                </Button>

                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Save size={16} className="mr-2" />
                    {isLoading ? "Submitting..." : "Submit Assessment"}
                </Button>
            </div>
        </section>
    );
}
