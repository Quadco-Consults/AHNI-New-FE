"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Progress } from "components/ui/progress";
import { Loading } from "components/Loading";
import {
  useGetAllMemberEvaluations,
  useGetConsensusAnalysis,
  useGenerateConsensus
} from "@/features/procurement/controllers/committeeEvaluationController";
import { IVendorConsensusScore } from "@/features/procurement/types/cba";

interface ConsensusAnalysisProps {
  cbaId: string;
}

const ConsensusAnalysis = ({ cbaId }: ConsensusAnalysisProps) => {
  const { data: memberEvaluations, isLoading: evaluationsLoading } = useGetAllMemberEvaluations(cbaId);
  const { data: consensusData, isLoading: consensusLoading } = useGetConsensusAnalysis(cbaId);
  const { mutate: generateConsensus, isPending: isGenerating } = useGenerateConsensus(cbaId);

  const latestConsensus = consensusData?.[0]; // Get the latest consensus analysis

  // Calculate consensus results from the backend data or member evaluations
  const consensusResults = useMemo(() => {
    if (latestConsensus?.vendor_scores_summary) {
      return {
        vendor_scores: latestConsensus.vendor_scores_summary,
        recommended_vendor: latestConsensus.vendor_scores_summary?.find((v: any) => v.vendor_id === latestConsensus.recommended_vendor),
        agreement_percentage: latestConsensus.agreement_percentage || 0,
        consensus_reached: (latestConsensus.agreement_percentage || 0) >= 60
      };
    }
    return null;
  }, [latestConsensus]);

  // Get consensus badge variant
  const getConsensusBadge = (percentage: number) => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "darkYellow";
    return "destructive";
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (evaluationsLoading || consensusLoading) {
    return <Loading />;
  }

  if (!memberEvaluations || memberEvaluations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon icon="mdi:account-group-outline" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Member Evaluations Yet</h3>
        <p className="text-gray-500">Committee members need to submit their evaluations before consensus analysis can be performed.</p>
      </Card>
    );
  }

  if (!consensusResults) {
    return (
      <Card className="p-8 text-center">
        <Icon icon="mdi:chart-line" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Unable to Calculate Consensus</h3>
        <p className="text-gray-500">Please ensure all committee members have completed their evaluations.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consensus Analysis</h2>
          <p className="text-gray-600 mt-1">
            Aggregated results from {memberEvaluations.length} committee member evaluations
          </p>
        </div>

        <Button
          onClick={() => generateConsensus()}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? (
            <>
              <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Icon icon="carbon:analytics" className="w-4 h-4 mr-2" />
              Generate Final Consensus
            </>
          )}
        </Button>
      </div>

      {/* Overall Consensus Summary */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-green-900">Committee Consensus</h3>
            <p className="text-green-700">Recommended Vendor Selection</p>
          </div>
          <Badge variant={getConsensusBadge(consensusResults.agreement_percentage)} className="text-lg px-4 py-2">
            {consensusResults.agreement_percentage}% Agreement
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">{consensusResults.recommended_vendor?.name}</div>
            <div className="text-sm text-green-700 mt-1">Recommended Vendor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">
              {consensusResults.recommended_vendor?.consensus_score?.toFixed(1)}
            </div>
            <div className="text-sm text-green-700 mt-1">Consensus Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">
              {(consensusResults.recommended_vendor?.recommendation_rate * 100)?.toFixed(0)}%
            </div>
            <div className="text-sm text-green-700 mt-1">Member Support</div>
          </div>
        </div>

        {/* Consensus Status */}
        <div className="mt-4 flex items-center justify-center space-x-3">
          <Icon
            icon={consensusResults.consensus_reached ? "mdi:check-circle" : "mdi:alert-circle"}
            className={`w-5 h-5 ${consensusResults.consensus_reached ? "text-green-600" : "text-yellow-600"}`}
          />
          <span className={`font-semibold ${consensusResults.consensus_reached ? "text-green-800" : "text-yellow-800"}`}>
            {consensusResults.consensus_reached ? "Strong Consensus Reached" : "Moderate Consensus"}
          </span>
        </div>
      </Card>

      {/* Vendor Comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Vendor Consensus Scores</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {consensusResults.vendor_scores
            .sort((a, b) => b.consensus_score - a.consensus_score)
            .map((vendor, index) => (
              <Card
                key={vendor.id}
                className={`p-6 ${index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{vendor.name}</h4>
                    {index === 0 && (
                      <Badge variant="success" className="mt-1">
                        <Icon icon="mdi:crown" className="w-3 h-3 mr-1" />
                        Top Choice
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{vendor.consensus_score.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Technical Average:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={vendor.avg_technical_score} className="w-20 h-2" />
                      <span className={`font-semibold text-sm ${getScoreColor(vendor.avg_technical_score)}`}>
                        {vendor.avg_technical_score.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price Average:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={vendor.avg_price_score} className="w-20 h-2" />
                      <span className={`font-semibold text-sm ${getScoreColor(vendor.avg_price_score)}`}>
                        {vendor.avg_price_score.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recommendation Rate:</span>
                    <Badge variant={vendor.recommendation_rate > 0.5 ? "success" : "darkYellow"}>
                      {(vendor.recommendation_rate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                {/* Individual Member Scores */}
                <div className="border-t pt-3">
                  <h5 className="font-semibold text-sm text-gray-700 mb-2">Individual Member Scores</h5>
                  <div className="space-y-1">
                    {vendor.member_scores?.map((score) => (
                      <div key={score.member_id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{score.member_name}:</span>
                        <div className="flex items-center space-x-3">
                          <span>T: {score.technical}</span>
                          <span>P: {score.price}</span>
                          <Icon
                            icon={score.recommended ? "mdi:thumb-up" : "mdi:thumb-down"}
                            className={`w-3 h-3 ${score.recommended ? "text-green-600" : "text-red-600"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Member Participation Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Committee Member Participation</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memberEvaluations.map((evaluation) => (
            <div key={evaluation.member_id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{evaluation.member_name}</h4>
                  <p className="text-xs text-gray-600">{evaluation.member_designation}</p>
                </div>
                <Badge variant="success" className="text-xs">
                  <Icon icon="mdi:check" className="w-3 h-3 mr-1" />
                  Submitted
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Vendors Evaluated:</span>
                  <span className="ml-2 font-semibold">{evaluation.vendor_evaluations.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Recommended:</span>
                  <span className="ml-2 font-semibold">
                    {evaluation.vendor_evaluations.filter(ve => ve.recommended).map(ve => ve.vendor_name).join(", ") || "None"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {evaluation.overall_recommendation.length > 50
                    ? `${evaluation.overall_recommendation.substring(0, 50)}...`
                    : evaluation.overall_recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Consensus Methodology */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Consensus Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">Scoring Formula</h4>
            <ul className="space-y-1">
              <li>• Technical Weight: 70%</li>
              <li>• Price Weight: 30%</li>
              <li>• Overall = (Technical × 0.7) + (Price × 0.3)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Consensus Criteria</h4>
            <ul className="space-y-1">
              <li>• Strong Consensus: ≥80% agreement</li>
              <li>• Moderate Consensus: 60-79% agreement</li>
              <li>• Weak Consensus: <60% agreement</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsensusAnalysis;