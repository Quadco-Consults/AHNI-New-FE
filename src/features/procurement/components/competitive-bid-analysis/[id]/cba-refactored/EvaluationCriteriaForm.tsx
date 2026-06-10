"use client";

import { ClipboardCheck, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface VendorEvaluationScores {
  vendorId: string;
  vendorName: string;
  qualityScore?: string; // "60-70"
  priceResponsiveness?: string; // "1st-most-responsive"
  technicalEligibility?: string; // "YES" | "NO"
  bankAccountEvaluation?: string; // "YES" | "NO"
  experienceEvaluation?: string; // "YES" | "NO"
  // Auto-populated fields
  approvedModels?: string;
  deliveryTime?: string;
  paymentTerms?: string;
  tin?: string;
  validityPeriod?: string;
  currency?: string;
  warranty?: string;
  grandTotal?: number;
}

interface EvaluationCriteriaFormProps {
  vendors: Array<{
    id: string;
    name: string;
    items: Array<{ brand?: string }>;
    deliveryTime: string;
    paymentTerms: string;
    tin: string;
    validityPeriod: string;
    currency: string;
    warranty: string;
    grandTotal: number;
  }>;
  evaluationScores: VendorEvaluationScores[];
  onScoresChange: (scores: VendorEvaluationScores[]) => void;
}

/**
 * Evaluation Criteria Form (A-M)
 * Committee members score vendors on mandatory criteria
 */
export const EvaluationCriteriaForm = ({
  vendors,
  evaluationScores,
  onScoresChange
}: EvaluationCriteriaFormProps) => {
  const updateScore = (vendorId: string, field: keyof VendorEvaluationScores, value: string) => {
    const newScores = evaluationScores.map(score =>
      score.vendorId === vendorId ? { ...score, [field]: value } : score
    );
    onScoresChange(newScores);
  };

  const evaluationCriteria = [
    {
      id: "A",
      label: "Quality/Cost-Based Analysis",
      description: "Technical Evaluation (60%) + Price Reasonableness (40%)",
      field: "qualityScore" as keyof VendorEvaluationScores,
      type: "select",
      options: [
        { value: "20-30", label: "20-30%" },
        { value: "30-40", label: "30-40%" },
        { value: "40-50", label: "40-50%" },
        { value: "50-60", label: "50-60%" },
        { value: "60-70", label: "60-70%" },
        { value: "70-80", label: "70-80%" },
        { value: "81-90", label: "81-90%" },
        { value: "90-100", label: "90-100%" },
      ],
      required: true
    },
    {
      id: "B",
      label: "Approved Models and Brands",
      description: "Auto-populated from vendor submissions",
      field: "approvedModels" as keyof VendorEvaluationScores,
      type: "display",
      required: false
    },
    {
      id: "C",
      label: "Price Responsiveness Rating",
      description: "Rank vendors by price competitiveness",
      field: "priceResponsiveness" as keyof VendorEvaluationScores,
      type: "select",
      options: [
        { value: "1st-most-responsive", label: "1st - Most Responsive" },
        { value: "2nd-most-responsive", label: "2nd - Most Responsive" },
        { value: "3rd-most-responsive", label: "3rd - Most Responsive" },
        { value: "4th-most-responsive", label: "4th - Most Responsive" },
      ],
      required: true
    },
    {
      id: "D",
      label: "Technical & Financial Eligibility",
      description: "Does the bidder pass technical and financial evaluation?",
      field: "technicalEligibility" as keyof VendorEvaluationScores,
      type: "select",
      options: [
        { value: "YES", label: "YES" },
        { value: "NO", label: "NO" },
      ],
      required: true
    },
    {
      id: "I",
      label: "Bank Account Verification",
      description: "Does the vendor provide bank account to enable payment?",
      field: "bankAccountEvaluation" as keyof VendorEvaluationScores,
      type: "select",
      options: [
        { value: "YES", label: "YES" },
        { value: "NO", label: "NO" },
      ],
      required: true
    },
    {
      id: "J",
      label: "Work Experience",
      description: "Does the vendor have reasonable experience?",
      field: "experienceEvaluation" as keyof VendorEvaluationScores,
      type: "select",
      options: [
        { value: "YES", label: "YES" },
        { value: "NO", label: "NO" },
      ],
      required: true
    },
  ];

  const displayCriteria = [
    { id: "E", label: "Delivery Lead Time", field: "deliveryTime" as keyof VendorEvaluationScores },
    { id: "F", label: "Payment Terms", field: "paymentTerms" as keyof VendorEvaluationScores },
    { id: "G", label: "Tax Identification Number (TIN)", field: "tin" as keyof VendorEvaluationScores },
    { id: "H", label: "Validity Period", field: "validityPeriod" as keyof VendorEvaluationScores },
    { id: "K", label: "Currency for Payment", field: "currency" as keyof VendorEvaluationScores },
    { id: "L", label: "Warranty Provision", field: "warranty" as keyof VendorEvaluationScores },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Evaluation Criteria (A-M)</h3>
            <p className="text-sm text-slate-600">Score vendors on mandatory procurement criteria</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Evaluation Criteria (Interactive) */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-slate-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Evaluation Criteria
          </h4>

          {evaluationCriteria.map((criteria) => {
            const hasAllScores = evaluationScores.every(score =>
              !criteria.required || score[criteria.field]
            );

            return (
              <div key={criteria.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-bold">
                          {criteria.id}
                        </Badge>
                        <h5 className="font-semibold text-slate-900">{criteria.label}</h5>
                        {criteria.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{criteria.description}</p>
                    </div>
                    {criteria.required && (
                      <div>
                        {hasAllScores ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {evaluationScores.map((score) => {
                      const vendor = vendors.find(v => v.id === score.vendorId);
                      if (!vendor) return null;

                      return (
                        <div key={score.vendorId} className="border border-slate-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">{score.vendorName}</p>

                          {criteria.type === "select" ? (
                            <Select
                              value={score[criteria.field] as string || ""}
                              onValueChange={(value) =>
                                updateScore(score.vendorId, criteria.field, value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {criteria.options?.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : criteria.id === "B" ? (
                            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm">
                              {[...new Set(vendor.items.map(item => item.brand).filter(Boolean))].join(', ') || 'N/A'}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Display-Only Criteria */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-slate-900 flex items-center">
            <ClipboardCheck className="w-5 h-5 mr-2 text-slate-600" />
            Vendor Information
          </h4>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Criteria
                  </th>
                  {evaluationScores.map((score) => (
                    <th key={score.vendorId} className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      {score.vendorName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {displayCriteria.map((criteria, index) => {
                  const vendor = vendors.find(v => v.id === evaluationScores[0]?.vendorId);

                  return (
                    <tr key={criteria.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-bold text-xs">
                            {criteria.id}
                          </Badge>
                          <span className="text-sm font-medium text-slate-700">{criteria.label}</span>
                        </div>
                      </td>
                      {evaluationScores.map((score) => {
                        const vendor = vendors.find(v => v.id === score.vendorId);
                        return (
                          <td key={score.vendorId} className="px-4 py-3 text-center">
                            <span className="text-sm text-slate-900">
                              {vendor?.[criteria.field] as string || 'N/A'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
