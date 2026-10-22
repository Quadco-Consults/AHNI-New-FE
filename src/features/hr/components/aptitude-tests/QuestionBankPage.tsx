"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Card from "@/components/Card";
import {
  useGetTestQuestions,
  useDeleteTestQuestion,
} from "@/features/hr/controllers/aptitudeTestController";
import { Loading } from "@/components/Loading";
import { Plus, Search, Edit, Trash2, Upload, BookOpen } from "lucide-react";
import { TestQuestion } from "@/features/hr/types";
import CreateQuestionDialog from "./CreateQuestionDialog";
import EditQuestionDialog from "./EditQuestionDialog";

const QuestionBankPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<TestQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: questionsData, isLoading } = useGetTestQuestions(true);
  const deleteQuestion = useDeleteTestQuestion();

  // List endpoints return paginated response directly
  const allQuestions = Array.isArray(questionsData?.results)
    ? questionsData.results
    : Array.isArray(questionsData?.data?.results)
    ? questionsData.data.results
    : Array.isArray(questionsData?.data)
    ? questionsData.data
    : [];

  // Filter questions
  const questions = allQuestions.filter((q: TestQuestion) => {
    const matchesSearch = q.question_text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || q.question_type === filterType;
    const matchesCategory = filterCategory === "all" || q.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleEdit = (question: TestQuestion) => {
    setSelectedQuestion(question);
    setShowEditDialog(true);
  };

  const handleDelete = async (questionId: string) => {
    if (confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      await deleteQuestion.mutateAsync(questionId);
    }
  };

  const getQuestionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      MULTIPLE_CHOICE: "bg-blue-100 text-blue-700",
      TRUE_FALSE: "bg-green-100 text-green-700",
      SHORT_ANSWER: "bg-yellow-100 text-yellow-700",
      ESSAY: "bg-purple-100 text-purple-700",
    };
    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-700"}>
        {type.replace(/_/g, " ")}
      </Badge>
    );
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground mt-1">
            Manage all test questions for aptitude tests
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Question
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Total Questions</span>
          </div>
          <p className="text-2xl font-semibold">{allQuestions.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-sm">Multiple Choice</span>
          </div>
          <p className="text-2xl font-semibold">
            {allQuestions.filter((q: TestQuestion) => q.question_type === "MULTIPLE_CHOICE").length}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-sm">True/False</span>
          </div>
          <p className="text-2xl font-semibold">
            {allQuestions.filter((q: TestQuestion) => q.question_type === "TRUE_FALSE").length}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-sm">Essay/Short Answer</span>
          </div>
          <p className="text-2xl font-semibold">
            {
              allQuestions.filter(
                (q: TestQuestion) =>
                  q.question_type === "ESSAY" || q.question_type === "SHORT_ANSWER"
              ).length
            }
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
              <SelectItem value="TRUE_FALSE">True/False</SelectItem>
              <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
              <SelectItem value="ESSAY">Essay</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="TECHNICAL">Technical</SelectItem>
              <SelectItem value="ANALYTICAL">Analytical</SelectItem>
              <SelectItem value="COMMUNICATION">Communication</SelectItem>
              <SelectItem value="GENERAL_KNOWLEDGE">General Knowledge</SelectItem>
              <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Questions Table */}
      <Card className="p-0">
        {isLoading ? (
          <div className="p-12">
            <Loading />
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {searchTerm || filterType !== "all" || filterCategory !== "all"
                ? "No questions found"
                : "No questions in question bank"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterType !== "all" || filterCategory !== "all"
                ? "Try adjusting your filters"
                : "Create your first question to get started"}
            </p>
            {!searchTerm && filterType === "all" && filterCategory === "all" && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Question
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question: TestQuestion) => (
                <TableRow key={question.id}>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 font-medium">{question.question_text}</p>
                    {question.question_type === "MULTIPLE_CHOICE" && question.options && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Array.isArray(question.options)
                          ? `${question.options.length} options`
                          : "Multiple choice"}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{getQuestionTypeBadge(question.question_type)}</TableCell>
                  <TableCell>{getCategoryBadge(question.category)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.marks} pts</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {question.created_datetime
                      ? new Date(question.created_datetime).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(question.id)}
                        disabled={deleteQuestion.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Dialogs */}
      <CreateQuestionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      {selectedQuestion && (
        <EditQuestionDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          question={selectedQuestion}
        />
      )}
    </div>
  );
};

export default QuestionBankPage;
