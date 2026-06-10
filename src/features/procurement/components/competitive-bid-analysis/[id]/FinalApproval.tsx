"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, FileText, Award, MessageSquare, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetCbaQuery } from "@/features/procurement/controllers/cbaController";
import * as CommitteeEvaluationController from "@/features/procurement/controllers/committeeEvaluationController";

interface FinalApprovalProps {
  cbaId: string;
  onApproved?: () => void;
  onRejected?: () => void;
}

/**
 * Final Approval Page
 * Final stage of approval - marks CBA as completed
 */
export const FinalApproval = ({ cbaId, onApproved, onRejected }: FinalApprovalProps) => {
  const router = useRouter();
  const [remarks, setRemarks] = useState("");
  const [rejectComments, setRejectComments] = useState("");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Fetch CBA data
  const { data: cbaData, isLoading: loadingCba } = useGetCbaQuery(cbaId);

  // Fetch consensus data
  const { data: memberEvaluations, isLoading: loadingEvaluations } =
    CommitteeEvaluationController.useGetAllMemberEvaluations(cbaId);

  const { calculateConsensus } = CommitteeEvaluationController.useCalculateConsensus(memberEvaluations);
  const consensus = calculateConsensus();

  // Final approval mutation
  const { approveCba, isLoading: approvingFinal } = CbaAPI.useApproveCba(cbaId);

  // Final rejection mutation
  const { approveRejectCba, isLoading: rejectingFinal } = CbaAPI.useApproveRejectCba(cbaId);

  const handleApprove = async () => {
    if (!remarks.trim()) {
      toast.error("Please provide remarks for final approval");
      return;
    }

    try {
      await approveCba({
        status: 'APPROVED',
        remarks
      });
      toast.success("CBA approved! Procurement process completed successfully.");

      if (onApproved) {
        onApproved();
      } else {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/details`);
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      toast.error("Failed to approve. Please try again.");
    } finally {
      setShowApproveDialog(false);
    }
  };

  const handleReject = async () => {
    if (!rejectComments.trim()) {
      toast.error("Please provide comments for rejection");
      return;
    }

    try {
      await approveRejectCba({ comments: rejectComments });
      toast.success("CBA rejected at final approval stage. Sent back to committee.");

      if (onRejected) {
        onRejected();
      } else {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/details`);
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      toast.error("Failed to reject. Please try again.");
    } finally {
      setShowRejectDialog(false);
    }
  };

  if (loadingCba || loadingEvaluations) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading approval data...</p>
        </div>
      </div>
    );
  }

  const cba = cbaData?.data;
  const recommendedVendor = consensus.recommended_vendor;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Final Approval</h2>
              <p className="text-sm text-slate-600">
                Final review and approval for {cba?.cba_reference || cbaId}
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
            Final Stage
          </Badge>
        </div>
      </div>

      {/* CBA Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            CBA Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-slate-600">CBA Reference</Label>
              <p className="text-sm font-semibold text-slate-900">{cba?.cba_reference || "N/A"}</p>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Solicitation</Label>
              <p className="text-sm font-semibold text-slate-900">{cba?.solicitation?.title || "N/A"}</p>
            </div>
            <div>
              <Label className="text-xs text-slate-600">CBA Type</Label>
              <p className="text-sm font-semibold text-slate-900">{cba?.cba_type || "N/A"}</p>
            </div>
            <div>
              <Label className="text-xs text-slate-600">CBA Date</Label>
              <p className="text-sm font-semibold text-slate-900">
                {cba?.cba_date ? new Date(cba.cba_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consensus Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Award className="w-5 h-5 mr-2 text-amber-600" />
            Committee Consensus Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <p className="text-xs text-slate-600 mb-1">Recommended Vendor</p>
              <p className="text-lg font-bold text-emerald-800">
                {recommendedVendor?.name || "N/A"}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-slate-600 mb-1">Consensus Score</p>
              <p className="text-lg font-bold text-blue-700">
                {recommendedVendor?.consensus_score?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-xs text-slate-500 mt-1">60% Tech + 40% Commercial</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Agreement Rate</p>
              <p className="text-lg font-bold text-slate-700">
                {consensus.agreement_percentage}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Committee agreement</p>
            </div>
          </div>

          {/* Vendor Scores Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Vendor Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                    Technical Score
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                    Commercial Score
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                    Consensus Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {consensus.vendor_scores
                  .sort((a, b) => b.consensus_score - a.consensus_score)
                  .map((vendor, index) => {
                    const isRecommended = vendor.id === recommendedVendor?.id;
                    return (
                      <tr
                        key={vendor.id}
                        className={cn(
                          isRecommended && "bg-emerald-50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="font-mono">
                            #{index + 1}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-slate-900">{vendor.name}</span>
                            {isRecommended && (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                                <Award className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {vendor.avg_technical_score.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-emerald-600">
                            {(vendor.avg_commercial_score || vendor.avg_price_score).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-slate-900">
                            {vendor.consensus_score.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="w-5 h-5 mr-2 text-emerald-600" />
            Final Approval Decision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="remarks">Approval Remarks *</Label>
            <Textarea
              id="remarks"
              placeholder="Provide final approval remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              These remarks will be recorded as the official final approval decision
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="lg"
              disabled={rejectingFinal}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject & Send Back
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Final Approval?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reject the CBA and send it back to the committee for revision. Please provide rejection comments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="rejectComments">Rejection Comments *</Label>
              <Textarea
                id="rejectComments"
                placeholder="Explain why you're rejecting this CBA..."
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                disabled={!rejectComments.trim() || rejectingFinal}
                className="bg-red-600 hover:bg-red-700"
              >
                {rejectingFinal ? "Rejecting..." : "Confirm Rejection"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogTrigger asChild>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!remarks.trim() || approvingFinal}
            >
              <PartyPopper className="w-4 h-4 mr-2" />
              Final Approval - Complete CBA
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete CBA with Final Approval?</AlertDialogTitle>
              <AlertDialogDescription>
                This is the final step. Approving will mark the CBA as completed and close the procurement process.
                The recommended vendor is <strong>{recommendedVendor?.name}</strong> with a consensus score of{" "}
                <strong>{recommendedVendor?.consensus_score?.toFixed(1)}%</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApprove}
                disabled={!remarks.trim() || approvingFinal}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {approvingFinal ? "Approving..." : "Confirm Final Approval"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
