"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  Users,
  Target,
  AlertCircle,
  CheckCircle2,
  Link,
  Plus,
  FileText,
  Clock,
} from "lucide-react";

import TravelFeesCalculator from "../../travel-fees/TravelFeesCalculator";
import { TravelFees } from "../../hooks/useTravelRates";
import {
  SiteVisitType,
  SiteVisitTypeLabels,
  SiteVisitApplicationSchema,
  TSiteVisitApplicationFormValues,
} from "@/features/programs/types/site-visit";

import {
  PlannedVisitStatus,
  PlannedVisitStatusLabels,
} from "@/features/programs/types/annual-supervision-plan";

import {
  useCreateSiteVisit,
  useLinkSiteVisitToPlannedVisit,
} from "@/features/programs/controllers/siteVisitController";

import {
  useGetAvailablePlannedVisits,
  useGetCurrentAnnualPlan,
} from "@/features/programs/controllers/annualSupervisionPlanController";

import { useGetAllLocations, useGetAllUsers } from "@/features/modules/controllers";

interface EnhancedSiteVisitFormProps {
  onSuccess?: (siteVisitId: string) => void;
  onCancel?: () => void;
  initialData?: Partial<TSiteVisitApplicationFormValues>;
}

const EnhancedSiteVisitForm = ({
  onSuccess,
  onCancel,
  initialData,
}: EnhancedSiteVisitFormProps) => {
  const [selectedPlannedVisit, setSelectedPlannedVisit] = useState<any>(null);
  const [showAnnualPlanIntegration, setShowAnnualPlanIntegration] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [travelFees, setTravelFees] = useState<TravelFees | null>(null);

  // Fetch data
  const { data: currentPlanData } = useGetCurrentAnnualPlan();
  const { data: locationsData } = useGetAllLocations({ page: 1, size: 1000 });
  const { data: usersData } = useGetAllUsers({ page: 1, size: 1000 });

  // Mutations
  const createSiteVisitMutation = useCreateSiteVisit();
  const linkSiteVisitMutation = useLinkSiteVisitToPlannedVisit();

  // Form setup
  const form = useForm<TSiteVisitApplicationFormValues>({
    resolver: zodResolver(SiteVisitApplicationSchema),
    defaultValues: {
      title: "",
      visit_type: SiteVisitType.SUPPORTIVE_SUPERVISION,
      other_visit_type: "",
      purpose: "",
      location: "",
      specific_address: "",
      start_date: "",
      end_date: "",
      project: "",
      estimated_budget: 0,
      special_requirements: "",
      expected_outcomes: "",
      comments: "",
      team_members: [],
      travel_fees: {
        lodging_per_night: 0,
        meal_allowance_per_day: 0,
        interstate_cost: 0,
        airport_taxi: 0,
        car_hire: 0,
        total_per_person: 0,
        team_size: 1,
        number_of_nights: 1,
        total_cost: 0,
        location: "",
      },
      reviewer: "",
      authorizer: "",
      approver: "",
      ...initialData,
    },
  });

  const locations = locationsData?.data?.results || [];
  const users = usersData?.data?.results || [];
  const plannedVisits = plannedVisitsData?.data?.results || [];
  const currentPlan = currentPlanData?.data;

  // EMERGENCY DEBUG MODE - Minimal state management
  const visitType = form.watch('visit_type') || SiteVisitType.SUPPORTIVE_SUPERVISION;

  // Temporarily disable planned visits to isolate issue
  const plannedVisitsData = { data: { results: [] } };

  // Disable all useEffects temporarily
  /*
  useEffect(() => {
    setShowAnnualPlanIntegration(formState.isSupervisionType && !!currentPlan);
  }, [formState.isSupervisionType, currentPlan]);

  useEffect(() => {
    setSelectedLocation(formState.location);
    setSelectedPlannedVisit(null);
  }, [formState.location]);
  */

  const handlePlannedVisitSelect = (plannedVisitId: string) => {
    const plannedVisit = plannedVisits.find(pv => pv.id === plannedVisitId);
    if (!plannedVisit) return;

    setSelectedPlannedVisit(plannedVisit);

    // Auto-populate form fields from planned visit
    form.setValue('visit_type', plannedVisit.visit_type);
    form.setValue('location', plannedVisit.location_id);

    if (plannedVisit.estimated_duration_days) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + plannedVisit.estimated_duration_days - 1);

      // Don't auto-set dates, let user choose
      // form.setValue('start_date', startDate.toISOString().split('T')[0]);
      // form.setValue('end_date', endDate.toISOString().split('T')[0]);
    }

    if (plannedVisit.special_focus_areas) {
      form.setValue('purpose', `Supervision visit focusing on: ${plannedVisit.special_focus_areas}`);
    }

    toast.success("Planned visit linked! Form populated with planned details.");
  };

  // Handle travel fees updates from calculator
  const handleTravelFeesUpdate = useCallback((fees: TravelFees, totalCost: number) => {
    setTravelFees(fees);
    form.setValue("travel_fees", fees);
  }, [form]);

  const handleSubmit = async (data: TSiteVisitApplicationFormValues) => {
    try {
      // Include travel fees data in submission
      const submissionData = {
        ...data,
        travel_fees: data.travel_fees || travelFees,
      };

      // Create the travel request
      const createResult = await createSiteVisitMutation.mutateAsync(submissionData);
      const siteVisitId = createResult.data?.id;

      if (!siteVisitId) {
        throw new Error("Failed to get travel request ID from creation response");
      }

      // Link to planned visit if selected
      if (selectedPlannedVisit) {
        try {
          await linkSiteVisitMutation.mutateAsync({
            planned_visit_id: selectedPlannedVisit.id,
            site_visit_id: siteVisitId,
          });
          toast.success("Travel request created and linked to annual plan!");
        } catch (linkError: any) {
          // Travel request was created but linking failed
          toast.warning("Travel request created but could not link to planned visit: " + linkError.message);
        }
      } else {
        toast.success("Travel request created successfully!");
      }

      if (onSuccess) {
        onSuccess(siteVisitId);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create travel request");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Annual Plan Integration - TEMPORARILY DISABLED FOR DEBUGGING */}
      {false && showAnnualPlanIntegration && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-5 w-5" />
              Annual Supervision Plan Integration
            </CardTitle>
            <p className="text-blue-700 text-sm">
              Link this supervision visit to your annual plan for better tracking and coordination
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current Plan Info */}
              <div className="p-3 bg-white rounded border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{currentPlan?.title}</h4>
                  <Badge variant="outline">{currentPlan?.financial_year_display}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Planned:</span>
                    <span className="ml-2 font-medium">{currentPlan?.total_planned_visits}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <span className="ml-2 font-medium">{currentPlan?.visits_completed}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Progress:</span>
                    <span className="ml-2 font-medium">{currentPlan?.completion_percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Planned Visits Selection - TEMPORARILY DISABLED */}
              {false && (
                <div className="space-y-3">
                  <FormLabel>Link to Planned Visit (Optional)</FormLabel>
                  <div className="grid gap-3">
                    <div className="p-3 bg-white rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Available Planned Visits for Selected Location</span>
                      </div>
                      {plannedVisits.map((plannedVisit) => (
                        <div
                          key={plannedVisit.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPlannedVisit?.id === plannedVisit.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handlePlannedVisitSelect(plannedVisit.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{plannedVisit.location_name}</div>
                              {plannedVisit.facility_name && (
                                <Badge variant="outline" className="text-xs">
                                  {plannedVisit.facility_name}
                                </Badge>
                              )}
                            </div>
                            <Badge variant="secondary">
                              {plannedVisit.visit_type.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {plannedVisit.planned_quarter && (
                              <div>
                                <span className="text-gray-500">Quarter:</span>
                                <span className="ml-1">{plannedVisit.planned_quarter}</span>
                              </div>
                            )}
                            {plannedVisit.estimated_duration_days && (
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <span className="ml-1">{plannedVisit.estimated_duration_days} days</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-1">{PlannedVisitStatusLabels[plannedVisit.status]}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Evaluation:</span>
                              <span className="ml-1">{plannedVisit.requires_evaluation ? 'Required' : 'Not Required'}</span>
                            </div>
                          </div>

                          {plannedVisit.special_focus_areas && (
                            <div className="mt-2 text-xs text-gray-600">
                              <strong>Focus Areas:</strong> {plannedVisit.special_focus_areas}
                            </div>
                          )}

                          {selectedPlannedVisit?.id === plannedVisit.id && (
                            <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Selected for linking</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {false && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No planned visits found for the selected location. This will be created as an unplanned visit.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Planned Visit Summary */}
      {selectedPlannedVisit && (
        <Alert>
          <Link className="h-4 w-4" />
          <AlertDescription>
            <strong>Linked to Annual Plan:</strong> This visit will be linked to the planned visit for {selectedPlannedVisit.location_name}.
            {selectedPlannedVisit.requires_evaluation && (
              <span className="text-orange-600 ml-2">
                ⚠️ Post-visit evaluation will be required.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Site Visit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Site Visit Details</CardTitle>
          <p className="text-gray-600">Fill in the travel request information</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Travel request title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visit Type */}
                <FormField
                  control={form.control}
                  name="visit_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visit type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(SiteVisitType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {SiteVisitTypeLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Other Visit Type (if OTHER selected) */}
                {visitType === SiteVisitType.OTHER && (
                  <FormField
                    control={form.control}
                    name="other_visit_type"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Other Visit Type Description *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Describe the other visit type" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location: any) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name} - {location.unique_code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Specific Address */}
                <FormField
                  control={form.control}
                  name="specific_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Specific address or landmark" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estimated Budget */}
                <FormField
                  control={form.control}
                  name="estimated_budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Budget</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Purpose */}
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the purpose and objectives of this travel request"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Travel Fees - TEMPORARILY DISABLED FOR DEBUGGING */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Travel Fees * (DEBUG MODE - Calculator Disabled)</h3>
                  <p className="text-sm text-red-600">
                    TravelFeesCalculator disabled for debugging infinite loop.
                  </p>
                </div>
              </div>

              {/* Expected Outcomes */}
              <FormField
                control={form.control}
                name="expected_outcomes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Outcomes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What outcomes do you expect from this visit?"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Special Requirements */}
              <FormField
                control={form.control}
                name="special_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any special requirements or considerations"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Comments */}
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any additional comments or notes"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Approval Workflow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="reviewer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reviewer *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select reviewer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map((user: any) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.first_name} {user.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="authorizer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authorizer *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select authorizer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map((user: any) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.first_name} {user.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="approver"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Final Approver *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select approver" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map((user: any) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.first_name} {user.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={createSiteVisitMutation.isPending || linkSiteVisitMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {(createSiteVisitMutation.isPending || linkSiteVisitMutation.isPending) ? (
                    <>
                      <LoadingSpinner />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Travel Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSiteVisitForm;