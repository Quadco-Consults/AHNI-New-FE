"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ApprovalStage {
  id: string;
  name: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN_REVIEW";
  approver?: string;
  comments?: string;
  date?: string;
  icon: string;
  color: string;
}

interface ApprovalWorkflowContentProps {
  solicitationId: string;
}

export default function ApprovalWorkflowContent({ solicitationId }: ApprovalWorkflowContentProps) {
  const [approvalStages, setApprovalStages] = useState<ApprovalStage[]>([
    {
      id: "1",
      name: "Document Compliance Check",
      role: "Procurement Officer",
      status: "PENDING",
      icon: "mdi:file-document-check",
      color: "blue",
    },
    {
      id: "2",
      name: "Technical & Financial Evaluation",
      role: "Evaluation Committee",
      status: "PENDING",
      icon: "mdi:clipboard-check",
      color: "purple",
    },
    {
      id: "3",
      name: "Committee Review & Consensus",
      role: "Procurement Committee",
      status: "PENDING",
      icon: "mdi:account-group",
      color: "green",
    },
    {
      id: "4",
      name: "Check Approval",
      role: "Procurement Manager",
      status: "PENDING",
      icon: "mdi:check-circle",
      color: "orange",
    },
    {
      id: "5",
      name: "Review Approval",
      role: "Department Head",
      status: "PENDING",
      icon: "mdi:eye-check",
      color: "cyan",
    },
    {
      id: "6",
      name: "Authorize Approval",
      role: "CFO / Finance Director",
      status: "PENDING",
      icon: "mdi:shield-check",
      color: "indigo",
    },
    {
      id: "7",
      name: "Final Approval",
      role: "Executive Director / CEO",
      status: "PENDING",
      icon: "mdi:gavel",
      color: "red",
    },
  ]);

  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [comments, setComments] = useState("");

  const getStatusColor = (status: ApprovalStage["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleApprove = (stageId: string) => {
    setApprovalStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, status: "APPROVED", comments, date: new Date().toISOString() }
          : stage
      )
    );
    setComments("");
    setActiveStage(null);
  };

  const handleReject = (stageId: string) => {
    setApprovalStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, status: "REJECTED", comments, date: new Date().toISOString() }
          : stage
      )
    );
    setComments("");
    setActiveStage(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Approval Workflow</h2>
        <p className="text-gray-600">
          Track the complete approval process from evaluation to final contract award
        </p>
      </div>

      {/* Workflow Progress Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">Workflow Progress</h3>
            <p className="text-sm text-gray-600">
              {approvalStages.filter((s) => s.status === "APPROVED").length} of {approvalStages.length} stages completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((approvalStages.filter((s) => s.status === "APPROVED").length / approvalStages.length) * 100)}%
            </div>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${(approvalStages.filter((s) => s.status === "APPROVED").length / approvalStages.length) * 100}%`,
            }}
          ></div>
        </div>
      </Card>

      {/* Approval Stages */}
      <div className="space-y-4">
        {approvalStages.map((stage, index) => (
          <Card
            key={stage.id}
            className={`p-6 border-l-4 ${
              stage.status === "APPROVED"
                ? "border-l-green-500 bg-green-50"
                : stage.status === "REJECTED"
                ? "border-l-red-500 bg-red-50"
                : stage.status === "IN_REVIEW"
                ? "border-l-blue-500 bg-blue-50"
                : "border-l-gray-300"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Stage Number & Icon */}
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stage.status === "APPROVED"
                      ? "bg-green-500"
                      : stage.status === "REJECTED"
                      ? "bg-red-500"
                      : stage.status === "IN_REVIEW"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  <Icon icon={stage.icon} className="w-6 h-6 text-white" />
                </div>
                {index < approvalStages.length - 1 && (
                  <div
                    className={`w-0.5 h-16 mx-auto mt-2 ${
                      stage.status === "APPROVED" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{stage.name}</h3>
                    <p className="text-sm text-gray-600">{stage.role}</p>
                  </div>
                  <Badge className={getStatusColor(stage.status)}>{stage.status}</Badge>
                </div>

                {stage.comments && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm text-gray-600">{stage.comments}</p>
                    {stage.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(stage.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {stage.status === "PENDING" && activeStage !== stage.id && (
                  <Button
                    onClick={() => setActiveStage(stage.id)}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    <Icon icon="mdi:pencil" className="w-4 h-4 mr-2" />
                    Review & Decide
                  </Button>
                )}

                {/* Decision Form */}
                {activeStage === stage.id && (
                  <div className="mt-4 p-4 bg-white rounded border space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comments/Remarks</label>
                      <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Enter your comments or reasons for approval/rejection..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(stage.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={!comments.trim()}
                      >
                        <Icon icon="mdi:check-circle" className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(stage.id)}
                        variant="destructive"
                        className="flex-1"
                        disabled={!comments.trim()}
                      >
                        <Icon icon="mdi:close-circle" className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button onClick={() => setActiveStage(null)} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold mb-4">Workflow Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">
              {approvalStages.filter((s) => s.status === "PENDING").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {approvalStages.filter((s) => s.status === "IN_REVIEW").length}
            </div>
            <div className="text-sm text-gray-600">In Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {approvalStages.filter((s) => s.status === "APPROVED").length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {approvalStages.filter((s) => s.status === "REJECTED").length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Icon icon="mdi:information" className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Each stage must be approved before proceeding to the next</li>
              <li>Rejection at any stage will halt the workflow</li>
              <li>All approvers must provide comments for their decisions</li>
              <li>The workflow tracks complete audit trail for compliance</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
