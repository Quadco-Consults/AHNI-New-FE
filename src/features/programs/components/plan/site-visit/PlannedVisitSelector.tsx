"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  LinkIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
} from "lucide-react";
import {
  useGetAvailablePlannedVisits,
  useLinkSiteVisitToPlannedVisit,
} from "../../controllers/annualSupervisionPlanController";
import {
  IPlannedVisit,
  PlannedVisitStatus,
  PlannedVisitStatusLabels,
  Quarter,
  QuarterLabels,
} from "../../types/annual-supervision-plan";
import { SiteVisitType } from "../../types/site-visit";
import { formatDate } from "@/utils/date";
import { toast } from "sonner";

interface PlannedVisitSelectorProps {
  siteVisitId?: string;
  locationId?: string;
  visitType?: SiteVisitType;
  onPlannedVisitSelected?: (plannedVisit: IPlannedVisit) => void;
  onCancel?: () => void;
  mode?: "select" | "link"; // select mode for form integration, link mode for post-creation linking
}

export default function PlannedVisitSelector({
  siteVisitId,
  locationId,
  visitType,
  onPlannedVisitSelected,
  onCancel,
  mode = "select"
}: PlannedVisitSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(locationId || "");
  const [selectedVisitType, setSelectedVisitType] = useState(visitType || "");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedPlannedVisit, setSelectedPlannedVisit] = useState<IPlannedVisit | null>(null);

  // API hooks
  const { data: plannedVisitsData, isLoading } = useGetAvailablePlannedVisits(
    selectedLocationId,
    selectedVisitType
  );
  const linkSiteVisitMutation = useLinkSiteVisitToPlannedVisit();

  const plannedVisits = plannedVisitsData?.results || [];

  // Filter planned visits based on search and filters
  const filteredPlannedVisits = plannedVisits.filter((visit) => {
    const matchesSearch = !searchTerm ||
      visit.location_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.facility_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.special_focus_areas?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesQuarter = !selectedQuarter || visit.planned_quarter === selectedQuarter;

    return matchesSearch && matchesQuarter;
  });

  // Handle planned visit selection
  const handleSelectPlannedVisit = (plannedVisit: IPlannedVisit) => {
    setSelectedPlannedVisit(plannedVisit);
    if (mode === "select" && onPlannedVisitSelected) {
      onPlannedVisitSelected(plannedVisit);
    }
  };

  // Handle linking travel request to planned visit
  const handleLinkSiteVisit = async () => {
    if (!siteVisitId || !selectedPlannedVisit) {
      toast.error("Missing travel request or planned visit information");
      return;
    }

    try {
      await linkSiteVisitMutation.mutateAsync({
        planned_visit_id: selectedPlannedVisit.id,
        site_visit_id: siteVisitId,
      });

      toast.success("Travel request successfully linked to planned visit");

      if (onPlannedVisitSelected) {
        onPlannedVisitSelected(selectedPlannedVisit);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to link travel request");
    }
  };

  // Get visit type display name
  const getVisitTypeDisplay = (type: string) => {
    switch (type) {
      case "SUPPORTIVE_SUPERVISION":
        return "Supportive Supervision";
      case "INTEGRATED_SUPPORTIVE_SUPERVISION":
        return "Integrated Supportive Supervision";
      default:
        return type;
    }
  };

  // Get quarter display with months
  const getQuarterDisplay = (quarter?: Quarter) => {
    if (!quarter) return "Not specified";
    return QuarterLabels[quarter];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === "select" ? "Select Planned Visit" : "Link to Planned Visit"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {mode === "select"
              ? "Choose a planned visit to associate with this travel request"
              : "Link this travel request to an existing planned visit from the annual plan"
            }
          </p>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search locations, facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Filter by location"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                disabled={!!locationId} // Disable if pre-selected
              />
            </div>

            {/* Visit Type Filter */}
            <div>
              <Label htmlFor="visit-type">Visit Type</Label>
              <Select
                value={selectedVisitType}
                onValueChange={setSelectedVisitType}
                disabled={!!visitType} // Disable if pre-selected
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="SUPPORTIVE_SUPERVISION">Supportive Supervision</SelectItem>
                  <SelectItem value="INTEGRATED_SUPPORTIVE_SUPERVISION">Integrated Supportive Supervision</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quarter Filter */}
            <div>
              <Label htmlFor="quarter">Quarter</Label>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger>
                  <SelectValue placeholder="All quarters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Quarters</SelectItem>
                  {Object.entries(QuarterLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Available Planned Visits ({filteredPlannedVisits.length})</span>
            {selectedPlannedVisit && mode === "link" && (
              <Button
                onClick={handleLinkSiteVisit}
                loading={linkSiteVisitMutation.isPending}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Link Selected Visit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPlannedVisits.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Planned Visits Found</h4>
              <p className="text-gray-600">
                {plannedVisits.length === 0
                  ? "No planned visits are available for the selected criteria."
                  : "No planned visits match your current search and filter criteria."
                }
              </p>
              {plannedVisits.length === 0 && (
                <Alert className="mt-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Planned visits are created through the Annual Supervision Planning process.
                    Contact your supervisor or create an annual plan to add planned visits.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlannedVisits.map((plannedVisit) => (
                <div
                  key={plannedVisit.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlannedVisit?.id === plannedVisit.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => handleSelectPlannedVisit(plannedVisit)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Location and Facility */}
                      <div className="flex items-center gap-2 mb-2">
                        <MapPinIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{plannedVisit.location_name}</span>
                        {plannedVisit.facility_name && (
                          <span className="text-gray-500">• {plannedVisit.facility_name}</span>
                        )}
                      </div>

                      {/* Visit Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {getVisitTypeDisplay(plannedVisit.visit_type)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{getQuarterDisplay(plannedVisit.planned_quarter)}</span>
                        </div>

                        {plannedVisit.estimated_duration_days && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            <span>{plannedVisit.estimated_duration_days} days</span>
                          </div>
                        )}
                      </div>

                      {/* Special Focus Areas */}
                      {plannedVisit.special_focus_areas && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-700">Focus Areas: </span>
                          <span className="text-xs text-gray-600">{plannedVisit.special_focus_areas}</span>
                        </div>
                      )}

                      {/* Comments */}
                      {plannedVisit.comments && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-700">Comments: </span>
                          <span className="text-xs text-gray-600">{plannedVisit.comments}</span>
                        </div>
                      )}

                      {/* Evaluation Status */}
                      <div className="flex items-center gap-2">
                        {plannedVisit.requires_evaluation ? (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Evaluation Required
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            No Evaluation Required
                          </Badge>
                        )}

                        <Badge
                          variant={plannedVisit.status === PlannedVisitStatus.PLANNED ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {PlannedVisitStatusLabels[plannedVisit.status]}
                        </Badge>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedPlannedVisit?.id === plannedVisit.id && (
                      <div className="ml-4">
                        <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Existing Site Visit Warning */}
                  {plannedVisit.site_visit_id && (
                    <Alert className="mt-3">
                      <AlertCircleIcon className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        This planned visit is already linked to travel request: {plannedVisit.site_visit_title}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Visit Summary */}
      {selectedPlannedVisit && mode === "select" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              Selected Planned Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-900">
                    {selectedPlannedVisit.location_name}
                    {selectedPlannedVisit.facility_name && ` - ${selectedPlannedVisit.facility_name}`}
                  </h4>
                  <p className="text-sm text-green-700">
                    {getVisitTypeDisplay(selectedPlannedVisit.visit_type)} • {getQuarterDisplay(selectedPlannedVisit.planned_quarter)}
                    {selectedPlannedVisit.estimated_duration_days && ` • ${selectedPlannedVisit.estimated_duration_days} days`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPlannedVisit(null)}
                >
                  Change Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}