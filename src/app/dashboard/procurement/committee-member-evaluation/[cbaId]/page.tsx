"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "@/components/Loading";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VendorSubmission {
  id: string;
  vendor: {
    id: string;
    company_name: string;
    type_of_business: string;
  };
  submitted_at: string;
  status: string;
}

interface EvaluationScore {
  technical_score: number;
  financial_score: number;
  commercial_score: number;
  documents_score: number;
  overall_recommendation: string;
  technical_comments: string;
  financial_comments: string;
  commercial_comments: string;
  documents_comments: string;
}

export default function CommitteeMemberEvaluationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const cbaId = params?.cbaId as string;
  const solicitationId = searchParams?.get("solicitation");

  const [vendors, setVendors] = useState<VendorSubmission[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [scores, setScores] = useState<EvaluationScore>({
    technical_score: 0,
    financial_score: 0,
    commercial_score: 0,
    documents_score: 0,
    overall_recommendation: "",
    technical_comments: "",
    financial_comments: "",
    commercial_comments: "",
    documents_comments: "",
  });

  useEffect(() => {
    fetchVendorSubmissions();
  }, [solicitationId]);

  useEffect(() => {
    if (selectedVendor) {
      fetchExistingEvaluation();
    }
  }, [selectedVendor]);

  const fetchVendorSubmissions = async () => {
    if (!solicitationId) return;

    setIsLoading(true);
    try {
      const response = await AxiosWithToken.get('/procurements/vendor-bid-submissions/', {
        params: {
          solicitation: solicitationId,
        }
      });

      const submissions = response.data?.data?.results || [];
      setVendors(submissions);

      if (submissions.length > 0) {
        setSelectedVendor(submissions[0]);
      }
    } catch (error: any) {
      console.error("Error fetching vendor submissions:", error);
      toast.error("Failed to load vendor submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExistingEvaluation = async () => {
    if (!selectedVendor || !session?.user?.id) return;

    try {
      const response = await AxiosWithToken.get('/procurements/committee-member-evaluations/', {
        params: {
          cba: cbaId,
          member: session.user.id,
          vendor_bid_submission: selectedVendor.id,
        }
      });

      const evaluations = response.data?.data?.results || [];
      if (evaluations.length > 0) {
        const evaluation = evaluations[0];
        setScores({
          technical_score: evaluation.technical_score || 0,
          financial_score: evaluation.financial_score || 0,
          commercial_score: evaluation.commercial_score || 0,
          documents_score: evaluation.evaluation_criteria_data?.documents_score || 0,
          overall_recommendation: evaluation.overall_recommendation || "",
          technical_comments: evaluation.evaluation_criteria_data?.technical_comments || "",
          financial_comments: evaluation.evaluation_criteria_data?.financial_comments || "",
          commercial_comments: evaluation.evaluation_criteria_data?.commercial_comments || "",
          documents_comments: evaluation.evaluation_criteria_data?.documents_comments || "",
        });
      } else {
        // Reset scores for new vendor
        setScores({
          technical_score: 0,
          financial_score: 0,
          commercial_score: 0,
          documents_score: 0,
          overall_recommendation: "",
          technical_comments: "",
          financial_comments: "",
          commercial_comments: "",
          documents_comments: "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching existing evaluation:", error);
    }
  };

  const handleScoreChange = (field: keyof EvaluationScore, value: any) => {
    setScores((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTotalScore = () => {
    return scores.technical_score + scores.financial_score + scores.commercial_score + scores.documents_score;
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedVendor || !session?.user?.id) return;

    // Validation
    if (scores.technical_score < 0 || scores.technical_score > 40) {
      toast.error("Technical score must be between 0 and 40");
      return;
    }
    if (scores.financial_score < 0 || scores.financial_score > 20) {
      toast.error("Financial score must be between 0 and 20");
      return;
    }
    if (scores.commercial_score < 0 || scores.commercial_score > 30) {
      toast.error("Commercial score must be between 0 and 30");
      return;
    }
    if (scores.documents_score < 0 || scores.documents_score > 10) {
      toast.error("Documents score must be between 0 and 10");
      return;
    }
    if (!scores.overall_recommendation.trim()) {
      toast.error("Please provide overall recommendation");
      return;
    }

    setIsSaving(true);
    try {
      // Check if evaluation exists
      const checkResponse = await AxiosWithToken.get('/procurements/committee-member-evaluations/', {
        params: {
          cba: cbaId,
          member: session.user.id,
          selected_bid_submission: selectedVendor.id,
        }
      });

      const existingEvaluations = checkResponse.data?.data?.results || [];

      const payload = {
        cba: cbaId,
        member: session.user.id,
        member_name: `${session.user.first_name} ${session.user.last_name}`,
        selected_bid_submission: selectedVendor.id,
        technical_score: scores.technical_score,
        financial_score: scores.financial_score,
        commercial_score: scores.commercial_score,
        overall_recommendation: scores.overall_recommendation,
        evaluation_criteria_data: {
          documents_score: scores.documents_score,
          technical_comments: scores.technical_comments,
          financial_comments: scores.financial_comments,
          commercial_comments: scores.commercial_comments,
          documents_comments: scores.documents_comments,
        },
        status: "SUBMITTED",
        submitted_at: new Date().toISOString(),
      };

      if (existingEvaluations.length > 0) {
        // Update existing
        await AxiosWithToken.patch(
          `/procurements/committee-member-evaluations/${existingEvaluations[0].id}/`,
          payload
        );
        toast.success("Evaluation updated successfully");
      } else {
        // Create new
        await AxiosWithToken.post('/procurements/committee-member-evaluations/', payload);
        toast.success("Evaluation submitted successfully");
      }

      // Move to next vendor if available
      const currentIndex = vendors.findIndex(v => v.id === selectedVendor.id);
      if (currentIndex < vendors.length - 1) {
        setSelectedVendor(vendors[currentIndex + 1]);
      }
    } catch (error: any) {
      console.error("Error submitting evaluation:", error);
      toast.error(error.response?.data?.message || "Failed to submit evaluation");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <Icon icon="mdi:clipboard-alert-outline" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Vendor Submissions</h3>
          <p className="text-sm text-gray-500">
            No vendors have submitted proposals for this RFP yet.
          </p>
        </Card>
      </div>
    );
  }

  const totalScore = getTotalScore();
  const scorePercentage = (totalScore / 100) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="sm">
            <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Committee Member Evaluation</h1>
            <p className="text-sm text-gray-600">Evaluate vendor proposals independently</p>
          </div>
        </div>
      </div>

      {/* Vendor Selection */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Vendor to Evaluate:</label>
            <Select
              value={selectedVendor?.id}
              onValueChange={(value) => {
                const vendor = vendors.find((v: any) => v.id === value);
                if (vendor) setSelectedVendor(vendor);
              }}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.vendor.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {vendors.findIndex(v => v.id === selectedVendor?.id) + 1} / {vendors.length}
          </Badge>
        </div>
      </Card>

      {/* Current Vendor Info */}
      {selectedVendor && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="font-medium">{selectedVendor.vendor.company_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Business Type</p>
              <p className="font-medium">{selectedVendor.vendor.type_of_business || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submission Date</p>
              <p className="font-medium">
                {new Date(selectedVendor.submitted_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Scoring Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Scoring */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Evaluation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:cog" className="w-5 h-5 text-blue-600" />
              Technical Evaluation (40 points)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Technical Score (0-40)</label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  value={scores.technical_score}
                  onChange={(e) => handleScoreChange("technical_score", parseInt(e.target.value) || 0)}
                  placeholder="Enter score"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Technical Comments</label>
                <Textarea
                  value={scores.technical_comments}
                  onChange={(e) => handleScoreChange("technical_comments", e.target.value)}
                  placeholder="Evaluation comments on technical capability, experience, team qualifications..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Financial Evaluation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:cash" className="w-5 h-5 text-green-600" />
              Financial Evaluation (20 points)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Financial Score (0-20)</label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={scores.financial_score}
                  onChange={(e) => handleScoreChange("financial_score", parseInt(e.target.value) || 0)}
                  placeholder="Enter score"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Financial Comments</label>
                <Textarea
                  value={scores.financial_comments}
                  onChange={(e) => handleScoreChange("financial_comments", e.target.value)}
                  placeholder="Evaluation comments on financial capacity, stability, bank references..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Commercial/Price Evaluation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:tag" className="w-5 h-5 text-purple-600" />
              Commercial/Price Evaluation (30 points)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Commercial Score (0-30)</label>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={scores.commercial_score}
                  onChange={(e) => handleScoreChange("commercial_score", parseInt(e.target.value) || 0)}
                  placeholder="Enter score"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Commercial Comments</label>
                <Textarea
                  value={scores.commercial_comments}
                  onChange={(e) => handleScoreChange("commercial_comments", e.target.value)}
                  placeholder="Evaluation comments on pricing, value for money, commercial terms..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Documents Evaluation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:file-document" className="w-5 h-5 text-orange-600" />
              Documents Compliance (10 points)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Documents Score (0-10)</label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={scores.documents_score}
                  onChange={(e) => handleScoreChange("documents_score", parseInt(e.target.value) || 0)}
                  placeholder="Enter score"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Documents Comments</label>
                <Textarea
                  value={scores.documents_comments}
                  onChange={(e) => handleScoreChange("documents_comments", e.target.value)}
                  placeholder="Evaluation comments on document completeness, validity, compliance..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Overall Recommendation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:clipboard-text" className="w-5 h-5" />
              Overall Recommendation *
            </h3>
            <Textarea
              value={scores.overall_recommendation}
              onChange={(e) => handleScoreChange("overall_recommendation", e.target.value)}
              placeholder="Provide your overall assessment and recommendation for this vendor..."
              rows={5}
              className="w-full"
            />
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Score Summary */}
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Score Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Technical</span>
                <span className="font-bold text-blue-600">{scores.technical_score}/40</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Financial</span>
                <span className="font-bold text-green-600">{scores.financial_score}/20</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Commercial</span>
                <span className="font-bold text-purple-600">{scores.commercial_score}/30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Documents</span>
                <span className="font-bold text-orange-600">{scores.documents_score}/10</span>
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Score</span>
                <span className="text-2xl font-bold text-primary">{totalScore}/100</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className={`h-3 rounded-full transition-all ${
                    scorePercentage >= 70 ? 'bg-green-600' : scorePercentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>
              <p className="text-xs text-center text-gray-600">
                {scorePercentage >= 70 ? "Excellent" : scorePercentage >= 50 ? "Acceptable" : "Below Threshold"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Button
                onClick={handleSubmitEvaluation}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save" className="w-4 h-4 mr-2" />
                    Submit Evaluation
                  </>
                )}
              </Button>

              <Button variant="outline" className="w-full">
                <Icon icon="mdi:content-save-outline" className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
            </div>
          </Card>

          {/* Guidelines */}
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Icon icon="mdi:lightbulb" className="w-5 h-5 text-yellow-600" />
              Evaluation Guidelines
            </h4>
            <ul className="text-xs space-y-2 text-gray-700">
              <li>• Evaluate objectively based on proposal content</li>
              <li>• Technical: Experience, team, methodology (0-40)</li>
              <li>• Financial: Capacity, stability, references (0-20)</li>
              <li>• Commercial: Price competitiveness, value (0-30)</li>
              <li>• Documents: Completeness, validity (0-10)</li>
              <li>• Minimum passing score: 70/100</li>
              <li>• Your scores remain confidential until consensus</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
