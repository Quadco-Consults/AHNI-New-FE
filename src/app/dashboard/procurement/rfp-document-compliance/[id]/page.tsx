"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Document {
  id: string;
  name: string;
  required: boolean;
  submitted: boolean;
  verified: boolean;
  fileUrl?: string;
  remarks?: string;
}

export default function RFPDocumentCompliancePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const submissionId = params?.id as string;
  const rfpId = searchParams?.get("rfp");

  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", name: "Company Registration Certificate (CAC)", required: true, submitted: true, verified: false },
    { id: "2", name: "Tax Clearance Certificate", required: true, submitted: true, verified: false },
    { id: "3", name: "Audited Financial Statements (Last 3 Years)", required: true, submitted: false, verified: false },
    { id: "4", name: "Bank Reference Letter", required: true, submitted: true, verified: false },
    { id: "5", name: "Company Profile", required: true, submitted: true, verified: false },
    { id: "6", name: "Past Project References (Minimum 3)", required: true, submitted: true, verified: false },
    { id: "7", name: "Technical Team CVs", required: true, submitted: false, verified: false },
    { id: "8", name: "Professional Certifications", required: true, submitted: true, verified: false },
    { id: "9", name: "Insurance Certificates", required: true, submitted: true, verified: false },
    { id: "10", name: "ISO Certification (if applicable)", required: false, submitted: false, verified: false },
  ]);

  const [overallStatus, setOverallStatus] = useState<"COMPLIANT" | "NON_COMPLIANT" | null>(null);
  const [comments, setComments] = useState("");

  const submittedCount = documents.filter((d) => d.submitted).length;
  const requiredCount = documents.filter((d) => d.required).length;
  const verifiedCount = documents.filter((d) => d.verified).length;
  const compliancePercentage = Math.round((submittedCount / requiredCount) * 100);

  const handleVerify = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, verified: !doc.verified } : doc))
    );
  };

  const handleSubmitCompliance = () => {
    if (!overallStatus) {
      alert("Please mark the overall compliance status");
      return;
    }
    // TODO: API call to submit compliance status
    console.log("Compliance Status:", { submissionId, rfpId, overallStatus, comments, documents });
    alert(`Compliance marked as: ${overallStatus}`);
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
            <h1 className="text-2xl font-bold">Document Compliance Check</h1>
            <p className="text-sm text-gray-500">
              Verify all required documents have been submitted
            </p>
          </div>
        </div>
        {overallStatus && (
          <Badge
            variant="outline"
            className={
              overallStatus === "COMPLIANT"
                ? "text-green-600 border-green-600"
                : "text-red-600 border-red-600"
            }
          >
            {overallStatus}
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
              <p>
                <strong>Submission ID:</strong> {submissionId}
              </p>
              <p>
                <strong>RFP ID:</strong> {rfpId || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance Summary */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="font-semibold text-lg mb-4">Compliance Summary</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{requiredCount}</div>
            <div className="text-sm text-gray-600">Required</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{submittedCount}</div>
            <div className="text-sm text-gray-600">Submitted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{verifiedCount}</div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                compliancePercentage >= 100 ? "text-green-600" : "text-orange-600"
              }`}
            >
              {compliancePercentage}%
            </div>
            <div className="text-sm text-gray-600">Compliance</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              compliancePercentage >= 100 ? "bg-green-600" : "bg-orange-600"
            }`}
            style={{ width: `${compliancePercentage}%` }}
          ></div>
        </div>
      </Card>

      {/* Document Checklist */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Icon icon="mdi:file-document-check" className="w-5 h-5" />
          Document Checklist
        </h3>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-4 rounded-lg border-2 ${
                doc.verified
                  ? "border-green-200 bg-green-50"
                  : doc.submitted
                  ? "border-blue-200 bg-blue-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={doc.verified}
                  onCheckedChange={() => handleVerify(doc.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{doc.name}</p>
                    {doc.required && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                        Required
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {doc.submitted ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Icon icon="mdi:check-circle" className="w-4 h-4" />
                        <span>Submitted</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <Icon icon="mdi:close-circle" className="w-4 h-4" />
                        <span>Not Submitted</span>
                      </div>
                    )}
                    {doc.verified && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Icon icon="mdi:shield-check" className="w-4 h-4" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  {doc.fileUrl && (
                    <Button variant="link" className="h-auto p-0 mt-2" size="sm">
                      <Icon icon="mdi:file-eye" className="w-4 h-4 mr-1" />
                      View Document
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Decision */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Icon icon="mdi:clipboard-check" className="w-5 h-5" />
          Compliance Decision
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">Overall Compliance Status:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOverallStatus("COMPLIANT")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  overallStatus === "COMPLIANT"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      overallStatus === "COMPLIANT" ? "bg-green-600" : "bg-green-100"
                    }`}
                  >
                    <Icon
                      icon="mdi:check-circle"
                      className={`w-6 h-6 ${
                        overallStatus === "COMPLIANT" ? "text-white" : "text-green-600"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-semibold ${
                      overallStatus === "COMPLIANT" ? "text-green-600" : "text-gray-700"
                    }`}
                  >
                    COMPLIANT
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    All required documents submitted & verified
                  </span>
                </div>
              </button>

              <button
                onClick={() => setOverallStatus("NON_COMPLIANT")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  overallStatus === "NON_COMPLIANT"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      overallStatus === "NON_COMPLIANT" ? "bg-red-600" : "bg-red-100"
                    }`}
                  >
                    <Icon
                      icon="mdi:close-circle"
                      className={`w-6 h-6 ${
                        overallStatus === "NON_COMPLIANT" ? "text-white" : "text-red-600"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-semibold ${
                      overallStatus === "NON_COMPLIANT" ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    NON-COMPLIANT
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    Missing required documents or issues found
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Comments & Remarks
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter detailed comments about document compliance, any missing documents, or issues found..."
              className="min-h-[120px]"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">Save as Draft</Button>
            <Button
              className="bg-primary"
              disabled={!overallStatus || !comments.trim()}
              onClick={handleSubmitCompliance}
            >
              <Icon icon="mdi:send" className="w-4 h-4 mr-2" />
              Submit Compliance Check
            </Button>
          </div>
        </div>
        {(!overallStatus || !comments.trim()) && (
          <p className="text-xs text-red-500 text-right mt-2">
            Please select compliance status and provide comments
          </p>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <Icon icon="mdi:alert-circle" className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>Check all documents against the RFP requirements</li>
              <li>Verify document authenticity and validity dates</li>
              <li>Non-compliant vendors will be automatically disqualified</li>
              <li>This is the first stage before technical evaluation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
