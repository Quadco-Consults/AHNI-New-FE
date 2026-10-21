"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  useGetTestResult,
  useManualGradeTest,
} from "@/features/hr/controllers/aptitudeTestController";
import { Loading } from "@/components/Loading";
import { CheckCircle2, XCircle, AlertCircle, GraduationCap } from "lucide-react";

interface GradeTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: any;
}

const GradeTestDialog = ({
  open,
  onOpenChange,
  result,
}: GradeTestDialogProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [manualScores, setManualScores] = useState<Record<string, number>>({});

  const { data: detailedResult, isLoading } = useGetTestResult(result.id, open);
  const gradeTest = useManualGradeTest(result.id);

  const fullResult = detailedResult?.data || result;
  const questions = fullResult.test_questions || [];
  const answers = fullResult.answers || {};

  const form = useForm({
    defaultValues: {
      feedback: fullResult.feedback || "",
    },
  });

  useEffect(() => {
    // Initialize manual scores from existing grading
    if (fullResult.manual_scores) {
      setManualScores(fullResult.manual_scores);
    }
  }, [fullResult]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  const isAutoGraded = (questionType: string) => {
    return questionType === "MULTIPLE_CHOICE" || questionType === "TRUE_FALSE";
  };

  const needsManualGrading = (questionType: string) => {
    return questionType === "SHORT_ANSWER" || questionType === "ESSAY";
  };

  const getTotalManualScore = () => {
    return Object.values(manualScores).reduce((sum, score) => sum + score, 0);
  };

  const getTotalPossibleManualMarks = () => {
    return questions
      .filter((q: any) => needsManualGrading(q.question_type))
      .reduce((sum: number, q: any) => sum + q.marks, 0);
  };

  const handleScoreChange = (questionId: string, score: number, maxMarks: number) => {
    const validScore = Math.min(Math.max(0, score), maxMarks);
    setManualScores((prev) => ({
      ...prev,
      [questionId]: validScore,
    }));
  };

  const handleSubmitGrading = async (data: any) => {
    const gradingData = {
      manual_scores: manualScores,
      feedback: data.feedback,
    };

    await gradeTest.mutateAsync(gradingData);
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <Loading />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grade Test - {fullResult.applicant_name}</DialogTitle>
          <DialogDescription>
            Review answers and assign scores for essay and short answer questions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Summary */}
          <Card className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Auto-Graded</p>
                <p className="text-2xl font-bold">{fullResult.auto_graded_score || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Manual Score</p>
                <p className="text-2xl font-bold">
                  {getTotalManualScore()} / {getTotalPossibleManualMarks()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Score</p>
                <p className="text-2xl font-bold">
                  {(fullResult.auto_graded_score || 0) + getTotalManualScore()} /{" "}
                  {fullResult.total_marks}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                <p className="text-2xl font-bold">
                  {(
                    (((fullResult.auto_graded_score || 0) + getTotalManualScore()) /
                      fullResult.total_marks) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </Card>

          {/* Question Navigation */}
          <div className="flex gap-2 flex-wrap">
            {questions.map((q: any, index: number) => (
              <Button
                key={q.id}
                variant={currentQuestionIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="relative"
              >
                Q{index + 1}
                {isAutoGraded(q.question_type) ? (
                  <CheckCircle2 className="w-3 h-3 ml-1 text-green-500" />
                ) : manualScores[q.id] !== undefined ? (
                  <CheckCircle2 className="w-3 h-3 ml-1 text-blue-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 ml-1 text-orange-500" />
                )}
              </Button>
            ))}
          </div>

          <Separator />

          {/* Current Question */}
          {currentQuestion && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {currentQuestion.question_type.replace(/_/g, " ")}
                    </Badge>
                    <Badge variant="outline">
                      {currentQuestion.category.replace(/_/g, " ")}
                    </Badge>
                    <Badge variant="outline">{currentQuestion.marks} marks</Badge>
                  </div>
                </div>
                {isAutoGraded(currentQuestion.question_type) && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Auto-Graded
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Question:</h3>
                <p className="text-lg">{currentQuestion.question_text}</p>
              </div>

              {/* Show correct answer for MCQ/True-False */}
              {isAutoGraded(currentQuestion.question_type) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-1">
                    Correct Answer:
                  </p>
                  <p className="text-green-800">{currentQuestion.correct_answer}</p>
                </div>
              )}

              <Separator />

              {/* Candidate's Answer */}
              <div>
                <h3 className="font-semibold mb-2">Candidate&apos;s Answer:</h3>
                {currentAnswer ? (
                  <Card className="p-4">
                    <p className="whitespace-pre-wrap">{currentAnswer.answer}</p>
                  </Card>
                ) : (
                  <Card className="p-4">
                    <p className="text-muted-foreground italic">No answer provided</p>
                  </Card>
                )}
              </div>

              {/* Grading Result */}
              {isAutoGraded(currentQuestion.question_type) ? (
                <div className="flex items-center gap-3">
                  {currentAnswer?.is_correct ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-medium text-green-700">Correct Answer</p>
                        <p className="text-sm text-muted-foreground">
                          Score: {currentQuestion.marks} / {currentQuestion.marks}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="font-medium text-red-700">Incorrect Answer</p>
                        <p className="text-sm text-muted-foreground">
                          Score: 0 / {currentQuestion.marks}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor={`score-${currentQuestion.id}`}>
                    Assign Score (Max: {currentQuestion.marks} marks)
                  </Label>
                  <div className="flex gap-3 items-center">
                    <Input
                      id={`score-${currentQuestion.id}`}
                      type="number"
                      min="0"
                      max={currentQuestion.marks}
                      step="0.5"
                      value={manualScores[currentQuestion.id] || 0}
                      onChange={(e) =>
                        handleScoreChange(
                          currentQuestion.id,
                          parseFloat(e.target.value) || 0,
                          currentQuestion.marks
                        )
                      }
                      className="w-32"
                    />
                    <span className="text-muted-foreground">
                      / {currentQuestion.marks} marks
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                >
                  Previous Question
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(questions.length - 1, currentQuestionIndex + 1)
                    )
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next Question
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Overall Feedback */}
          <form onSubmit={form.handleSubmit(handleSubmitGrading)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Overall Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Provide general feedback on the candidate's performance..."
                rows={4}
                {...form.register("feedback")}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={gradeTest.isPending}>
                <GraduationCap className="w-4 h-4 mr-2" />
                {gradeTest.isPending ? "Submitting..." : "Submit Grading"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeTestDialog;
