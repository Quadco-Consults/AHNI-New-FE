"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, CheckCircle2, Clock, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useGetRFQClarifications, useCreateRFQClarification, useUpdateRFQClarification, useCloseClarification } from "@/features/procurement/controllers/rfqClarificationController";
import { useGetAllSolicitations } from "@/features/procurement/controllers/solicitationController";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function RFQClarifications() {
  const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "ANSWERED" | "CLOSED">("all");
  const [selectedClarification, setSelectedClarification] = useState<any>(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);

  const { user } = useAuth();
  const isVendor = user?.user_type === "VENDOR";

  // Fetch clarifications
  const { clarifications, isLoading } = useGetRFQClarifications({
    page: 1,
    size: 50,
    status: statusFilter === "all" ? undefined : statusFilter as any,
  });

  // Filter clarifications
  const filteredClarifications = clarifications?.results?.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500 text-white";
      case "ANSWERED": return "bg-green-500 text-white";
      case "CLOSED": return "bg-gray-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4" />;
      case "ANSWERED": return <CheckCircle2 className="h-4 w-4" />;
      case "CLOSED": return <XCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">RFQ Clarifications</h1>
            <p className="text-sm text-gray-600 mt-1">
              {isVendor
                ? "Ask questions about RFQs and view answers"
                : "Manage vendor questions and provide clarifications"
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AskQuestionDialog
              open={askQuestionOpen}
              onOpenChange={setAskQuestionOpen}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All Questions
          </Button>
          <Button
            variant={statusFilter === "PENDING" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("PENDING")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </Button>
          <Button
            variant={statusFilter === "ANSWERED" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("ANSWERED")}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Answered
          </Button>
          <Button
            variant={statusFilter === "CLOSED" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("CLOSED")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Closed
          </Button>
        </div>

        {/* Clarifications List */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading clarifications...
          </div>
        ) : !filteredClarifications || filteredClarifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No clarifications yet
              </h3>
              <p className="text-gray-500 mb-4">
                {isVendor
                  ? "Be the first to ask a question about an RFQ"
                  : "No vendor questions to answer at this time"
                }
              </p>
              {isVendor && (
                <Button onClick={() => setAskQuestionOpen(true)}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredClarifications.map((clarification) => (
              <Card key={clarification.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(clarification.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(clarification.status)}
                            {clarification.status}
                          </span>
                        </Badge>
                        {clarification.is_public && (
                          <Badge variant="outline" className="text-xs">
                            Public
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {clarification.solicitation_title}
                        </span>
                      </div>
                      <CardTitle className="text-lg">
                        Question from {clarification.asked_by_details?.first_name} {clarification.asked_by_details?.last_name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Asked on {new Date(clarification.created_datetime).toLocaleString()}
                      </CardDescription>
                    </div>
                    {!isVendor && clarification.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedClarification(clarification);
                          setAnswerDialogOpen(true);
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Answer
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Question */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Question:</p>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {clarification.question}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {clarification.answer && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">Answer:</p>
                            {clarification.answered_by_details && (
                              <span className="text-xs text-gray-600">
                                by {clarification.answered_by_details.first_name} {clarification.answered_by_details.last_name}
                              </span>
                            )}
                            {clarification.answered_at && (
                              <span className="text-xs text-gray-500">
                                on {new Date(clarification.answered_at).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {clarification.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {clarification.status === "PENDING" && !clarification.answer && (
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-yellow-800">
                        Waiting for response from procurement team
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Answer Dialog */}
      {selectedClarification && (
        <AnswerDialog
          open={answerDialogOpen}
          onOpenChange={setAnswerDialogOpen}
          clarification={selectedClarification}
          onSuccess={() => {
            setAnswerDialogOpen(false);
            setSelectedClarification(null);
          }}
        />
      )}
    </div>
  );
}

// Ask Question Dialog Component
function AskQuestionDialog({ open, onOpenChange }: any) {
  const [formData, setFormData] = useState({
    solicitation: "",
    question: "",
    is_public: true,
  });

  const { createClarification, isLoading } = useCreateRFQClarification();
  const { data: solicitations } = useGetAllSolicitations({ page: 1, size: 100 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.solicitation || !formData.question) {
      toast.error("Please select an RFQ and enter your question");
      return;
    }

    try {
      await createClarification(formData);
      toast.success("Question submitted successfully");
      onOpenChange(false);
      setFormData({
        solicitation: "",
        question: "",
        is_public: true,
      });
    } catch (error) {
      toast.error("Failed to submit question");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <HelpCircle className="h-4 w-4 mr-2" />
          Ask Question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
          <DialogDescription>
            Submit a clarification question about an RFQ. The procurement team will respond as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="solicitation">Select RFQ *</Label>
            <Select
              value={formData.solicitation}
              onValueChange={(value) => setFormData({ ...formData, solicitation: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an RFQ" />
              </SelectTrigger>
              <SelectContent>
                {solicitations?.results?.map((rfq: any) => (
                  <SelectItem key={rfq.id} value={rfq.id}>
                    {rfq.rfq_id} - {rfq.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Your Question *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter your question here..."
              rows={6}
            />
            <p className="text-xs text-gray-500">
              Be specific and clear in your question to get the best answer
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked as boolean })}
            />
            <Label htmlFor="is_public" className="text-sm font-normal cursor-pointer">
              Make this question public (all vendors can see the answer)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              Submit Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Answer Dialog Component
function AnswerDialog({ open, onOpenChange, clarification, onSuccess }: any) {
  const [answer, setAnswer] = useState("");
  const [isPublic, setIsPublic] = useState(clarification?.is_public || true);

  const { updateClarification, isLoading } = useUpdateRFQClarification(clarification?.id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    try {
      await updateClarification({
        answer,
        is_public: isPublic,
      });
      toast.success("Answer submitted successfully");
      setAnswer("");
      onSuccess();
    } catch (error) {
      toast.error("Failed to submit answer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Answer Clarification Question</DialogTitle>
          <DialogDescription>
            Provide a clear and detailed answer to the vendor's question
          </DialogDescription>
        </DialogHeader>

        {/* Show the question */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-gray-900 mb-2">Question:</p>
          <p className="text-gray-700 whitespace-pre-wrap">
            {clarification?.question}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Asked by {clarification?.asked_by_details?.first_name} {clarification?.asked_by_details?.last_name} on{" "}
            {new Date(clarification?.created_datetime).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="answer">Your Answer *</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              rows={6}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_public_answer"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
            />
            <Label htmlFor="is_public_answer" className="text-sm font-normal cursor-pointer">
              Make this answer public (all vendors can see it)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit Answer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
