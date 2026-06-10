"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, CheckCircle2, XCircle, FileText, Award, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

interface ReviewApprovalProps {
  cbaId: string;
  onApproved?: () => void;
  onRejected?: () => void;
}

/**
 * Review Approval Page
 * First level of approval after committee consensus
 */
export const ReviewApproval = ({ cbaId, onApproved, onRejected }: ReviewApprovalProps) => {
  const router = useRouter();
  const [signature, setSignature] = useState("");
  const [comments, setComments] = useState("");
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

  // Review approval mutation
  const { reviewCba, isLoading: approvingReview } = CbaAPI.useReviewCba(cbaId);

  // Review rejection mutation
  const { reviewRejectCba, isLoading: rejectingReview } = CbaAPI.useReviewRejectCba(cbaId);

  const handleApprove = async () => {
    if (!signature.trim()) {
      toast.error("Please provide your signature to approve");
      return;
    }

    try {
      await reviewCba({ signature, comments });
      toast.success("CBA approved at review stage! Moving to authorise stage.");

      if (onApproved) {
        onApproved();
      } else {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/authorise-approval`);
      }
    } catch (error) {
      console.error("Failed to approve review:", error);
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
      await reviewRejectCba({ comments: rejectComments });
      toast.success("CBA rejected at review stage. Sent back to committee.");

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
          <p className="text-slate-600">Loading review data...</p>
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
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Review Approval</h2>
              <p className="text-sm text-slate-600">
                Review and approve committee consensus for {cba?.cba_reference || cbaId}
              </p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Review Stage
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

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Review Decision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="signature">Your Signature *</Label>
            <Input
              id="signature"
              placeholder="Type your name to sign"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any comments or notes..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="mt-1"
            />
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
              disabled={rejectingReview}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject & Send Back
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject CBA Review?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reject the CBA and send it back to the committee. Please provide rejection comments.
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
                disabled={!rejectComments.trim() || rejectingReview}
                className="bg-red-600 hover:bg-red-700"
              >
                {rejectingReview ? "Rejecting..." : "Confirm Rejection"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogTrigger asChild>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!signature.trim() || approvingReview}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve & Move to Authorise
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve CBA Review?</AlertDialogTitle>
              <AlertDialogDescription>
                This will approve the committee consensus and move the CBA to the authorise stage.
                The recommended vendor is <strong>{recommendedVendor?.name}</strong> with a consensus score of{" "}
                <strong>{recommendedVendor?.consensus_score?.toFixed(1)}%</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApprove}
                disabled={!signature.trim() || approvingReview}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {approvingReview ? "Approving..." : "Confirm Approval"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
