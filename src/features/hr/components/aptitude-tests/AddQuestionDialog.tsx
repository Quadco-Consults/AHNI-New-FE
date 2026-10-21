"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetTestQuestions,
  useCreateTestQuestion,
  useAddQuestionToTest,
} from "@/features/hr/controllers/aptitudeTestController";
import { CreateTestQuestionForm, TestQuestion } from "@/features/hr/types";
import { Plus, X } from "lucide-react";
import { Loading } from "@/components/Loading";

interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
}

const AddQuestionDialog = ({
  open,
  onOpenChange,
  testId,
}: AddQuestionDialogProps) => {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const { data: questionsData, isLoading } = useGetTestQuestions(open);
  const createQuestion = useCreateTestQuestion();
  const addToTest = useAddQuestionToTest(testId);

  const questions = questionsData?.data || [];

  const form = useForm<CreateTestQuestionForm>({
    defaultValues: {
      question_text: "",
      question_type: "MULTIPLE_CHOICE",
      category: "TECHNICAL",
      options: [],
      correct_answer: "",
      marks: 5,
    },
  });

  const questionType = form.watch("question_type");

  const onSubmitNewQuestion = async (data: CreateTestQuestionForm) => {
    // Clean up options based on question type
    let finalData = { ...data };

    if (data.question_type === "MULTIPLE_CHOICE") {
      finalData.options = options.filter((opt) => opt.trim() !== "");
    } else if (data.question_type === "TRUE_FALSE") {
      finalData.options = ["True", "False"];
    } else {
      delete finalData.options;
      delete finalData.correct_answer;
    }

    const response = await createQuestion.mutateAsync(finalData);

    // Add the newly created question to the test
    await addToTest.mutateAsync({
      question_id: response.data.id,
      order: 0,
    });

    onOpenChange(false);
    form.reset();
    setOptions(["", ""]);
  };

  const handleAddExistingQuestion = async (questionId: string) => {
    await addToTest.mutateAsync({
      question_id: questionId,
      order: 0,
    });
    onOpenChange(false);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Question to Test</DialogTitle>
          <DialogDescription>
            Choose an existing question from the question bank or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Questions</TabsTrigger>
            <TabsTrigger value="new">Create New Question</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            {isLoading ? (
              <Loading />
            ) : questions.length === 0 ? (
              <div className="border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No questions in question bank
                </p>
                <Button onClick={() => setActiveTab("new")}>
                  Create First Question
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question: TestQuestion) => (
                      <TableRow key={question.id}>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-2">{question.question_text}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {question.question_type.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{question.category.replace(/_/g, " ")}</Badge>
                        </TableCell>
                        <TableCell>{question.marks}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleAddExistingQuestion(question.id)}
                            disabled={addToTest.isPending}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <form
              onSubmit={form.handleSubmit(onSubmitNewQuestion)}
              className="space-y-4"
            >
              {/* Question Text */}
              <div className="space-y-2">
                <Label htmlFor="question_text">Question Text *</Label>
                <Textarea
                  id="question_text"
                  placeholder="Enter your question here..."
                  rows={3}
                  {...form.register("question_text", { required: true })}
                />
              </div>

              {/* Question Type and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Type *</Label>
                  <Select
                    value={form.watch("question_type")}
                    onValueChange={(value) =>
                      form.setValue("question_type", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MULTIPLE_CHOICE">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                      <SelectItem value="ESSAY">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={form.watch("category")}
                    onValueChange={(value) =>
                      form.setValue("category", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TECHNICAL">Technical</SelectItem>
                      <SelectItem value="ANALYTICAL">Analytical</SelectItem>
                      <SelectItem value="COMMUNICATION">Communication</SelectItem>
                      <SelectItem value="GENERAL_KNOWLEDGE">
                        General Knowledge
                      </SelectItem>
                      <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Options (for Multiple Choice) */}
              {questionType === "MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Answer Options *</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addOption}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeOption(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              {(questionType === "MULTIPLE_CHOICE" ||
                questionType === "TRUE_FALSE") && (
                <div className="space-y-2">
                  <Label>Correct Answer *</Label>
                  {questionType === "MULTIPLE_CHOICE" ? (
                    <Select
                      value={form.watch("correct_answer")}
                      onValueChange={(value) =>
                        form.setValue("correct_answer", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {options
                          .filter((opt) => opt.trim() !== "")
                          .map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={form.watch("correct_answer")}
                      onValueChange={(value) =>
                        form.setValue("correct_answer", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="True">True</SelectItem>
                        <SelectItem value="False">False</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {/* Marks */}
              <div className="space-y-2">
                <Label htmlFor="marks">Marks *</Label>
                <Input
                  id="marks"
                  type="number"
                  min="1"
                  {...form.register("marks", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    form.reset();
                    setOptions(["", ""]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createQuestion.isPending || addToTest.isPending}
                >
                  {createQuestion.isPending || addToTest.isPending
                    ? "Adding..."
                    : "Create & Add to Test"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
