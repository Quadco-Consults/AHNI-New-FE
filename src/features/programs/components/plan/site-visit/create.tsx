"use client";

import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/Loading";
import MultiSelectFormField from "@/components/ui/multiselect";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Card from "@/components/Card";
import DateInput from "@/components/DateInput";
import BreadcrumbCard from "@/components/Breadcrumb";
import { RouteEnum } from "@/constants/RouterConstants";

import {
  SiteVisitApplicationSchema,
  TSiteVisitApplicationFormValues,
  SiteVisitType,
  SiteVisitTypeLabels,
  TeamMemberRole,
  SiteVisitStatus,
} from "@/features/programs/types/site-visit";

import { useCreateSiteVisit } from "@/features/programs/controllers/siteVisitController";

import {
  useGetAllFacility,
  useGetSingleFacilityManager,
} from "@/features/modules/controllers/program/facilityController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { useGetAllAnnualPlans } from "@/features/programs/controllers/annualSupervisionPlanController";
import { AnnualPlanStatus } from "@/features/programs/types/annual-supervision-plan";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import TravelFeesCalculator from "@/features/programs/components/travel-fees/TravelFeesCalculator";
import { TravelFees } from "@/features/programs/hooks/useTravelRates";

const SiteVisitCreate = () => {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedPlannedVisit, setSelectedPlannedVisit] = useState<string>("");
  const [travelFees, setTravelFees] = useState<TravelFees | null>(null);

  // Site Visit API
  const createSiteVisit = useCreateSiteVisit();
  const isCreating = createSiteVisit.isPending;

  // Fetch facilities
  const { data: facility, isLoading: isFacilityLoading } = useGetAllFacility({
    page: 1,
    size: 2000000,
  });

  // Fetch approved annual supervision plans
  const { data: annualPlansData, isLoading: isPlansLoading } = useGetAllAnnualPlans({
    page: 1,
    size: 1000,
  });

  // Fetch locations
  const { data: locationsData, isLoading: isLocationsLoading } = useGetAllLocations({
    page: 1,
    size: 1000,
  });

  // Fetch projects
  const { data: projectsData, isLoading: isProjectsLoading } = useGetAllProjects({
    page: 1,
    size: 1000,
  });

  // Fetch users from user table only (not employee database)
  const { data: user } = useGetAllUsers({ page: 1, size: 2000000 });

  // IMPORTANT FIX: Only use users from user table, NOT employee database
  // Site visit backend expects user UUIDs, not employee record IDs
  // Mixing employee data causes UUID mismatch errors
  const ahniStaffUsers = filterAhniStaffOnly((user?.data?.results || []) as any[]);

  // Debug user data structure (development only)
  if (process.env.NODE_ENV === 'development' && ahniStaffUsers.length > 0) {
    console.log('🔍 Site Visit Team Members Debug:', {
      totalUsers: ahniStaffUsers.length,
      sampleUser: {
        id: ahniStaffUsers[0]?.id,
        name: `${ahniStaffUsers[0]?.first_name} ${ahniStaffUsers[0]?.last_name}`,
        email: ahniStaffUsers[0]?.email,
        source: 'user_table_only'
      },
      message: 'Using only user table data to avoid UUID mismatch'
    });
  }

  // Debug team members data structure

  // Filter for approved/active annual plans
  const approvedPlans = (annualPlansData?.data?.results || []).filter((plan: any) =>
    plan.status === AnnualPlanStatus.APPROVED || plan.status === AnnualPlanStatus.ACTIVE
  );

  // Get selected plan details
  const selectedPlanData = approvedPlans.find((plan: any) => plan.id === selectedPlan);
  const plannedVisits = selectedPlanData?.planned_visits || [];

  // Get facility details when one is selected
  const { data: facilityData, isFetching: isSingleFacilityLoading } =
    useGetSingleFacilityManager(selectedFacility || "", !!selectedFacility);

  const form = useForm<TSiteVisitApplicationFormValues>({
    resolver: zodResolver(SiteVisitApplicationSchema),
    defaultValues: {
      title: "",
      location: "",
      facility: "",
      state: "",
      lga: "",
      visit_type: SiteVisitType.SUPPORTIVE_SUPERVISION,
      other_type_description: "",
      purpose: "",
      expected_outcome: "",
      start_date: "",
      end_date: "",
      team_members: [],
      reviewer: "",
      authorizer: "",
      approver: "",
      additional_comments: "",
      project: "none", // Default to "No Project"
      travel_fees: {
        lodging: 0,
        meals: 0,
        interstate: 0,
        airportTaxi: 0,
        carHire: 0,
        numberOfNights: 1,
        totalPerPerson: 0,
      },
    },
  });

  const { handleSubmit, watch, setValue } = form;
  const facilityId = watch("facility");
  const siteVisitType = watch("visit_type");
  const location = watch("location");
  const state = watch("state");
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const teamMembers = watch("team_members");

  // Clear plan selections when site visit type changes
  useEffect(() => {
    if (siteVisitType &&
        siteVisitType !== SiteVisitType.SUPPORTIVE_SUPERVISION &&
        siteVisitType !== SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION &&
        siteVisitType !== SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION) {
      setSelectedPlan("");
      setSelectedPlannedVisit("");
    }
  }, [siteVisitType]);

  // Auto-populate form fields when a planned visit is selected
  useEffect(() => {
    if (selectedPlannedVisit) {
      const plannedVisit = plannedVisits.find((visit: any) => visit.id === selectedPlannedVisit);
      if (plannedVisit) {
        // Auto-populate location information
        form.setValue("location", plannedVisit.location_name || "");
        form.setValue("state", plannedVisit.location_name || "");

        if (plannedVisit.facility_id) {
          form.setValue("facility", plannedVisit.facility_id);
          setSelectedFacility(plannedVisit.facility_id);
        }

        // Auto-populate title based on plan and visit type
        const autoTitle = `${plannedVisit.visit_type.replace('_', ' ')} - ${plannedVisit.location_name}`;
        form.setValue("title", autoTitle);

        // Set visit type based on planned visit
        form.setValue("visit_type", plannedVisit.visit_type as SiteVisitType);

        // Set reason for travel
        const reason = `Planned ${plannedVisit.visit_type.replace('_', ' ')} visit as per Annual Supervision Plan: ${selectedPlanData?.title}`;
        form.setValue("purpose", reason);
      }
    }
  }, [selectedPlannedVisit, plannedVisits, selectedPlanData, form]);

  // Update selected facility when form field changes
  useEffect(() => {
    setSelectedFacility(facilityId);
  }, [facilityId]);

  // Auto-populate location and state when facility is selected
  useEffect(() => {
    if (facilityData?.data) {
      // Don't auto-set location from facility name - user should select proper location
      // Only set state and LGA from facility data
      setValue("state", facilityData.data.state);
      setValue("lga", facilityData.data.lga || "");
    }
  }, [facilityData, setValue]);

  // Handle travel fees updates from calculator
  const handleTravelFeesUpdate = useCallback((fees: TravelFees, totalCost: number) => {
    setTravelFees(fees);
    setValue("travel_fees", fees);
  }, []); // Removed setValue dependency to prevent infinite loop

  const onSubmit: SubmitHandler<TSiteVisitApplicationFormValues> = async (
    data: TSiteVisitApplicationFormValues
  ) => {

    try {
      // Format dates to YYYY-MM-DD format
      const formatDate = (date: any) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split('T')[0]; // YYYY-MM-DD format
      };

      // Include annual plan and planned visit references if selected
      const submissionData = {
        ...data,
        // Format dates properly
        start_date: formatDate(data.start_date),
        end_date: formatDate(data.end_date),
        // Handle project field - convert "none" to null
        project: data.project === "none" ? null : data.project,
        // Set initial status for new site visits
        status: SiteVisitStatus.DRAFT,
        // Add references to annual plan and planned visit
        annual_supervision_plan_id: selectedPlan || null,
        planned_visit_id: selectedPlannedVisit || null,
        // Include travel fees data
        travel_fees: data.travel_fees || travelFees,
      };

      // Use mutateAsync to properly handle success/error
      const result = await createSiteVisit.mutateAsync(submissionData);

      toast.success("Site Visit application submitted successfully!");

      // Redirect to site visit list
      router.push(RouteEnum.PROGRAM_SITE_VISIT || "/dashboard/programs/plan/site-visit");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit site visit application"
      );
    }
  };

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Site Visit", icon: false },
    { name: "Create", icon: false },
  ];

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Create Site Visit Application</h2>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit, (errors) => {
            })} className="space-y-6">

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Basic Information</h3>

                <FormInput
                  name="title"
                  label="Site Visit Title"
                  placeholder="Enter site visit title"
                  required
                />

                <FormSelect
                  name="visit_type"
                  label="Site Visit Type"
                  placeholder="Select site visit type"
                  required
                >
                  <SelectContent>
                    {Object.entries(SiteVisitType).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {SiteVisitTypeLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>

                {/* Annual Plan Selection for Supervision Visits */}
                {(siteVisitType === SiteVisitType.SUPPORTIVE_SUPERVISION ||
                  siteVisitType === SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION ||
                  siteVisitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION) && (
                  <div className="space-y-4 border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
                    <h4 className="font-medium text-blue-800">Link to Annual Supervision Plan</h4>
                    <p className="text-sm text-blue-600">
                      Select from approved annual supervision plans to auto-populate visit details
                    </p>

                    <FormSelect
                      name="annual_plan"
                      label="Annual Supervision Plan (Optional)"
                      placeholder="Select an approved plan"
                      value={selectedPlan}
                      onValueChange={setSelectedPlan}
                    >
                      <SelectContent>
                        {isPlansLoading ? (
                          <div className="p-2">
                            <LoadingSpinner />
                          </div>
                        ) : approvedPlans.length > 0 ? (
                          approvedPlans.map((plan: any) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.title} ({plan.financial_year_display})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-plans" disabled>
                            No approved plans available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </FormSelect>

                    {selectedPlan && plannedVisits.length > 0 && (
                      <FormSelect
                        name="planned_visit"
                        label="Planned Visit (Optional)"
                        placeholder="Select a planned visit"
                        value={selectedPlannedVisit}
                        onValueChange={setSelectedPlannedVisit}
                      >
                        <SelectContent>
                          {plannedVisits
                            .filter((visit: any) =>
                              visit.visit_type === siteVisitType ||
                              (siteVisitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION &&
                               visit.visit_type === SiteVisitType.SUPPORTIVE_SUPERVISION)
                            )
                            .map((visit: any) => (
                              <SelectItem key={visit.id} value={visit.id}>
                                {visit.location_name} - Q{visit.planned_quarter || '?'}
                                {visit.facility_name && ` (${visit.facility_name})`}
                              </SelectItem>
                            ))}
                          {plannedVisits
                            .filter((visit: any) =>
                              visit.visit_type === siteVisitType ||
                              (siteVisitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION &&
                               visit.visit_type === SiteVisitType.SUPPORTIVE_SUPERVISION)
                            ).length === 0 && (
                              <SelectItem value="no-visits" disabled>
                                No matching planned visits found
                              </SelectItem>
                            )}
                        </SelectContent>
                      </FormSelect>
                    )}

                    {selectedPlannedVisit && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        ✅ Form fields will be auto-populated from the selected planned visit
                      </div>
                    )}
                  </div>
                )}

                {siteVisitType === SiteVisitType.OTHER && (
                  <FormField
                    control={form.control}
                    name="other_type_description"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Other Type Description *</Label>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe the other type of site visit"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Location Information</h3>

                <FormSelect
                  name="facility"
                  label="Facility (Optional)"
                  placeholder="Select facility if applicable"
                >
                  <SelectContent>
                    {isFacilityLoading ? (
                      <LoadingSpinner />
                    ) : (
                      facility?.data?.results?.map((value: any) => (
                        <SelectItem key={value?.id} value={value?.id}>
                          {value?.name} - {value?.state}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </FormSelect>

                {facilityData?.data && (
                  <Card className="border-yellow-600 p-4">
                    <h4 className="font-medium mb-2">Facility Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">State:</span> {facilityData.data.state}
                      </div>
                      <div>
                        <span className="font-medium">LGA:</span> {facilityData.data.lga}
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span> {facilityData.data.contact_person}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {facilityData.data.email}
                      </div>
                    </div>
                  </Card>
                )}

                <FormSelect
                  name="location"
                  label="Location"
                  placeholder="Select location"
                  required
                >
                  <SelectContent>
                    {isLocationsLoading ? (
                      <div className="p-2">
                        <LoadingSpinner />
                      </div>
                    ) : locationsData?.data?.results?.length > 0 ? (
                      locationsData.data.results.map((location: any) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-locations" disabled>
                        No locations available
                      </SelectItem>
                    )}
                  </SelectContent>
                </FormSelect>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="state"
                    label="State"
                    placeholder="Enter state"
                    required
                  />
                  <FormInput
                    name="lga"
                    label="LGA"
                    placeholder="Enter LGA"
                  />
                </div>
              </div>

              {/* Purpose and Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Purpose & Details</h3>

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Purpose *</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Explain the purpose of this site visit"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expected_outcome"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Expected Outcome *</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the expected outcomes and deliverables"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Travel Dates</h3>

                <div className="grid grid-cols-2 gap-4">
                  <DateInput
                    name="start_date"
                    label="Proposed Start Date"
                    required
                  />
                  <DateInput
                    name="end_date"
                    label="Proposed End Date"
                    required
                  />
                </div>
              </div>

              {/* Travel Fees */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Travel Fees</h3>
                <p className="text-sm text-gray-600">
                  Configure travel costs for this site visit. Fees will be auto-calculated based on location and dates, or you can manually override them.
                </p>

                <TravelFeesCalculator
                  locationName={location || ""}
                  state={state || ""}
                  startDate={startDate || ""}
                  endDate={endDate || ""}
                  teamMembersCount={teamMembers.length || 1}
                  onFeesUpdate={handleTravelFeesUpdate}
                  readOnly={false}
                />
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Team Members</h3>

                <FormField
                  control={form.control}
                  name="team_members"
                  render={({ field }) => {
                    const transformedOptions = (ahniStaffUsers || []).map((user: any) => ({
                      id: user.id,
                      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown User'
                    }));

                    const selectedUserIds = field.value?.map((member: any) => member.user) || [];

                    return (
                      <FormItem>
                        <Label>Select Team Members *</Label>
                        <FormControl>
                          <MultiSelectFormField
                            options={transformedOptions}
                            defaultValue={selectedUserIds}
                            onValueChange={useCallback((selectedIds) => {
                              // Transform selected IDs into the expected schema format
                              const teamMembersData = (selectedIds || []).map((userId: string) => ({
                                user: userId,
                                role: TeamMemberRole.SUPPORT_STAFF, // Default role
                                per_day_allowance: 0,
                                transport_cost: 0,
                                accommodation_cost: 0,
                                comments: ""
                              }));
                              field.onChange(teamMembersData);
                            }, [field.onChange])}
                            placeholder="Select team members for this site visit"
                            variant="inverted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              {/* Approval Workflow */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Approval Workflow</h3>
                <p className="text-sm text-gray-600">
                  Select the reviewer, authorizer, and approver for this site visit application.
                </p>

                <FormSelect
                  name="reviewer"
                  label="Reviewer"
                  placeholder="Select reviewer"
                  required
                >
                  <SelectContent>
                    {ahniStaffUsers?.map((value: any) => (
                      <SelectItem key={value?.id} value={value?.id}>
                        {value?.first_name} {value?.last_name} ({value?.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>

                <FormSelect
                  name="authorizer"
                  label="Authorizer"
                  placeholder="Select authorizer"
                  required
                >
                  <SelectContent>
                    {ahniStaffUsers?.map((value: any) => (
                      <SelectItem key={value?.id} value={value?.id}>
                        {value?.first_name} {value?.last_name} ({value?.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>

                <FormSelect
                  name="approver"
                  label="Final Approver"
                  placeholder="Select final approver"
                  required
                >
                  <SelectContent>
                    {ahniStaffUsers?.map((value: any) => (
                      <SelectItem key={value?.id} value={value?.id}>
                        {value?.first_name} {value?.last_name} ({value?.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Additional Information</h3>

                <FormSelect
                  name="project"
                  label="Related Project"
                  placeholder="Select project (optional)"
                >
                  <SelectContent>
                    {isProjectsLoading ? (
                      <div className="p-2">
                        <LoadingSpinner />
                      </div>
                    ) : projectsData?.data?.results?.length > 0 ? (
                      [
                        <SelectItem key="no-project" value="none">
                          No Project
                        </SelectItem>,
                        ...projectsData.data.results.map((project: any) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title} ({project.project_code || 'No Code'})
                          </SelectItem>
                        ))
                      ]
                    ) : (
                      <SelectItem value="no-projects" disabled>
                        No projects available
                      </SelectItem>
                    )}
                  </SelectContent>
                </FormSelect>

                <FormField
                  control={form.control}
                  name="additional_comments"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Additional Comments</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional information or special requirements"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  size="lg"
                >
                  Cancel
                </Button>
                <FormButton
                  type="submit"
                  size="lg"
                  disabled={isCreating}
                  onClick={(e) => {
                    // Let the form handle the submit
                  }}
                >
                  {isCreating ? "Submitting..." : "Submit Application"}
                </FormButton>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SiteVisitCreate;