"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";

interface RFPEvaluationSummaryProps {
  cbaId: string;
  isRFPBased: boolean;
  submissionCount: number;
  evaluationCount: number;
  onViewDetails: () => void;
}

const RFPEvaluationSummary = ({
  cbaId,
  isRFPBased,
  submissionCount,
  evaluationCount,
  onViewDetails
}: RFPEvaluationSummaryProps) => {
  const evaluationStatus = useMemo(() => {
    if (submissionCount === 0) return "no_submissions";
    if (evaluationCount === 0) return "not_started";
    if (evaluationCount < submissionCount) return "in_progress";
    return "completed";
  }, [submissionCount, evaluationCount]);

  const getStatusBadge = () => {
    switch (evaluationStatus) {
      case "no_submissions":
        return <Badge variant="outline">No Submissions</Badge>;
      case "not_started":
        return <Badge variant="outline">Not Started</Badge>;
      case "in_progress":
        return <Badge variant="darkYellow">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (evaluationStatus) {
      case "no_submissions":
        return "No vendor submissions received yet. Waiting for vendors to submit their proposals.";
      case "not_started":
        return `${submissionCount} vendor${submissionCount > 1 ? 's have' : ' has'} submitted ${isRFPBased ? 'proposals' : 'bids'}. Committee evaluation can now begin.`;
      case "in_progress":
        return `Evaluated ${evaluationCount} of ${submissionCount} vendor${submissionCount > 1 ? 's' : ''}. ${submissionCount - evaluationCount} remaining.`;
      case "completed":
        return `All ${submissionCount} vendor${submissionCount > 1 ? 's' : ''} evaluated. Ready for consensus analysis.`;
      default:
        return "Evaluation status unknown.";
    }
  };

  return (
    <Card className="p-6 border-blue-200 bg-blue-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon
            icon={isRFPBased ? "mdi:file-document-multiple" : "mdi:format-list-numbered"}
            className="w-8 h-8 text-blue-600"
          />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              {isRFPBased ? "RFP Document Evaluation" : "Bid Item Evaluation"}
            </h3>
            <p className="text-sm text-blue-700">
              CBA ID: {cbaId.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          {evaluationStatus === "not_started" || evaluationStatus === "in_progress" ? (
            <Button
              onClick={onViewDetails}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Icon icon="carbon:view" className="w-4 h-4 mr-1" />
              {evaluationStatus === "not_started" ? "Start Evaluation" : "Continue"}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">{submissionCount}</div>
          <div className="text-xs text-blue-700">
            {isRFPBased ? "RFP Submissions" : "Bid Submissions"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">{evaluationCount}</div>
          <div className="text-xs text-blue-700">Evaluated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">
            {submissionCount > 0 ? Math.round((evaluationCount / submissionCount) * 100) : 0}%
          </div>
          <div className="text-xs text-blue-700">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      {submissionCount > 0 && (
        <div className="mb-4">
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(evaluationCount / submissionCount) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className="text-sm text-blue-800 bg-white bg-opacity-50 p-3 rounded">
        <Icon icon="mdi:information-outline" className="w-4 h-4 inline mr-2" />
        {getStatusMessage()}
      </div>

      {/* Evaluation Type Explanation */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="text-xs text-blue-700">
          <strong>Evaluation Type:</strong>{" "}
          {isRFPBased
            ? "Document-based evaluation with technical and commercial proposal review"
            : "Item-based evaluation with pricing and technical specification comparison"}
        </div>
      </div>
    </Card>
  );
};

export default RFPEvaluationSummary;