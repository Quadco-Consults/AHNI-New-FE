"use client";

import { useMemo } from "react";
import { LineChart, Users } from 'lucide-react';
import { Icon } from "@iconify/react";
import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/Loading";
import {
  useGetAllMemberEvaluations,
  useCalculateConsensus,
  useGenerateConsensus
} from "@/features/procurement/controllers/committeeEvaluationController";

interface ConsensusAnalysisProps {
  cbaId: string;
}

const ConsensusAnalysis = ({ cbaId }: ConsensusAnalysisProps) => {
  const { data: memberEvaluations, isLoading } = useGetAllMemberEvaluations(cbaId);
  const { calculateConsensus } = useCalculateConsensus(memberEvaluations || []);
  const { mutate: generateConsensus, isPending: isGenerating } = useGenerateConsensus(cbaId);

  const consensusResults = useMemo(() => {
    if (!memberEvaluations || memberEvaluations.length === 0) return null;
    return calculateConsensus();
  }, [memberEvaluations, calculateConsensus]);

  if (isLoading) {
    return <Loading />;
  }

  if (!memberEvaluations || memberEvaluations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Users size={16} />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Member Evaluations Yet</h3>
        <p className="text-gray-500">Committee members need to submit their evaluations before consensus analysis can be performed.</p>
      </Card>
    );
  }

  if (!consensusResults) {
    return (
      <Card className="p-8 text-center">
        <LineChart size={16} />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Unable to Calculate Consensus</h3>
        <p className="text-gray-500">Please ensure all committee members have completed their evaluations.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
          {isGenerating ? "Generating..." : "Generate Consensus"}
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-green-900">Committee Consensus</h3>
        <p className="text-green-700">Recommended Vendor Selection</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">
              {consensusResults.recommended_vendor?.name || "N/A"}
            </div>
            <div className="text-sm text-green-700 mt-1">Recommended Vendor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">
              {consensusResults.recommended_vendor?.consensus_score?.toFixed(1) || "N/A"}
            </div>
            <div className="text-sm text-green-700 mt-1">Consensus Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">
              {consensusResults.agreement_percentage || 0}%
            </div>
            <div className="text-sm text-green-700 mt-1">Agreement</div>
          </div>
        </div>
      </Card>

      {/* Detailed Vendor Scores by Member */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Vendor Scores by Committee Member</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Vendor</th>
                {memberEvaluations.map((evaluation) => (
                  <th key={evaluation.member_id} className="border border-gray-300 p-3 text-center">
                    <div className="font-semibold">{evaluation.member_name}</div>
                    <div className="text-xs text-gray-600 font-normal">{evaluation.member_designation}</div>
                  </th>
                ))}
                <th className="border border-gray-300 p-3 text-center bg-green-50">
                  <div className="font-semibold">Consensus</div>
                  <div className="text-xs text-gray-600 font-normal">Average Score</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {consensusResults.vendor_scores.map((vendorScore: any) => (
                <tr key={vendorScore.id} className={vendorScore.id === consensusResults.recommended_vendor?.id ? 'bg-green-50' : ''}>
                  <td className="border border-gray-300 p-3 font-semibold">
                    {vendorScore.name}
                    {vendorScore.id === consensusResults.recommended_vendor?.id && (
                      <Badge className="ml-2 bg-green-600 text-white text-xs">Recommended</Badge>
                    )}
                  </td>
                  {memberEvaluations.map((evaluation) => {
                    const memberScore = vendorScore.member_scores?.find(
                      (ms: any) => ms.member_id === evaluation.member_id
                    );
                    return (
                      <td key={evaluation.member_id} className="border border-gray-300 p-3 text-center">
                        {memberScore ? (
                          <div>
                            <div className="font-bold text-lg">
                              {((memberScore.technical * 0.7) + (memberScore.price * 0.3)).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-600">
                              T: {memberScore.technical} | P: {memberScore.price}
                            </div>
                            {memberScore.recommended && (
                              <Icon icon="mdi:star" className="w-4 h-4 text-yellow-500 mx-auto mt-1" />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="border border-gray-300 p-3 text-center bg-green-50">
                    <div className="font-bold text-xl text-green-700">
                      {vendorScore.consensus_score?.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {(vendorScore.recommendation_rate * 100).toFixed(0)}% recommend
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Committee Member Participation Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Committee Member Participation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memberEvaluations.map((evaluation) => (
            <div key={evaluation.member_id} className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900">{evaluation.member_name}</h4>
              <p className="text-xs text-gray-600">{evaluation.member_designation}</p>
              <Badge variant="default" className="text-xs mt-2">
                Submitted
              </Badge>
              {evaluation.overall_recommendation && (
                <div className="mt-3 p-2 bg-white rounded text-xs text-gray-700">
                  <strong>Recommendation:</strong> {evaluation.overall_recommendation.slice(0, 100)}
                  {evaluation.overall_recommendation.length > 100 && '...'}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ConsensusAnalysis;