"use client";

import { useState } from "react";
import { ChevronDown } from 'lucide-react';import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Checkbox } from "components/ui/checkbox";
import { Button } from "components/ui/button";
import { IVendorEvaluation, IItemSelection } from "@/features/procurement/types/cba";

interface VendorData {
  id: string;
  name: string;
  items: Array<{
    id: string;
    description: string;
    specification: string;
    qty: number;
    unitPrice: number;
    total: number;
    brand?: string;
  }>;
  grandTotal: number;
  deliveryTime: string;
  paymentTerms: string;
  technicalEvaluations?: Array<{
    criteria: string;
    response: string;
  }>;
}

interface VendorScoringCardProps {
  vendor: VendorData;
  evaluation?: IVendorEvaluation;
  onUpdate: (field: string, value: any, itemId?: string) => void;
  disabled?: boolean;
}

const VendorScoringCard = ({ vendor, evaluation, onUpdate, disabled = false }: VendorScoringCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Calculate overall score (70% technical, 30% price)
  const overallScore = evaluation
    ? Math.round((evaluation.technical_score * 0.7) + (evaluation.price_score * 0.3))
    : 0;

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Get score badge variant
  const getScoreBadge = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  const handleItemSelection = (itemId: string, selected: boolean) => {
    onUpdate('item_selection', { itemId, selected });
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Vendor Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">{vendor.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600"
          >
            <Icon icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"} className="w-4 h-4" />
            {expanded ? "Collapse" : "Details"}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center bg-gray-50 p-2 rounded">
            <div className="font-semibold">Total</div>
            <div className="text-green-600">₦{vendor.grandTotal.toLocaleString()}</div>
          </div>
          <div className="text-center bg-gray-50 p-2 rounded">
            <div className="font-semibold">Items</div>
            <div>{vendor.items.length}</div>
          </div>
          <div className="text-center bg-gray-50 p-2 rounded">
            <div className="font-semibold">Delivery</div>
            <div className="text-xs">{vendor.deliveryTime}</div>
          </div>
        </div>
      </div>

      {/* Overall Recommendation Toggle */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={evaluation?.recommended || false}
            onCheckedChange={(checked) => onUpdate('recommended', checked)}
            disabled={disabled}
            className="w-5 h-5"
          />
          <span className="font-semibold text-blue-800">
            Recommend this vendor
          </span>
        </div>
        {overallScore > 0 && (
          <Badge variant={getScoreBadge(overallScore) as any} className="text-sm">
            Overall: {overallScore}%
          </Badge>
        )}
      </div>

      {/* Technical Evaluation */}
      <div className="space-y-3 border rounded-lg p-4 bg-blue-50/30">
        <div className="flex items-center space-x-2">
          <Zap size={16} />
          <h4 className="font-semibold text-blue-800">Technical Evaluation</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Technical Score (0-100)
            </label>
            <Input
              type="number"
              value={evaluation?.technical_score || 0}
              onChange={(e) => onUpdate('technical_score', parseInt(e.target.value) || 0)}
              max={100}
              min={0}
              disabled={disabled}
              className={`text-center font-semibold ${getScoreColor(evaluation?.technical_score || 0)}`}
            />
          </div>

          <div className="flex items-center justify-center">
            {evaluation?.technical_score && (
              <div className="text-center">
                <div className="text-xs text-gray-500">Rating</div>
                <Badge variant={getScoreBadge(evaluation.technical_score) as any}>
                  {evaluation.technical_score >= 80 ? "Excellent" :
                   evaluation.technical_score >= 60 ? "Good" : "Poor"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Technical Comments
          </label>
          <Textarea
            value={evaluation?.technical_comments || ''}
            onChange={(e) => onUpdate('technical_comments', e.target.value)}
            placeholder="Evaluate technical capability, experience, specifications..."
            disabled={disabled}
            rows={3}
            className="text-sm"
          />
        </div>
      </div>

      {/* Price Evaluation */}
      <div className="space-y-3 border rounded-lg p-4 bg-green-50/30">
        <div className="flex items-center space-x-2">
          <DollarSign size={16} />
          <h4 className="font-semibold text-green-800">Price Evaluation</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Price Score (0-100)
            </label>
            <Input
              type="number"
              value={evaluation?.price_score || 0}
              onChange={(e) => onUpdate('price_score', parseInt(e.target.value) || 0)}
              max={100}
              min={0}
              disabled={disabled}
              className={`text-center font-semibold ${getScoreColor(evaluation?.price_score || 0)}`}
            />
          </div>

          <div className="flex items-center justify-center">
            {evaluation?.price_score && (
              <div className="text-center">
                <div className="text-xs text-gray-500">Rating</div>
                <Badge variant={getScoreBadge(evaluation.price_score) as any}>
                  {evaluation.price_score >= 80 ? "Excellent" :
                   evaluation.price_score >= 60 ? "Good" : "Poor"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Price Comments
          </label>
          <Textarea
            value={evaluation?.price_comments || ''}
            onChange={(e) => onUpdate('price_comments', e.target.value)}
            placeholder="Evaluate pricing competitiveness, value for money, payment terms..."
            disabled={disabled}
            rows={3}
            className="text-sm"
          />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Item Selections */}
          <div>
            <h5 className="font-semibold mb-3 flex items-center">
              <ClipboardCheck size={16} />
              Item Selections
            </h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {vendor.items?.map(item => (
                <div key={item.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded text-sm">
                  <Checkbox
                    checked={evaluation?.item_selections?.find(is => is.item_id === item.id)?.selected || false}
                    onCheckedChange={(checked) => handleItemSelection(item.id, checked as boolean)}
                    disabled={disabled}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.description}</div>
                    <div className="text-xs text-gray-600">
                      Qty: {item.qty} | Price: ₦{item.unitPrice.toLocaleString()} | Total: ₦{item.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          {vendor.technicalEvaluations && vendor.technicalEvaluations.length > 0 && (
            <div>
              <h5 className="font-semibold mb-2">Technical Specifications</h5>
              <div className="space-y-2">
                {vendor.technicalEvaluations.map((tech, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                    <div className="font-medium text-gray-800">{tech.criteria}</div>
                    <div className="text-gray-600 mt-1">{tech.response}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Payment Terms</div>
              <div className="text-gray-600">{vendor.paymentTerms}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Delivery Time</div>
              <div className="text-gray-600">{vendor.deliveryTime}</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VendorScoringCard;