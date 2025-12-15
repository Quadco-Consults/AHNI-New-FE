"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Separator } from "components/ui/separator";
import { Badge } from "components/ui/badge";
import { CalendarIcon, UsersIcon, MapPinIcon, DollarSignIcon } from "lucide-react";
import BreadcrumbCard from "components/Breadcrumb";
import { RouteEnum } from "constants/RouterConstants";

// Types and Schema
import {
  SiteVisitApplicationSchema,
  TSiteVisitApplicationFormValues,
  SiteVisitType,
  SiteVisitTypeLabels,
  TeamMemberRole,
  SiteVisitStatus,
} from "@/features/programs/types/site-visit";

// Controllers
import { useCreateSiteVisit } from "@/features/programs/controllers/siteVisitController";
import { useGetAllFacility } from "@/features/modules/controllers/program/facilityController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllAnnualPlans } from "@/features/programs/controllers/annualSupervisionPlanController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";

// Form Sections
import BasicInfoSection from "./form-sections/BasicInfoSection";
import LocationSection from "./form-sections/LocationSection";
import DatesSection from "./form-sections/DatesSection";
import TeamMembersSection from "./form-sections/TeamMembersSection";
import TravelFeesSection from "./form-sections/TravelFeesSection";
import ApprovalWorkflowSection from "./form-sections/ApprovalWorkflowSection";
import AdditionalInfoSection from "./form-sections/AdditionalInfoSection";
import PlanLinkingSection from "./form-sections/PlanLinkingSection";

// Utils
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { AnnualPlanStatus } from "@/features/programs/types/annual-supervision-plan";

interface SiteVisitFormNewProps {
  mode?: 'create' | 'edit';
  initialData?: Partial<TSiteVisitApplicationFormValues>;
  siteVisitId?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

const SiteVisitFormNew: React.FC<SiteVisitFormNewProps> = ({
  mode = 'create',
  initialData,
  siteVisitId,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedPlannedVisit, setSelectedPlannedVisit] = useState<string>("");

  // API Calls
  const createSiteVisit = useCreateSiteVisit();

  // Data fetching hooks - all stable without dependencies that cause re-renders
  const { data: facilitiesData } = useGetAllFacility({ page: 1, size: 1000 });
  const { data: annualPlansData } = useGetAllAnnualPlans({ page: 1, size: 1000 });
  const { data: locationsData } = useGetAllLocations({ page: 1, size: 1000 });
  const { data: projectsData } = useGetAllProjects({ page: 1, size: 1000 });
  const { data: usersData } = useGetAllUsers({ page: 1, size: 1000 });

  // Form initialization
  const form = useForm<TSiteVisitApplicationFormValues>({
    resolver: zodResolver(SiteVisitApplicationSchema),
    defaultValues: {
      title: initialData?.title || "",
      visit_type: initialData?.visit_type || SiteVisitType.SUPPORTIVE_SUPERVISION,
      other_visit_type: initialData?.other_visit_type || "",
      purpose: initialData?.purpose || "",
      location: initialData?.location || "",
      facility: initialData?.facility || "no-facility",
      state: initialData?.state || "",
      lga: initialData?.lga || "",
      specific_address: initialData?.specific_address || "",
      start_date: initialData?.start_date || "",
      end_date: initialData?.end_date || "",
      project: initialData?.project || "none",
      estimated_budget: initialData?.estimated_budget || 0,
      special_requirements: initialData?.special_requirements || "",
      expected_outcomes: initialData?.expected_outcomes || "",
      comments: initialData?.comments || "",
      team_members: initialData?.team_members || [],
      travel_fees: initialData?.travel_fees || {
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
      reviewer: initialData?.reviewer || "",
      authorizer: initialData?.authorizer || "",
      approver: initialData?.approver || "",
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // Watch visit type changes to clear facility when switching from supervision to non-supervision
  const visitType = form.watch("visit_type");

  useEffect(() => {
    const isSupportiveSupervision = visitType === SiteVisitType.SUPPORTIVE_SUPERVISION ||
                                   visitType === SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION ||
                                   visitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION;

    // If switching to non-supportive supervision, clear facility field
    if (!isSupportiveSupervision) {
      form.setValue("facility", "no-facility");
      // Also clear state and LGA if they were auto-populated from facility
      const currentFacility = form.getValues("facility");
      if (currentFacility && currentFacility !== "no-facility") {
        form.setValue("state", "");
        form.setValue("lga", "");
      }
    }
  }, [visitType]); // Removed form from dependencies to prevent infinite loop

  // Processed data - memoized to prevent re-renders
  const facilities = React.useMemo(
    () => facilitiesData?.data?.results || [],
    [facilitiesData]
  );

  const locations = React.useMemo(
    () => locationsData?.data?.results || [],
    [locationsData]
  );

  const projects = React.useMemo(
    () => projectsData?.data?.results || [],
    [projectsData]
  );

  const approvedPlans = React.useMemo(
    () => (annualPlansData?.data?.results || []).filter((plan: any) =>
      plan.status === AnnualPlanStatus.APPROVED || plan.status === AnnualPlanStatus.ACTIVE
    ),
    [annualPlansData]
  );

  // IMPORTANT FIX: Only use users from user table, NOT employee database
  // Site visit backend expects user UUIDs, not employee record IDs
  // Mixing employee data causes UUID mismatch errors like:
  // "Invalid pk ef7f95b2-53f1-4581-b239-e930eec334f4 - object does not exist"
  const allStaff = React.useMemo(() => {
    const users = filterAhniStaffOnly((usersData?.data?.results || []) as any[]);
    return users;
  }, [usersData]);

  // Get selected plan details
  const selectedPlanData = React.useMemo(
    () => approvedPlans.find((plan: any) => plan.id === selectedPlan),
    [approvedPlans, selectedPlan]
  );

  const plannedVisits = React.useMemo(
    () => selectedPlanData?.planned_visits || [],
    [selectedPlanData]
  );

  // Plan linking handlers
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setSelectedPlannedVisit(""); // Reset planned visit when plan changes
  };

  const handlePlannedVisitSelect = (visitId: string) => {
    setSelectedPlannedVisit(visitId);

    if (visitId) {
      const plannedVisit = plannedVisits.find((visit: any) => visit.id === visitId);
      if (plannedVisit) {
        // Auto-populate form fields
        form.setValue("location", plannedVisit.location_name || "");
        form.setValue("title", `${plannedVisit.visit_type.replace('_', ' ')} - ${plannedVisit.location_name}`);
        form.setValue("visit_type", plannedVisit.visit_type as SiteVisitType);
        form.setValue("purpose", `Planned ${plannedVisit.visit_type.replace('_', ' ')} visit as per Annual Supervision Plan: ${selectedPlanData?.title}`);

        if (plannedVisit.facility_id) {
          form.setValue("facility", plannedVisit.facility_id);
        }
      }
    }
  };

  // Form submission
  const onSubmit = async (data: TSiteVisitApplicationFormValues) => {
    try {
      // Format dates
      const formatDate = (date: any) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split('T')[0];
      };

      const submissionData = {
        ...data,
        start_date: formatDate(data.start_date),
        end_date: formatDate(data.end_date),
        project: data.project === "none" ? null : data.project,
        facility: data.facility === "no-facility" ? null : data.facility,
        // Use state as location since backend expects location field but we're using state names
        location: data.state,
        status: SiteVisitStatus.DRAFT,
        annual_supervision_plan_id: selectedPlan || null,
        planned_visit_id: selectedPlannedVisit || null,
      };

      const result = await createSiteVisit.mutateAsync(submissionData);

      toast.success("Site Visit application submitted successfully!");

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(RouteEnum.PROGRAM_SITE_VISIT || "/dashboard/programs/plan/site-visit");
      }

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit site visit application"
      );
    }
  };

  // Tab validation
  const isTabComplete = (tabId: string): boolean => {
    const formState = form.formState;
    const values = form.getValues();

    switch (tabId) {
      case 'basic':
        return !!(values.title && values.visit_type && values.purpose);
      case 'location':
        return !!(values.location);
      case 'dates':
        return !!(values.start_date && values.end_date);
      case 'team':
        return values.team_members.length > 0;
      case 'travel':
        return values.travel_fees.total_per_person > 0;
      case 'approval':
        return !!(values.reviewer && values.authorizer && values.approver);
      case 'additional':
        return true; // Optional section
      default:
        return false;
    }
  };

  const isSupervisionVisit = () => {
    const visitType = form.watch("visit_type");
    return [
      SiteVisitType.SUPPORTIVE_SUPERVISION,
      SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION,
      SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION
    ].includes(visitType);
  };

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Site Visit", icon: false },
    { name: mode === 'create' ? "Create" : "Edit", icon: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbCard list={breadcrumbs} />

        <div className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
                {mode === 'create' ? 'Create Site Visit Application' : 'Edit Site Visit Application'}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Request approval for AHNI staff travel. Complete all required sections to submit your application.
              </p>
            </CardHeader>

            <CardContent className="p-0">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tab Navigation */}
                    <div className="border-b bg-white px-6 pt-6">
                      <TabsList className="grid w-full grid-cols-7 gap-1">
                        <TabsTrigger
                          value="basic"
                          className="flex items-center gap-2 text-sm"
                          data-complete={isTabComplete('basic')}
                        >
                          <div className={`w-2 h-2 rounded-full ${isTabComplete('basic') ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Basic Info
                        </TabsTrigger>

                        <TabsTrigger
                          value="location"
                          className="flex items-center gap-2 text-sm"
                          data-complete={isTabComplete('location')}
                        >
                          <div className={`w-2 h-2 rounded-full ${isTabComplete('location') ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Location
                        </TabsTrigger>

                        <TabsTrigger
                          value="dates"
                          className="flex items-center gap-2 text-sm"
                          data-complete={isTabComplete('dates')}
                        >
                          <div className={`w-2 h-2 rounded-full ${isTabComplete('dates') ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Dates
                        </TabsTrigger>

                        <TabsTrigger
                          value="team"
                          className="flex items-center gap-2 text-sm"
                          data-complete={isTabComplete('team')}
                        >
                          <div className={`w-2 h-2 rounded-full ${isTabComplete('team') ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Team
                        </TabsTrigger>

                        <TabsTrigger
                          value="travel"
                          className="flex items-center gap-2 text-sm"
                          data-complete={isTabComplete('travel')}
                        >
                          <div className={`w-2 h-2 rounded-full ${isTabComplete('travel') ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Travel Fees
                        </TabsTrigger>

                        <TabsTrigger
                          value="approval"
                          className="flex items-center gap-2 text-sm"
                          data-complete={isTabComplete('approval')}
                        >
                          <div className={`w-2 h-2 rounded-full ${isTabComplete('approval') ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Approval
                        </TabsTrigger>

                        <TabsTrigger
                          value="additional"
                          className="flex items-center gap-2 text-sm"
                          data-complete={isTabComplete('additional')}
                        >
                          <div className={`w-2 h-2 rounded-full ${isTabComplete('additional') ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Additional
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {/* Basic Information Tab */}
                      <TabsContent value="basic" className="space-y-6 mt-0">
                        <BasicInfoSection />

                        {/* Plan Linking for Supervision Visits */}
                        {isSupervisionVisit() && (
                          <PlanLinkingSection
                            approvedPlans={approvedPlans}
                            selectedPlan={selectedPlan}
                            selectedPlannedVisit={selectedPlannedVisit}
                            plannedVisits={plannedVisits}
                            selectedPlanData={selectedPlanData}
                            onPlanSelect={handlePlanSelect}
                            onPlannedVisitSelect={handlePlannedVisitSelect}
                            visitType={form.watch("visit_type")}
                          />
                        )}
                      </TabsContent>

                      {/* Location Tab */}
                      <TabsContent value="location" className="space-y-6 mt-0">
                        <LocationSection
                          facilities={facilities}
                          locations={locations}
                        />
                      </TabsContent>

                      {/* Dates Tab */}
                      <TabsContent value="dates" className="space-y-6 mt-0">
                        <DatesSection />
                      </TabsContent>

                      {/* Team Members Tab */}
                      <TabsContent value="team" className="space-y-6 mt-0">
                        <TeamMembersSection
                          allStaff={allStaff}
                        />
                      </TabsContent>

                      {/* Travel Fees Tab */}
                      <TabsContent value="travel" className="space-y-6 mt-0">
                        <TravelFeesSection />
                      </TabsContent>

                      {/* Approval Workflow Tab */}
                      <TabsContent value="approval" className="space-y-6 mt-0">
                        <ApprovalWorkflowSection
                          allStaff={allStaff}
                        />
                      </TabsContent>

                      {/* Additional Information Tab */}
                      <TabsContent value="additional" className="space-y-6 mt-0">
                        <AdditionalInfoSection
                          projects={projects}
                        />
                      </TabsContent>
                    </div>

                    {/* Navigation and Submit */}
                    <div className="border-t bg-gray-50 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => onCancel ? onCancel() : router.back()}
                          className="flex items-center gap-2"
                        >
                          Cancel
                        </Button>

                        <div className="flex items-center gap-3">
                          {/* Progress Indicator */}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="flex gap-1">
                              {['basic', 'location', 'dates', 'team', 'travel', 'approval', 'additional'].map((tab) => (
                                <div
                                  key={tab}
                                  className={`w-2 h-2 rounded-full ${
                                    isTabComplete(tab) ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span>
                              {['basic', 'location', 'dates', 'team', 'travel', 'approval', 'additional'].filter(isTabComplete).length} of 7 required sections complete
                            </span>
                          </div>

                          {/* Step Navigation */}
                          {(() => {
                            const tabs = ['basic', 'location', 'dates', 'team', 'travel', 'approval', 'additional'];
                            const currentIndex = tabs.indexOf(activeTab);
                            const isLastStep = currentIndex === tabs.length - 1;
                            const isFirstStep = currentIndex === 0;

                            return (
                              <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                {!isFirstStep && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setActiveTab(tabs[currentIndex - 1])}
                                    className="px-4"
                                  >
                                    Previous
                                  </Button>
                                )}

                                {/* Next Button or Submit Button */}
                                {!isLastStep ? (
                                  <Button
                                    type="button"
                                    onClick={() => setActiveTab(tabs[currentIndex + 1])}
                                    disabled={!isTabComplete(activeTab)}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6"
                                  >
                                    Next
                                  </Button>
                                ) : (
                                  <Button
                                    type="submit"
                                    disabled={
                                      createSiteVisit.isPending ||
                                      ['basic', 'location', 'dates', 'team', 'travel', 'approval', 'additional'].some(tab => !isTabComplete(tab))
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                                  >
                                    {createSiteVisit.isPending ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                      </div>
                                    ) : (
                                      'Submit Application'
                                    )}
                                  </Button>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </Tabs>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SiteVisitFormNew;