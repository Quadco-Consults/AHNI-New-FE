"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LinkIcon, CheckCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/Loading";

import { SiteVisitType } from "@/features/programs/types/site-visit";

interface PlanLinkingSectionProps {
  approvedPlans: any[];
  selectedPlan: string;
  selectedPlannedVisit: string;
  plannedVisits: any[];
  selectedPlanData: any;
  onPlanSelect: (planId: string) => void;
  onPlannedVisitSelect: (visitId: string) => void;
  visitType: SiteVisitType;
  isPlansLoading?: boolean;
}

const PlanLinkingSection: React.FC<PlanLinkingSectionProps> = ({
  approvedPlans,
  selectedPlan,
  selectedPlannedVisit,
  plannedVisits,
  selectedPlanData,
  onPlanSelect,
  onPlannedVisitSelect,
  visitType,
  isPlansLoading = false,
}) => {
  // Filter planned visits based on visit type
  const compatibleVisits = plannedVisits.filter((visit: any) =>
    visit.visit_type === visitType ||
    (visitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION &&
     visit.visit_type === SiteVisitType.SUPPORTIVE_SUPERVISION)
  );

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <LinkIcon className="h-5 w-5" />
          Link to Annual Supervision Plan
        </CardTitle>
        <p className="text-sm text-blue-700">
          Select from approved annual supervision plans to auto-populate visit details and ensure compliance with planned activities.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Annual Plan Selection */}
        <div className="space-y-2">
          <Label htmlFor="annual-plan-select" className="text-sm font-medium">
            Annual Supervision Plan (Optional)
          </Label>
          <Select value={selectedPlan} onValueChange={onPlanSelect}>
            <SelectTrigger id="annual-plan-select">
              <SelectValue placeholder="Select an approved annual supervision plan" />
            </SelectTrigger>
            <SelectContent>
              {isPlansLoading ? (
                <div className="flex items-center justify-center p-4">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-sm">Loading plans...</span>
                </div>
              ) : approvedPlans.length > 0 ? (
                approvedPlans.map((plan: any) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{plan.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {plan.financial_year_display}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-plans" disabled>
                  No approved annual supervision plans available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Planned Visit Selection */}
        {selectedPlan && (
          <div className="space-y-2">
            <Label htmlFor="planned-visit-select" className="text-sm font-medium">
              Planned Visit (Optional)
            </Label>
            <Select value={selectedPlannedVisit} onValueChange={onPlannedVisitSelect}>
              <SelectTrigger id="planned-visit-select">
                <SelectValue placeholder="Select a planned visit from the chosen plan" />
              </SelectTrigger>
              <SelectContent>
                {compatibleVisits.length > 0 ? (
                  compatibleVisits.map((visit: any) => (
                    <SelectItem key={visit.id} value={visit.id}>
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{visit.location_name}</span>
                          <Badge variant="secondary" size="sm">
                            Q{visit.planned_quarter || '?'}
                          </Badge>
                        </div>
                        {visit.facility_name && (
                          <span className="text-xs text-gray-600">
                            {visit.facility_name}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-visits" disabled>
                    No compatible planned visits found for {visitType.replace('_', ' ').toLowerCase()}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {plannedVisits.length > 0 && compatibleVisits.length === 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800 text-sm">
                  This plan has {plannedVisits.length} planned visit(s), but none match your selected visit type ({visitType.replace('_', ' ')}).
                  {visitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION &&
                    " Emergency visits can be linked to regular supportive supervision plans."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Selected Plan Info */}
        {selectedPlanData && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Selected Plan Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Title:</span>
                <div className="font-medium">{selectedPlanData.title}</div>
              </div>
              <div>
                <span className="text-gray-600">Financial Year:</span>
                <div className="font-medium">{selectedPlanData.financial_year_display}</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div>
                  <Badge
                    variant={selectedPlanData.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {selectedPlanData.status}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Planned Visits:</span>
                <div className="font-medium">{plannedVisits.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Auto-population Success Message */}
        {selectedPlannedVisit && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Form Auto-populated:</strong> Location, title, visit type, and purpose have been automatically
              filled based on your selected planned visit. You can modify these details as needed.
            </AlertDescription>
          </Alert>
        )}

        {/* Benefits Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800 text-sm">
            <strong>Benefits of linking to a plan:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>Auto-populate location and visit details</li>
              <li>Ensure compliance with approved annual plans</li>
              <li>Track planned vs actual visits</li>
              <li>Simplified reporting and budget tracking</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PlanLinkingSection;