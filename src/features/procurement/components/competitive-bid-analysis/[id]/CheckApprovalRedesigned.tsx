"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Shield,
  FileText,
  TrendingUp,
  Award,
  Calendar,
  Building2,
  DollarSign
} from "lucide-react";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetAllMemberEvaluations, useCalculateConsensus } from "@/features/procurement/controllers/committeeEvaluationController";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import GoBack from "@/components/GoBack";
import { CBALoadingState } from "@/features/procurement/components/competitive-bid-analysis/LoadingStates";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";

/**
 * Check Approval - Redesigned
 * Clean, professional approval workflow for CBA
 */
const CheckApprovalRedesigned = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const solicitationId = searchParams?.get("id");
  const cbaId = searchParams?.get("cba");

  const [approvalNotes, setApprovalNotes] = useState("");
  const [approvalDecision, setApprovalDecision] = useState<"APPROVED" | "REJECTED" | null>(null);

  // API calls
  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(cbaId || "", !!cbaId);
  const { data: submissionData, isLoading: submissionLoading } = useGetSolicitationSubmission(
    solicitationId || "",
    !!solicitationId
  );

  const isCommitteeCBA = cbaData?.data?.cba_type === 'COMMITTEE';
  const { data: memberEvaluations, isLoading: evaluationsLoading } = useGetAllMemberEvaluations(
    cbaId as string,
    isCommitteeCBA && !!cbaId
  );
  const { calculateConsensus } = useCalculateConsensus(memberEvaluations || []);

  const { modifyCba, isLoading: submittingApproval } = CbaAPI.useModifyCba(cbaId as string);

  // Calculate consensus for committee CBAs
  const consensusResults = useMemo(() => {
    if (!isCommitteeCBA || !memberEvaluations || memberEvaluations.length === 0) return null;
    return calculateConsensus();
  }, [isCommitteeCBA, memberEvaluations, calculateConsensus]);

  // Handle missing parameters
  if (!solicitationId || !cbaId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Missing Required Information</h2>
          <p className="text-slate-600 mb-4">
            {!solicitationId && !cbaId && "Both Solicitation ID and CBA ID are missing."}
            {!solicitationId && cbaId && "Solicitation ID is missing."}
            {solicitationId && !cbaId && "CBA ID is missing."}
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Please navigate to this page from the CBA details page.
          </p>
          <Button onClick={() => router.push('/dashboard/procurement/competitive-bid-analysis')}>
            Back to CBA List
          </Button>
        </div>
      </div>
    );
  }

  // Get vendor submissions
  const vendors = submissionData?.data?.data?.results ||
                  submissionData?.data?.results ||
                  submissionData?.results ||
                  [];

  // Get selected vendor from CBA data
  const selectedVendor = vendors.find((v: any) => v.id === cbaData?.data?.selected_bid_submission);

  // Handle approval submission
  const handleApprovalSubmission = async (decision: "APPROVED" | "REJECTED") => {
    if (!approvalNotes.trim()) {
      toast.error("Please provide approval notes before submitting");
      return;
    }

    try {
      const payload = {
        status: decision,
        approval_notes: approvalNotes,
        approved_by: "Current User", // Should come from auth context
        approval_date: new Date().toISOString()
      };

      await modifyCba(payload);

      toast.success(`CBA ${decision.toLowerCase()} successfully!`);

      setTimeout(() => {
        router.push('/dashboard/procurement/competitive-bid-analysis');
      }, 1500);
    } catch (error) {
      console.error("Approval submission error:", error);
      toast.error("Failed to submit approval. Please try again.");
    }
  };

  if (cbaLoading || submissionLoading || evaluationsLoading) {
    return <CBALoadingState message="Loading approval details..." />;
  }

  return (
    <CBAErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <GoBack />
                <div className="h-8 w-px bg-slate-300" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">CBA Approval Workflow</h1>
                  <p className="text-sm text-slate-600">Review and approve competitive bid analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-4 py-2 bg-slate-50 text-slate-700 border-slate-300">
                  <FileText className="w-4 h-4 mr-2" />
                  {cbaData?.data?.cba_reference || 'N/A'}
                </Badge>
                {isCommitteeCBA && (
                  <Badge variant="outline" className="px-4 py-2 bg-purple-50 text-purple-700 border-purple-300">
                    <Users className="w-4 h-4 mr-2" />
                    Committee CBA
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Analysis Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Analysis Summary</h3>
                  <p className="text-sm text-slate-600">Review of bid evaluation and recommendations</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* RFQ Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">RFQ Details</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-600">RFQ ID:</span>
                      <span className="ml-2 font-medium text-blue-900">
                        {cbaData?.data?.solicitation?.rfq_id || solicitationId || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">CBA Type:</span>
                      <span className="ml-2 font-medium text-blue-900">
                        {cbaData?.data?.cba_type || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">CBA Date:</span>
                      <span className="ml-2 font-medium text-blue-900">
                        {cbaData?.data?.cba_date ? new Date(cbaData.data.cba_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vendor Information */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-emerald-900">Selected Vendor</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-emerald-600">Vendor:</span>
                      <span className="ml-2 font-medium text-emerald-900">
                        {selectedVendor?.vendor?.company_name || 'Not Selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-600">Total Items:</span>
                      <span className="ml-2 font-medium text-emerald-900">
                        {cbaData?.data?.selected_items?.length || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-600">Total Amount:</span>
                      <span className="ml-2 font-medium text-emerald-900">
                        ₦{(cbaData?.data?.selected_total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-900">Current Status</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-amber-600">Status:</span>
                      <Badge variant="outline" className="ml-2">
                        {cbaData?.data?.status || 'PENDING'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-amber-600">Vendors Evaluated:</span>
                      <span className="ml-2 font-medium text-amber-900">
                        {vendors.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-amber-600">Created By:</span>
                      <span className="ml-2 font-medium text-amber-900">
                        {cbaData?.data?.created_by || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Committee Consensus (for Committee CBAs) */}
          {isCommitteeCBA && consensusResults && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-purple-50 border-b border-purple-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Committee Consensus</h3>
                      <p className="text-sm text-slate-600">Aggregated evaluation from committee members</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 px-4 py-2">
                    {memberEvaluations?.length || 0} Members
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                {consensusResults.recommendedVendor ? (
                  <div className="space-y-4">
                    {/* Recommended Vendor */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-600 mb-1">Recommended Vendor</p>
                          <p className="text-lg font-bold text-emerald-900">
                            {consensusResults.recommendedVendor}
                          </p>
                        </div>
                        <Award className="w-8 h-8 text-emerald-600 opacity-50" />
                      </div>
                    </div>

                    {/* Consensus Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                          Average Technical Score
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {consensusResults.averageTechnicalScore?.toFixed(1) || 'N/A'}%
                        </p>
                      </div>
                      <div className="border border-slate-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                          Average Commercial Score
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          {consensusResults.averageCommercialScore?.toFixed(1) || 'N/A'}%
                        </p>
                      </div>
                    </div>

                    {/* Committee Members */}
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm font-medium text-slate-700 mb-3">Committee Members</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {memberEvaluations?.map((member: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Member {index + 1} - Submitted</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No consensus data available yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {cbaData?.data?.recommendation_note && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Award Recommendation</h3>
                    <p className="text-sm text-slate-600">Analysis team recommendation</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {cbaData.data.recommendation_note}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Approval Decision */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Approval Decision</h3>
                  <p className="text-sm text-slate-600">Provide your approval decision and notes</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Approval Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Approval Notes <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Enter your approval notes, comments, or conditions here...

Include:
• Basis for approval/rejection decision
• Any conditions or requirements
• Observations or recommendations
• Next steps or actions required"
                  className="w-full min-h-[200px] text-sm resize-none font-mono"
                  rows={8}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Provide detailed notes explaining your approval decision
                </p>
              </div>

              {/* Decision Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Ready to make a decision?</p>
                  <p className="text-xs text-slate-600">
                    Please review all information carefully before approving or rejecting
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => handleApprovalSubmission("REJECTED")}
                    disabled={submittingApproval || !approvalNotes.trim()}
                    variant="outline"
                    size="lg"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject CBA
                  </Button>
                  <Button
                    onClick={() => handleApprovalSubmission("APPROVED")}
                    disabled={submittingApproval || !approvalNotes.trim()}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {submittingApproval ? "Submitting..." : "Approve CBA"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CBAErrorBoundary>
  );
};

export default CheckApprovalRedesigned;
