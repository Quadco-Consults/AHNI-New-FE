"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";

interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  score: number;
  comments: string;
}

interface VendorEvaluationScoringFormProps {
  vendorName: string;
  service: string;
  evaluationId?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  initialData?: any;
}

const scoringOptions = [
  { value: 5, label: "Excellent", color: "text-green-700 bg-green-100" },
  { value: 4, label: "Good", color: "text-blue-700 bg-blue-100" },
  { value: 3, label: "Satisfactory", color: "text-yellow-700 bg-yellow-100" },
  { value: 2, label: "Poor", color: "text-orange-700 bg-orange-100" },
  { value: 1, label: "Very Poor", color: "text-red-700 bg-red-100" },
];

const defaultCriteria: EvaluationCriteria[] = [
  {
    id: "quality",
    name: "Quality of Goods/Services",
    description: "Did the vendor deliver goods/services that meet the required quality standards?",
    score: 0,
    comments: "",
  },
  {
    id: "timeliness",
    name: "Timeliness of Delivery",
    description: "Was the vendor able to meet delivery deadlines as agreed?",
    score: 0,
    comments: "",
  },
  {
    id: "communication",
    name: "Communication & Responsiveness",
    description: "How well did the vendor communicate and respond to inquiries?",
    score: 0,
    comments: "",
  },
  {
    id: "compliance",
    name: "Compliance with Contract Terms",
    description: "Did the vendor adhere to all contract terms and conditions?",
    score: 0,
    comments: "",
  },
  {
    id: "overall",
    name: "Overall Satisfaction",
    description: "Overall satisfaction with the vendor's performance",
    score: 0,
    comments: "",
  },
];

const VendorEvaluationScoringForm = ({
  vendorName,
  service,
  evaluationId,
  onSubmit,
  onCancel,
  initialData,
}: VendorEvaluationScoringFormProps) => {
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>(defaultCriteria);
  const [generalComments, setGeneralComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalScore = criteria.reduce((sum, criterion) => sum + criterion.score, 0);
  const maxScore = 25;
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Determine recommendation based on score
  const getRecommendation = (score: number) => {
    if (score >= 16) return { label: "RETAIN", color: "bg-green-200 text-green-800" };
    if (score >= 10) return { label: "ON_PROBATION", color: "bg-yellow-200 text-yellow-800" };
    return { label: "BARRED", color: "bg-red-200 text-red-800" };
  };

  const recommendation = getRecommendation(totalScore);

  const updateCriterionScore = (criterionId: string, score: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === criterionId ? { ...c, score } : c))
    );
  };

  const updateCriterionComments = (criterionId: string, comments: string) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === criterionId ? { ...c, comments } : c))
    );
  };

  const handleSubmit = async () => {
    // Validation
    const unscored = criteria.filter((c) => c.score === 0);
    if (unscored.length > 0) {
      toast.error(`Please score all criteria. Missing: ${unscored.map((c) => c.name).join(", ")}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const evaluationData = {
        vendor_name: vendorName,
        service,
        total_score: totalScore,
        evaluator_recommendation: recommendation.label,
        criteria: criteria.map((c) => ({
          name: c.name,
          score: c.score,
          comments: c.comments,
        })),
        general_comments: generalComments,
        status: "COMPLETED",
      };

      await onSubmit(evaluationData);
      toast.success("Vendor evaluation submitted successfully!");
    } catch (error) {
      console.error("Evaluation submission error:", error);
      toast.error("Failed to submit evaluation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{vendorName}</h2>
            <p className="text-gray-600 mt-1">Service: {service}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Score</div>
            <div className="text-3xl font-bold text-blue-600">
              {totalScore} <span className="text-lg text-gray-400">/ {maxScore}</span>
            </div>
            <div className="text-sm text-gray-600">{percentage}%</div>
          </div>
        </div>

        {totalScore > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Recommendation:</span>
              <Badge className={cn("px-3 py-1", recommendation.color)}>
                {recommendation.label.replace("_", " ")}
              </Badge>
            </div>
            {recommendation.label === "BARRED" && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-red-600 mt-0.5" size={18} />
                <p className="text-sm text-red-800">
                  This vendor's performance is below acceptable standards. Consider alternative vendors for future procurements.
                </p>
              </div>
            )}
            {recommendation.label === "ON_PROBATION" && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-yellow-600 mt-0.5" size={18} />
                <p className="text-sm text-yellow-800">
                  This vendor requires monitoring and improvement. Document specific areas needing attention.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Evaluation Criteria */}
      <div className="space-y-4">
        {criteria.map((criterion, index) => (
          <Card key={criterion.id} className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {index + 1}. {criterion.name}
                      {criterion.score > 0 && (
                        <CheckCircle2 className="text-green-500" size={20} />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                  </div>
                  {criterion.score > 0 && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {criterion.score} / 5
                    </Badge>
                  )}
                </div>
              </div>

              {/* Score Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Score</Label>
                <div className="grid grid-cols-5 gap-2">
                  {scoringOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateCriterionScore(criterion.id, option.value)}
                      className={cn(
                        "p-3 border-2 rounded-lg transition-all",
                        criterion.score === option.value
                          ? `${option.color} border-current font-semibold`
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      )}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(option.value)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={cn(
                                criterion.score === option.value
                                  ? "fill-current"
                                  : "fill-gray-300 text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor={`comments-${criterion.id}`} className="text-sm font-medium">
                  Comments (Optional)
                </Label>
                <Textarea
                  id={`comments-${criterion.id}`}
                  placeholder={`Add specific comments about ${criterion.name.toLowerCase()}...`}
                  value={criterion.comments}
                  onChange={(e) => updateCriterionComments(criterion.id, e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* General Comments */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="general-comments" className="text-lg font-semibold">
              General Comments
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Provide any additional feedback or recommendations for this vendor
            </p>
          </div>
          <Textarea
            id="general-comments"
            placeholder="Add your overall assessment and recommendations..."
            value={generalComments}
            onChange={(e) => setGeneralComments(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-white p-4 border-t shadow-lg">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || totalScore === 0}
          className="min-w-[200px]"
        >
          {isSubmitting ? "Submitting..." : "Submit Evaluation"}
        </Button>
      </div>
    </div>
  );
};

export default VendorEvaluationScoringForm;
