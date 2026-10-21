"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useGetPublicTest,
  useStartTest,
  useSubmitTest,
  useSaveTestProgress,
} from "@/features/hr/controllers/publicTestController";
import { Loading } from "@/components/Loading";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const PublicTestInterface = () => {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const { data: testData, isLoading, error } = useGetPublicTest(token);
  const startTest = useStartTest(token);
  const submitTest = useSubmitTest(token);
  const saveProgress = useSaveTestProgress(token);

  const test = testData?.data;
  const assignment = test?.assignment;
  const questions = test?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate time remaining
  useEffect(() => {
    if (!assignment || assignment.status === "PENDING") return;

    const calculateTimeRemaining = () => {
      if (assignment.status === "SUBMITTED" || assignment.status === "EXPIRED") {
        setTimeRemaining(0);
        return;
      }

      const durationMs = test.test.duration_minutes * 60 * 1000;
      const startedAt = new Date(assignment.started_at || Date.now()).getTime();
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, durationMs - elapsed);

      setTimeRemaining(Math.floor(remaining / 1000));
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [assignment, test]);

  // Auto-submit when time expires
  useEffect(() => {
    if (timeRemaining === 0 && hasStarted && assignment?.status === "IN_PROGRESS") {
      handleSubmitTest();
    }
  }, [timeRemaining, hasStarted]);

  // Auto-save answers
  const autoSaveAnswers = useCallback(() => {
    if (Object.keys(answers).length > 0 && assignment?.status === "IN_PROGRESS") {
      saveProgress.mutate({ answers });
    }
  }, [answers, assignment]);

  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      autoSaveAnswers();
    }, 3000); // Auto-save after 3 seconds of inactivity

    setAutoSaveTimeout(timeout);

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [answers]);

  const handleStartTest = async () => {
    await startTest.mutateAsync();
    setHasStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitTest = async () => {
    if (
      confirm(
        "Are you sure you want to submit your test? You will not be able to make changes after submission."
      )
    ) {
      try {
        await submitTest.mutateAsync({ answers });
        toast.success("Test submitted successfully!");
        router.push("/test/submitted");
      } catch (error) {
        // Error already handled by controller
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter((key) => answers[key]?.trim()).length;
  };

  const getProgressPercentage = () => {
    if (questions.length === 0) return 0;
    return (getAnsweredCount() / questions.length) * 100;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invalid Test Link</h2>
          <p className="text-muted-foreground">
            This test link is invalid or has expired. Please contact HR for assistance.
          </p>
        </Card>
      </div>
    );
  }

  if (assignment.status === "SUBMITTED" || assignment.status === "GRADED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Test Already Submitted</h2>
          <p className="text-muted-foreground">
            You have already submitted this test. Your responses are being reviewed.
          </p>
        </Card>
      </div>
    );
  }

  if (assignment.status === "EXPIRED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Test Expired</h2>
          <p className="text-muted-foreground">
            The deadline for this test has passed. Please contact HR for assistance.
          </p>
        </Card>
      </div>
    );
  }

  if (assignment.status === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">{test.test.title}</h1>
          {test.test.description && (
            <p className="text-muted-foreground mb-6">{test.test.description}</p>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Candidate Name:</span>
              <span>{test.applicant_name}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Position:</span>
              <span>{test.position_applied}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Total Questions:</span>
              <span>{questions.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Duration:</span>
              <span>{test.test.duration_minutes} minutes</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Total Marks:</span>
              <span>{test.test.total_marks}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Important Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Once you start the test, the timer will begin immediately</li>
              <li>You must complete the test within the allocated time</li>
              <li>Your progress will be auto-saved every few seconds</li>
              <li>You can navigate between questions freely</li>
              <li>Make sure you submit the test before time runs out</li>
            </ul>
          </div>

          <Button onClick={handleStartTest} size="lg" className="w-full">
            Start Test
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{test.test.title}</h1>
              <p className="text-sm text-muted-foreground">{test.applicant_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Time Remaining</span>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    timeRemaining < 300 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Progress: {getAnsweredCount()} of {questions.length} answered
              </span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} />
          </div>
        </Card>

        {/* Question */}
        {currentQuestion && (
          <Card className="p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Badge className="mb-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <div className="flex gap-2">
                  <Badge variant="outline">{currentQuestion.question_type.replace(/_/g, " ")}</Badge>
                  <Badge variant="outline">{currentQuestion.marks} marks</Badge>
                </div>
              </div>
              {answers[currentQuestion.id] && (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
            </div>

            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question_text}</h2>

            {/* Answer Input */}
            <div className="space-y-4">
              {currentQuestion.question_type === "MULTIPLE_CHOICE" && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.question_type === "TRUE_FALSE" && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="True" id="true" />
                    <Label htmlFor="true" className="flex-1 cursor-pointer">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="False" id="false" />
                    <Label htmlFor="false" className="flex-1 cursor-pointer">
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {(currentQuestion.question_type === "SHORT_ANSWER" ||
                currentQuestion.question_type === "ESSAY") && (
                <Textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={currentQuestion.question_type === "ESSAY" ? 10 : 4}
                  className="w-full"
                />
              )}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Auto-saving...</span>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))
              }
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-10 gap-2 mb-6">
            {questions.map((q, index) => (
              <Button
                key={q.id}
                variant={currentQuestionIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className={`relative ${
                  answers[q.id]
                    ? "border-green-500 border-2"
                    : currentQuestionIndex === index
                    ? ""
                    : "hover:border-gray-400"
                }`}
              >
                {index + 1}
                {answers[q.id] && (
                  <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3 text-green-500 fill-white" />
                )}
              </Button>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {getAnsweredCount()} of {questions.length} questions answered
            </p>
            <Button
              onClick={handleSubmitTest}
              disabled={submitTest.isPending}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitTest.isPending ? "Submitting..." : "Submit Test"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PublicTestInterface;
