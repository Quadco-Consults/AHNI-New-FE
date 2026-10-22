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
import { useCreateTestQuestion } from "@/features/hr/controllers/aptitudeTestController";
import { CreateTestQuestionForm } from "@/features/hr/types";
import { Plus, X } from "lucide-react";

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateQuestionDialog = ({
  open,
  onOpenChange,
}: CreateQuestionDialogProps) => {
  const [options, setOptions] = useState<Array<{ key: string; text: string }>>([
    { key: "A", text: "" },
    { key: "B", text: "" },
  ]);

  const createQuestion = useCreateTestQuestion();

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

  const onSubmit = async (data: CreateTestQuestionForm) => {
    let finalData = { ...data };

    if (data.question_type === "MULTIPLE_CHOICE") {
      // Convert options to the format expected by backend
      finalData.options = options
        .filter((opt) => opt.text.trim() !== "")
        .map((opt) => ({ key: opt.key, text: opt.text })) as any;
    } else if (data.question_type === "TRUE_FALSE") {
      finalData.options = [
        { key: "A", text: "True" },
        { key: "B", text: "False" },
      ] as any;
    } else {
      delete finalData.options;
      delete finalData.correct_answer;
    }

    await createQuestion.mutateAsync(finalData);
    onOpenChange(false);
    form.reset();
    setOptions([
      { key: "A", text: "" },
      { key: "B", text: "" },
    ]);
  };

  const addOption = () => {
    const nextKey = String.fromCharCode(65 + options.length); // A, B, C, D...
    setOptions([...options, { key: nextKey, text: "" }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Add a new question to the question bank
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
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
                onValueChange={(value) => form.setValue("category", value as any)}
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
                  disabled={options.length >= 6}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="font-bold text-sm w-6">{option.key}.</span>
                    <Input
                      placeholder={`Option ${option.key}`}
                      value={option.text}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1"
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
          {(questionType === "MULTIPLE_CHOICE" || questionType === "TRUE_FALSE") && (
            <div className="space-y-2">
              <Label>Correct Answer *</Label>
              {questionType === "MULTIPLE_CHOICE" ? (
                <Select
                  value={form.watch("correct_answer")}
                  onValueChange={(value) => form.setValue("correct_answer", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {options
                      .filter((opt) => opt.text.trim() !== "")
                      .map((option) => (
                        <SelectItem key={option.key} value={option.text}>
                          {option.key}. {option.text}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={form.watch("correct_answer")}
                  onValueChange={(value) => form.setValue("correct_answer", value)}
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
                setOptions([
                  { key: "A", text: "" },
                  { key: "B", text: "" },
                ]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createQuestion.isPending}>
              {createQuestion.isPending ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionDialog;
