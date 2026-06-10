import { ClipboardCheck, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VendorData, EvaluationScores } from "./types";

interface EvaluationCriteriaPanelProps {
  vendorData: VendorData[];
  evaluationScores: EvaluationScores;
  setEvaluationScores: React.Dispatch<React.SetStateAction<EvaluationScores>>;
}

export const EvaluationCriteriaPanel = ({
  vendorData,
  evaluationScores,
  setEvaluationScores
}: EvaluationCriteriaPanelProps) => {
  const evaluationCriteria = [
    {
      id: "A",
      label: "Quality/Cost-Based Analysis",
      description: "(i) Technical Evaluation = 60% (ii) Price Reasonableness = 40%",
      field: "qualityScores",
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
      ]
    },
    {
      id: "B",
      label: "Approved Models and Brands",
      description: "Auto-populated from vendor submissions",
      field: "approvedModels",
      type: "display"
    },
    {
      id: "C",
      label: "Price Responsiveness Rating",
      description: "Rank vendors by price competitiveness",
      field: "priceResponsiveness",
      type: "select",
      options: [
        { value: "1st-most-responsive", label: "1st - Most Responsive" },
        { value: "2nd-most-responsive", label: "2nd - Most Responsive" },
        { value: "3rd-most-responsive", label: "3rd - Most Responsive" },
        { value: "4th-most-responsive", label: "4th - Most Responsive" },
      ]
    },
    {
      id: "D",
      label: "Technical & Financial Eligibility",
      description: "Does the bidder pass technical and financial evaluation?",
      field: "technicalEligibility",
      type: "select",
      options: [
        { value: "YES", label: "YES" },
        { value: "NO", label: "NO" },
      ]
    },
    {
      id: "I",
      label: "Bank Account Verification",
      description: "Does the vendor provide bank account to enable payment?",
      field: "bankAccountEvaluation",
      type: "select",
      options: [
        { value: "YES", label: "YES" },
        { value: "NO", label: "NO" },
      ]
    },
    {
      id: "J",
      label: "Work Experience",
      description: "Does the vendor have reasonable experience in provision of these goods/services?",
      field: "experienceEvaluation",
      type: "select",
      options: [
        { value: "YES", label: "YES" },
        { value: "NO", label: "NO" },
      ]
    },
  ];

  const displayCriteria = [
    { id: "E", label: "Delivery Lead Time", field: "deliveryTime" },
    { id: "F", label: "Payment Terms", field: "paymentTerms" },
    { id: "G", label: "Tax Identification Number (TIN)", field: "tin" },
    { id: "H", label: "Validity Period", field: "validityPeriod" },
    { id: "K", label: "Currency for Payment", field: "currency" },
    { id: "L", label: "Warranty Provision", field: "warranty" },
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
            <h3 className="text-xl font-bold text-slate-900">Evaluation Criteria</h3>
            <p className="text-sm text-slate-600">Score vendors against standard procurement criteria</p>
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

          {evaluationCriteria.map((criteria) => (
            <div key={criteria.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="font-bold">
                        {criteria.id}
                      </Badge>
                      <h5 className="font-semibold text-slate-900">{criteria.label}</h5>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{criteria.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vendorData.map((vendor) => (
                    <div key={vendor.id} className="border border-slate-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-slate-700 mb-3">{vendor.name}</p>

                      {criteria.type === "select" ? (
                        <Select
                          value={evaluationScores[criteria.field as keyof EvaluationScores][vendor.id] || ""}
                          onValueChange={(value) =>
                            setEvaluationScores(prev => ({
                              ...prev,
                              [criteria.field]: { ...prev[criteria.field as keyof EvaluationScores], [vendor.id]: value }
                            }))
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
                  ))}
                </div>
              </div>
            </div>
          ))}
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
                  {vendorData.map((vendor) => (
                    <th key={vendor.id} className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      {vendor.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {displayCriteria.map((criteria, index) => (
                  <tr key={criteria.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-bold text-xs">
                          {criteria.id}
                        </Badge>
                        <span className="text-sm font-medium text-slate-700">{criteria.label}</span>
                      </div>
                    </td>
                    {vendorData.map((vendor) => (
                      <td key={vendor.id} className="px-4 py-3 text-center">
                        <span className="text-sm text-slate-900">
                          {vendor[criteria.field as keyof VendorData] as string}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
