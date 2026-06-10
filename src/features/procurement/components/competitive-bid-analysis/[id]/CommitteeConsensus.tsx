"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, CheckCircle2, Clock, TrendingUp, Award, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import * as CommitteeEvaluationController from "@/features/procurement/controllers/committeeEvaluationController";
import { ICommitteeMemberEvaluation, IVendorConsensusScore } from "@/features/procurement/types/cba";

interface CommitteeConsensusProps {
  cbaId: string;
  onProgressToReview?: () => void;
}

/**
 * Committee Consensus Display Page
 * Shows all member evaluations, calculates consensus, and allows progression to review stage
 */
export const CommitteeConsensus = ({ cbaId, onProgressToReview }: CommitteeConsensusProps) => {
  const router = useRouter();
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set());

  // Fetch all member evaluations
  const { data: memberEvaluations, isLoading: loadingEvaluations } =
    CommitteeEvaluationController.useGetAllMemberEvaluations(cbaId);

  // Fetch member participation status
  const { data: participation, isLoading: loadingParticipation } =
    CommitteeEvaluationController.useGetMemberParticipation(cbaId);

  // Calculate consensus
  const { calculateConsensus } = CommitteeEvaluationController.useCalculateConsensus(memberEvaluations);
  const consensus = useMemo(() => calculateConsensus(), [memberEvaluations]);

  // Generate consensus mutation
  const { mutateAsync: generateConsensus, isPending: generatingConsensus } =
    CommitteeEvaluationController.useGenerateConsensus(cbaId);

  const toggleVendor = (vendorId: string) => {
    setExpandedVendors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId);
      } else {
        newSet.add(vendorId);
      }
      return newSet;
    });
  };

  const handleMoveToReview = async () => {
    if (!consensus.consensus_reached) {
      toast.error("Consensus threshold not reached (60% required). Cannot proceed to review.");
      return;
    }

    try {
      await generateConsensus();
      toast.success("Committee consensus approved! Moving to review stage.");

      if (onProgressToReview) {
        onProgressToReview();
      } else {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/review-approval`);
      }
    } catch (error) {
      console.error("Failed to move to review:", error);
    }
  };

  if (loadingEvaluations || loadingParticipation) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading consensus data...</p>
        </div>
      </div>
    );
  }

  const submittedCount = participation?.submitted_members?.length || 0;
  const totalMembers = participation?.total_members || 0;
  const participationRate = totalMembers > 0 ? (submittedCount / totalMembers) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Committee Consensus</h2>
              <p className="text-sm text-slate-600">
                Aggregate analysis from {totalMembers} committee member{totalMembers !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {consensus.consensus_reached && (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Consensus Reached
            </Badge>
          )}
        </div>
      </div>

      {/* Member Participation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Member Participation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              {submittedCount} of {totalMembers} members submitted
            </span>
            <span className="text-sm font-bold text-blue-600">
              {participationRate.toFixed(0)}%
            </span>
          </div>
          <Progress value={participationRate} className="h-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {participation?.members?.map(member => (
              <div
                key={member.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  member.submitted
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-slate-50 border-slate-200"
                )}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-600">{member.designation}</p>
                </div>
                {member.submitted ? (
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Submitted
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consensus Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Award className="w-5 h-5 mr-2 text-amber-600" />
            Consensus Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Recommended Vendor</p>
              <p className="text-lg font-bold text-slate-900">
                {consensus.recommended_vendor?.name || "N/A"}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-slate-600 mb-1">Consensus Score</p>
              <p className="text-lg font-bold text-blue-700">
                {consensus.recommended_vendor?.consensus_score?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-xs text-slate-500 mt-1">60% Tech + 40% Commercial</p>
            </div>
            <div className={cn(
              "p-4 rounded-lg border",
              consensus.consensus_reached
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            )}>
              <p className="text-xs text-slate-600 mb-1">Agreement Rate</p>
              <p className={cn(
                "text-lg font-bold",
                consensus.consensus_reached ? "text-emerald-700" : "text-amber-700"
              )}>
                {consensus.agreement_percentage}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {consensus.consensus_reached ? "Threshold met (≥60%)" : "Below threshold (<60%)"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Scores Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Vendor Scores Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {consensus.vendor_scores
            .sort((a, b) => b.consensus_score - a.consensus_score)
            .map((vendor, index) => {
              const isRecommended = vendor.id === consensus.recommended_vendor?.id;
              const isExpanded = expandedVendors.has(vendor.id);

              return (
                <Collapsible key={vendor.id} open={isExpanded}>
                  <div
                    className={cn(
                      "border rounded-lg overflow-hidden",
                      isRecommended ? "border-emerald-400 bg-emerald-50" : "border-slate-200"
                    )}
                  >
                    <CollapsibleTrigger
                      onClick={() => toggleVendor(vendor.id)}
                      className="w-full p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          )}
                          <div className="text-left">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono">
                                #{index + 1}
                              </Badge>
                              <span className="font-semibold text-slate-900">{vendor.name}</span>
                              {isRecommended && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                                  <Award className="w-3 h-3 mr-1" />
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-xs text-slate-600">Consensus Score</p>
                            <p className="text-lg font-bold text-blue-700">
                              {vendor.consensus_score.toFixed(1)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-600">Avg Technical</p>
                            <p className="text-sm font-semibold text-slate-700">
                              {vendor.avg_technical_score.toFixed(1)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-600">Avg Commercial</p>
                            <p className="text-sm font-semibold text-slate-700">
                              {vendor.avg_commercial_score?.toFixed(1) || vendor.avg_price_score?.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t border-slate-200 bg-white p-4">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">
                          Individual Member Scores
                        </h4>
                        <div className="space-y-2">
                          {vendor.member_scores?.map(score => (
                            <div
                              key={score.member_id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-900">{score.member_name}</p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-xs text-slate-600">Technical</p>
                                  <p className="text-sm font-semibold text-blue-600">
                                    {score.technical.toFixed(1)}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-slate-600">Commercial</p>
                                  <p className="text-sm font-semibold text-emerald-600">
                                    {score.price.toFixed(1)}%
                                  </p>
                                </div>
                                {score.recommended && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div>
          <p className="text-sm text-slate-600">
            {consensus.consensus_reached
              ? "Consensus reached. Ready to proceed to review stage."
              : "Consensus threshold not met. Cannot proceed until ≥60% agreement is reached."}
          </p>
        </div>
        <Button
          onClick={handleMoveToReview}
          disabled={!consensus.consensus_reached || generatingConsensus}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {generatingConsensus ? "Processing..." : "Move to Review Stage"}
        </Button>
      </div>
    </div>
  );
};
