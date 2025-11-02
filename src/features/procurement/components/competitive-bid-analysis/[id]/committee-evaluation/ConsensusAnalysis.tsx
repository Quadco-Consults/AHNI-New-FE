"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Loading } from "components/Loading";
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
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ConsensusAnalysis;