"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AptitudeTest } from "@/features/hr/types";
import { Clock, Target, Award, Plus, Trash2, GripVertical } from "lucide-react";
import { useGetAptitudeTest } from "@/features/hr/controllers/aptitudeTestController";
import { Loading } from "@/components/Loading";
import AddQuestionDialog from "./AddQuestionDialog";
import { useRemoveQuestionFromTest } from "@/features/hr/controllers/aptitudeTestController";

interface ViewTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: AptitudeTest;
}

const ViewTestDialog = ({ open, onOpenChange, test }: ViewTestDialogProps) => {
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const { data: testData, isLoading } = useGetAptitudeTest(test.id, open);
  const removeQuestion = useRemoveQuestionFromTest(test.id);

  const fullTest = testData?.data || test;
  const questions = fullTest.question_assignments || [];

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return "Multiple Choice";
      case "TRUE_FALSE":
        return "True/False";
      case "SHORT_ANSWER":
        return "Short Answer";
      case "ESSAY":
        return "Essay";
      default:
        return type;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      TECHNICAL: "bg-blue-100 text-blue-700",
      ANALYTICAL: "bg-purple-100 text-purple-700",
      COMMUNICATION: "bg-green-100 text-green-700",
      GENERAL_KNOWLEDGE: "bg-yellow-100 text-yellow-700",
      BEHAVIORAL: "bg-pink-100 text-pink-700",
    };

    return (
      <Badge className={colors[category] || "bg-gray-100 text-gray-700"}>
        {category.replace(/_/g, " ")}
      </Badge>
    );
  };

  const handleRemoveQuestion = async (questionId: string) => {
    if (confirm("Are you sure you want to remove this question from the test?")) {
      await removeQuestion.mutateAsync(questionId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{fullTest.title}</DialogTitle>
          <DialogDescription>{fullTest.description}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Loading />
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">
                Questions ({questions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Test Details Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-2xl font-semibold">
                    {fullTest.duration_minutes}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      mins
                    </span>
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Passing Score</span>
                  </div>
                  <p className="text-2xl font-semibold">
                    {fullTest.passing_score}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      %
                    </span>
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Total Marks</span>
                  </div>
                  <p className="text-2xl font-semibold">{fullTest.total_marks}</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <span className="text-sm">Status</span>
                  </div>
                  <Badge
                    className={
                      fullTest.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {fullTest.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Question Summary */}
              <div>
                <h3 className="font-semibold mb-3">Question Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Questions:</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Multiple Choice:</span>
                    <span className="font-medium">
                      {
                        questions.filter(
                          (q: any) => q.question?.question_type === "MULTIPLE_CHOICE"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>True/False:</span>
                    <span className="font-medium">
                      {
                        questions.filter(
                          (q: any) => q.question?.question_type === "TRUE_FALSE"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Essay/Short Answer:</span>
                    <span className="font-medium">
                      {
                        questions.filter(
                          (q: any) =>
                            q.question?.question_type === "ESSAY" ||
                            q.question?.question_type === "SHORT_ANSWER"
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Manage questions for this test. Questions can be reordered and removed.
                </p>
                {fullTest.status === "DRAFT" && (
                  <Button onClick={() => setShowAddQuestion(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                )}
              </div>

              {questions.length === 0 ? (
                <div className="border rounded-lg p-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No questions added yet
                  </p>
                  {fullTest.status === "DRAFT" && (
                    <Button onClick={() => setShowAddQuestion(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Question
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Marks</TableHead>
                        {fullTest.status === "DRAFT" && (
                          <TableHead className="text-right">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((qa: any, index: number) => (
                        <TableRow key={qa.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {fullTest.status === "DRAFT" && (
                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                              )}
                              <span className="font-medium">{index + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="line-clamp-2">
                              {qa.question?.question_text}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getQuestionTypeLabel(qa.question?.question_type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getCategoryBadge(qa.question?.category)}
                          </TableCell>
                          <TableCell>{qa.question?.marks}</TableCell>
                          {fullTest.status === "DRAFT" && (
                            <TableCell>
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleRemoveQuestion(qa.question?.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

        {/* Add Question Dialog */}
        <AddQuestionDialog
          open={showAddQuestion}
          onOpenChange={setShowAddQuestion}
          testId={test.id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewTestDialog;
