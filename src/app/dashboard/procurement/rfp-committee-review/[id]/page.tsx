"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function RFPCommitteeReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const submissionId = params?.id as string;
  const rfpId = searchParams?.get("rfp");

  const [decision, setDecision] = useState<"PASSED" | "FAILED" | null>(null);
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    // TODO: Implement API call to submit committee decision
    console.log("Committee Decision:", { submissionId, rfpId, decision, comments });
    alert(`Decision: ${decision}\nComments: ${comments}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AHNI Committee Review</h1>
            <p className="text-sm text-gray-500">
              Pass/Fail Decision for RFP Proposal
            </p>
          </div>
        </div>
        {decision && (
          <Badge
            variant="outline"
            className={decision === "PASSED" ? "text-green-600 border-green-600" : "text-red-600 border-red-600"}
          >
            {decision}
          </Badge>
        )}
      </div>

      {/* Submission Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Proposal Information</p>
            <div className="text-xs text-blue-700 mt-2 space-y-1">
              <p><strong>Submission ID:</strong> {submissionId}</p>
              <p><strong>RFP ID:</strong> {rfpId || "Not provided"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Vendor Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:domain" className="w-5 h-5" />
          Vendor Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="font-medium">Loading...</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type of Business</p>
            <p className="font-medium">Loading...</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Submission Date</p>
            <p className="font-medium">Loading...</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Years of Experience</p>
            <p className="font-medium">Loading...</p>
          </div>
        </div>
      </Card>

      {/* Evaluation Scores Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:chart-bar" className="w-5 h-5" />
          Evaluation Scores
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Technical</p>
            <p className="text-3xl font-bold text-blue-600">0/40</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700">Pending</Badge>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Financial</p>
            <p className="text-3xl font-bold text-green-600">0/20</p>
            <Badge className="mt-2 bg-green-100 text-green-700">Pending</Badge>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Commercial</p>
            <p className="text-3xl font-bold text-purple-600">0/30</p>
            <Badge className="mt-2 bg-purple-100 text-purple-700">Pending</Badge>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Documents</p>
            <p className="text-3xl font-bold text-orange-600">0/10</p>
            <Badge className="mt-2 bg-orange-100 text-orange-700">Pending</Badge>
          </div>
        </div>

        {/* Overall Score */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Overall Score:</span>
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">0/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full" style={{ width: "0%" }}></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <span>Minimum Passing: 70/100 (70%)</span>
            <span className="font-medium">Status: Below Threshold</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <Icon icon="mdi:alert-circle" className="inline w-4 h-4 mr-1" />
            Note: All evaluation stages must be completed before committee can vote
          </p>
        </div>
      </Card>

      {/* Committee Decision */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:gavel" className="w-5 h-5" />
          Committee Decision
        </h3>

        {/* Decision Buttons */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">Select Decision:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDecision("PASSED")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  decision === "PASSED"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    decision === "PASSED" ? "bg-green-600" : "bg-green-100"
                  }`}>
                    <Icon
                      icon="mdi:check-circle"
                      className={`w-6 h-6 ${decision === "PASSED" ? "text-white" : "text-green-600"}`}
                    />
                  </div>
                  <span className={`font-semibold ${decision === "PASSED" ? "text-green-600" : "text-gray-700"}`}>
                    PASS
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    Vendor meets all requirements and qualifications
                  </span>
                </div>
              </button>

              <button
                onClick={() => setDecision("FAILED")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  decision === "FAILED"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    decision === "FAILED" ? "bg-red-600" : "bg-red-100"
                  }`}>
                    <Icon
                      icon="mdi:close-circle"
                      className={`w-6 h-6 ${decision === "FAILED" ? "text-white" : "text-red-600"}`}
                    />
                  </div>
                  <span className={`font-semibold ${decision === "FAILED" ? "text-red-600" : "text-gray-700"}`}>
                    FAIL
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    Vendor does not meet requirements
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Committee Comments & Recommendations
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter detailed comments, observations, and recommendations from the committee review..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please provide detailed justification for your decision
            </p>
          </div>
        </div>
      </Card>

      {/* Committee Members */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:account-group" className="w-5 h-5" />
          Committee Members Voting
        </h3>
        <div className="space-y-3">
          {[
            { name: "Dr. Sarah Johnson", role: "Chairperson", vote: null, avatar: "SJ", color: "blue" },
            { name: "Mr. John Adeyemi", role: "Technical Expert", vote: null, avatar: "JA", color: "green" },
            { name: "Mrs. Grace Okonkwo", role: "Finance Representative", vote: null, avatar: "GO", color: "purple" },
            { name: "Engr. Michael Chen", role: "Operations Lead", vote: null, avatar: "MC", color: "orange" },
            { name: "Ms. Fatima Hassan", role: "Legal Advisor", vote: null, avatar: "FH", color: "pink" },
          ].map((member, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full bg-${member.color}-500 flex items-center justify-center text-white font-semibold`}>
                {member.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
              {member.vote === null ? (
                <Badge variant="outline" className="text-gray-500">Not Voted</Badge>
              ) : member.vote === "PASS" ? (
                <Badge className="bg-green-100 text-green-700">PASS</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700">FAIL</Badge>
              )}
            </div>
          ))}
        </div>

        {/* Voting Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-blue-900">Voting Progress</p>
              <p className="text-xs text-blue-700">0 of 5 members have voted</p>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-600">0</div>
                <div className="text-xs text-gray-600">Pass</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-600">0</div>
                <div className="text-xs text-gray-600">Fail</div>
              </div>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
          </div>
        </div>

        {/* Quorum & Consensus Rules */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs font-medium text-yellow-800 mb-1">Voting Rules:</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Minimum Quorum: 3 out of 5 members must vote</li>
            <li>• Decision: Simple majority (3 Pass votes to approve)</li>
            <li>• Chairperson has casting vote in case of tie</li>
          </ul>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button
              className="bg-primary"
              disabled={!decision || !comments.trim()}
              onClick={handleSubmit}
            >
              <Icon icon="mdi:send" className="w-4 h-4 mr-2" />
              Submit Decision
            </Button>
          </div>
        </div>
        {(!decision || !comments.trim()) && (
          <p className="text-xs text-red-500 text-right mt-2">
            Please select a decision and provide comments before submitting
          </p>
        )}
      </Card>

      {/* Decision History (if any) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:history" className="w-5 h-5" />
          Decision History
        </h3>
        <p className="text-sm text-gray-500 text-center py-4">
          No previous decisions recorded
        </p>
      </Card>
    </div>
  );
}
