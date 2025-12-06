"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LinkIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  TargetIcon,
  InfoIcon,
} from "lucide-react";

import { PlannedVisitSelector } from "./PlannedVisitSelector";
import { useGetSingleSiteVisit } from "../../controllers/siteVisitController";
import { IPlannedVisit } from "../../types/annual-supervision-plan";
import { formatDate } from "@/utils/date";
import { toast } from "sonner";

interface SiteVisitPlannedVisitLinkerProps {
  siteVisitId: string;
  currentPlannedVisit?: IPlannedVisit;
  onLinkingComplete?: () => void;
}

export default function SiteVisitPlannedVisitLinker({
  siteVisitId,
  currentPlannedVisit,
  onLinkingComplete,
}: SiteVisitPlannedVisitLinkerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  // Fetch site visit details
  const { data: siteVisitData } = useGetSingleSiteVisit(siteVisitId);
  const siteVisit = siteVisitData?.data;

  const handlePlannedVisitSelected = async (plannedVisit: IPlannedVisit) => {
    setIsLinking(true);
    try {
      // The linking logic is handled in the PlannedVisitSelector component
      toast.success("Site visit successfully linked to planned visit");
      setIsDialogOpen(false);
      if (onLinkingComplete) {
        onLinkingComplete();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to link site visit");
    } finally {
      setIsLinking(false);
    }
  };

  const handleRemoveLink = () => {
    // TODO: Implement remove link functionality if needed
    toast.info("Remove link functionality would be implemented here");
  };

  if (!siteVisit) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Annual Plan Linkage
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentPlannedVisit ? (
          // Already linked to a planned visit
          <div className="space-y-4">
            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                This site visit is linked to a planned visit from the annual supervision plan.
              </AlertDescription>
            </Alert>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 mb-2">
                    Linked Planned Visit
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{currentPlannedVisit.location_name}</span>
                      {currentPlannedVisit.facility_name && (
                        <span className="text-green-700">• {currentPlannedVisit.facility_name}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <TargetIcon className="h-4 w-4 text-green-600" />
                        <span>{currentPlannedVisit.visit_type === "SUPPORTIVE_SUPERVISION"
                          ? "Supportive Supervision"
                          : "Integrated Supportive Supervision"}</span>
                      </div>

                      {currentPlannedVisit.planned_quarter && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4 text-green-600" />
                          <span>{currentPlannedVisit.planned_quarter}</span>
                        </div>
                      )}

                      {currentPlannedVisit.estimated_duration_days && (
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4 text-green-600" />
                          <span>{currentPlannedVisit.estimated_duration_days} days</span>
                        </div>
                      )}
                    </div>

                    {currentPlannedVisit.special_focus_areas && (
                      <div>
                        <span className="font-medium text-green-800">Focus Areas: </span>
                        <span className="text-green-700">{currentPlannedVisit.special_focus_areas}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveLink}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove Link
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <InfoIcon className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Benefits of Linking</p>
                <ul className="space-y-1 text-xs">
                  <li>• Automatic tracking against annual plan progress</li>
                  <li>• Enhanced reporting and analytics</li>
                  <li>• Streamlined evaluation process</li>
                  <li>• Better resource planning and coordination</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Not linked - show option to link
          <div className="space-y-4">
            <Alert>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                This site visit is not linked to any planned visit from the annual supervision plan.
              </AlertDescription>
            </Alert>

            <div className="text-center py-4">
              <div className="mb-4">
                <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Link to Annual Plan</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Connect this site visit to a planned visit for better tracking and reporting
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link to Planned Visit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Link Site Visit to Planned Visit</DialogTitle>
                    <DialogDescription>
                      Select a planned visit from the annual supervision plan to link with this site visit.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Current Site Visit</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Title: </span>
                        <span>{siteVisit.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Location: </span>
                        <span>{siteVisit.location_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Type: </span>
                        <span>{siteVisit.visit_type_display}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Dates: </span>
                        <span>
                          {formatDate(siteVisit.start_date)} - {formatDate(siteVisit.end_date)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Status: </span>
                        <Badge variant="secondary">{siteVisit.status_display}</Badge>
                      </div>
                      {siteVisit.facility_name && (
                        <div>
                          <span className="font-medium text-gray-600">Facility: </span>
                          <span>{siteVisit.facility_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <PlannedVisitSelector
                    siteVisitId={siteVisitId}
                    locationId={siteVisit.location_id}
                    visitType={siteVisit.visit_type}
                    mode="link"
                    onPlannedVisitSelected={handlePlannedVisitSelected}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Why Link?</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Track progress against annual plan</li>
                  <li>• Automatic evaluation setup</li>
                  <li>• Enhanced reporting capabilities</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Requirements</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Matching location and visit type</li>
                  <li>• Available planned visit slot</li>
                  <li>• Compatible timing and scope</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}