import { Award, FileText, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface AwardRecommendationPanelProps {
  awardRecommendation: string;
  setAwardRecommendation: (value: string) => void;
  cbaData: any;
  solicitationId: string | null;
}

export const AwardRecommendationPanel = ({
  awardRecommendation,
  setAwardRecommendation,
  cbaData,
  solicitationId
}: AwardRecommendationPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Award Recommendation</h3>
              <p className="text-sm text-slate-600">Final recommendation for contract award</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 px-4 py-2">
            Criterion M
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Reference Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">RFQ Reference</p>
                <p className="text-sm font-semibold text-blue-900 mt-1">
                  {cbaData?.data?.solicitation?.rfq_id || solicitationId || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">CBA Reference</p>
                <p className="text-sm font-semibold text-blue-900 mt-1">
                  {cbaData?.data?.cba_reference || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Text Area */}
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-2 block">
              Recommendation Details
            </span>
            <Textarea
              value={awardRecommendation}
              onChange={(e) => setAwardRecommendation(e.target.value)}
              placeholder="Enter detailed award recommendation based on the committee's evaluation of vendor submissions.

Include:
• Procurement process overview
• Evaluation criteria applied
• Vendor performance assessment
• Technical and commercial evaluation results
• Justification for the recommended award
• Any relevant observations or conditions"
              className="w-full min-h-[300px] text-sm font-mono resize-none"
              rows={12}
            />
          </label>
          <p className="text-xs text-slate-500">
            Provide a comprehensive recommendation explaining the basis for the proposed award decision.
          </p>
        </div>

        {/* Guidelines */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-700 mb-2">Guidelines:</p>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Be objective and reference specific evaluation criteria</li>
            <li>Explain how the recommended vendor(s) best meet the procurement requirements</li>
            <li>Note any technical or commercial advantages</li>
            <li>Mention compliance with procurement regulations</li>
            <li>Include any conditions or recommendations for contract execution</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
