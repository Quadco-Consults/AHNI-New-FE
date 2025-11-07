"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Textarea } from "components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Target,
  Users,
  CheckCircle2,
  AlertCircle,
  Save,
  FileText,
} from "lucide-react";

import { useGetAllFinancialYears } from "@/features/modules/controllers";
import { useCreateAnnualPlanManual } from "@/features/programs/controllers/annualSupervisionPlanController";
import { useGetAllLocationsManager } from "@/features/modules/controllers/config/locationController";
import { useGetAllFacilitiesManager } from "@/features/modules/controllers/program/facilityController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";

// Validation Schema
const PlannedVisitSchema = z.object({
  location_id: z.string().min(1, "Location is required"),
  location_name: z.string().min(1, "Location name is required"), // REQUIRED for backend
  location_code: z.string().optional(), // Will be populated automatically
  facility_id: z.string().optional(),
  facility_name: z.string().optional(), // Will be populated automatically
  visit_type: z.enum(["SUPPORTIVE_SUPERVISION", "INTEGRATED_SUPPORTIVE_SUPERVISION"], {
    required_error: "Visit type is required",
  }),
  requires_evaluation: z.enum(["YES", "NO"], {
    required_error: "Evaluation requirement is required",
  }),
  preferred_quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]).optional(),
  duration_days: z.number().min(1).max(30).optional(),
});

const ManualAnnualPlanSchema = z.object({
  financial_year_id: z.string().min(1, "Financial year is required"),
  title: z.string().min(1, "Plan title is required"),
  description: z.string().optional(),
  reviewer_id: z.string().optional(),
  authorizer_id: z.string().optional(),
  approver_id: z.string().optional(),
  planned_visits: z.array(PlannedVisitSchema).min(1, "At least one planned visit is required"),
});

type ManualAnnualPlanFormData = z.infer<typeof ManualAnnualPlanSchema>;

interface AnnualPlanManualFormProps {
  onSuccess?: (result: any) => void;
  onCancel?: () => void;
}

const AnnualPlanManualForm = ({ onSuccess, onCancel }: AnnualPlanManualFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Fetch financial years
  const { data: financialYearsData, isLoading: isLoadingFinancialYears } = useGetAllFinancialYears({
    page: 1,
    size: 100,
  });

  // Fetch locations
  const { data: locationsData, isLoading: isLoadingLocations } = useGetAllLocationsManager({
    page: 1,
    size: 1000, // Get all locations
  });

  // Fetch facilities
  const { data: facilitiesData, isLoading: isLoadingFacilities } = useGetAllFacilitiesManager({
    page: 1,
    size: 1000, // Get all facilities
  });

  // Fetch users for workflow role assignments
  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsers({
    page: 1,
    size: 1000, // Get all users
  });

  // Mutations
  const createAnnualPlanMutation = useCreateAnnualPlanManual();

  // Form setup
  const form = useForm<ManualAnnualPlanFormData>({
    resolver: zodResolver(ManualAnnualPlanSchema),
    defaultValues: {
      financial_year_id: "",
      title: "",
      description: "",
      reviewer_id: "none",
      authorizer_id: "none",
      approver_id: "none",
      planned_visits: [
        {
          location_id: "",
          location_name: "",
          location_code: "",
          facility_id: "",
          facility_name: "",
          visit_type: "SUPPORTIVE_SUPERVISION",
          requires_evaluation: "YES",
          preferred_quarter: "Q1",
          duration_days: 3,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "planned_visits",
  });

  const financialYears = financialYearsData?.data?.results || [];
  const locations = locationsData?.data?.results || [];
  const facilities = facilitiesData?.data?.results || [];
  const users = usersData?.data?.results || [];

  const handleNext = async () => {
    let fieldsToValidate: string[] = [];

    // Define which fields to validate for each step
    if (currentStep === 1) {
      fieldsToValidate = ["financial_year_id", "title"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["planned_visits"];
      // Also validate that each visit has required fields
      const visits = form.getValues("planned_visits");
      const hasValidVisits = visits.every((visit: any) =>
        visit.location_id &&
        visit.location_name &&
        visit.visit_type
      );
      if (!hasValidVisits) {
        console.log("❌ Some visits are missing required fields (location_id, location_name, visit_type)");
        return;
      }
    }

    console.log(`🔍 Validating step ${currentStep} fields:`, fieldsToValidate);

    const isValid = await form.trigger(fieldsToValidate as any);
    console.log(`✅ Step ${currentStep} validation result:`, isValid);

    if (isValid && currentStep < totalSteps) {
      console.log(`🚀 Moving from step ${currentStep} to step ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    } else {
      console.log(`❌ Validation failed for step ${currentStep}:`, form.formState.errors);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addPlannedVisit = () => {
    append({
      location_id: "",
      location_name: "",
      location_code: "",
      facility_id: "",
      facility_name: "",
      visit_type: "SUPPORTIVE_SUPERVISION",
      requires_evaluation: "YES",
      preferred_quarter: "Q1",
      duration_days: 3,
    });
  };

  const handleLocationChange = (locationId: string, visitIndex: number) => {
    const selectedLocation = locations.find((loc: any) => loc.id === locationId);
    if (selectedLocation) {
      form.setValue(`planned_visits.${visitIndex}.location_id`, locationId);
      form.setValue(`planned_visits.${visitIndex}.location_name`, selectedLocation.name);
      form.setValue(`planned_visits.${visitIndex}.location_code`, selectedLocation.code || "");
      // Clear facility when location changes
      form.setValue(`planned_visits.${visitIndex}.facility_id`, "");
      form.setValue(`planned_visits.${visitIndex}.facility_name`, "");
    }
  };

  const handleFacilityChange = (facilityId: string, visitIndex: number) => {
    if (facilityId === "none") {
      form.setValue(`planned_visits.${visitIndex}.facility_id`, "");
      form.setValue(`planned_visits.${visitIndex}.facility_name`, "");
    } else {
      const selectedFacility = facilities.find((fac: any) => fac.id === facilityId);
      if (selectedFacility) {
        form.setValue(`planned_visits.${visitIndex}.facility_id`, facilityId);
        form.setValue(`planned_visits.${visitIndex}.facility_name`, selectedFacility.name);
      } else {
        form.setValue(`planned_visits.${visitIndex}.facility_id`, "");
        form.setValue(`planned_visits.${visitIndex}.facility_name`, "");
      }
    }
  };

  // Filter facilities by selected location
  const getFacilitiesForLocation = (locationId: string) => {
    if (!locationId) return facilities;
    return facilities.filter((facility: any) => facility.location === locationId);
  };

  const removePlannedVisit = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one planned visit is required");
    }
  };

  const handleSubmit = async (data: ManualAnnualPlanFormData) => {
    try {
      console.log("🚀 Starting manual form submission...");
      console.log("📊 Form data:", data);
      console.log("📋 Planned visits details:", data.planned_visits);

      // Manual Form -> JSON API (Direct, Proper Solution)
      console.log("🚀 Sending JSON data to manual endpoint...");

      // Send JSON data directly to manual endpoint
      const result = await createAnnualPlanMutation.mutateAsync({
        financial_year_id: data.financial_year_id,
        title: data.title,
        description: data.description,
        reviewer_id: data.reviewer_id === "none" ? null : data.reviewer_id,
        authorizer_id: data.authorizer_id === "none" ? null : data.authorizer_id,
        approver_id: data.approver_id === "none" ? null : data.approver_id,
        planned_visits: data.planned_visits.map(visit => ({
          location_id: visit.location_id,
          location_name: visit.location_name,
          location_code: visit.location_code || "",
          facility_id: visit.facility_id || "",
          facility_name: visit.facility_name || "",
          visit_type: visit.visit_type,
          requires_evaluation: visit.requires_evaluation,
          preferred_quarter: visit.preferred_quarter,
          duration_days: visit.duration_days
        }))
      });

      console.log("✅ Manual form success via JSON API:", result);
      toast.success("Annual supervision plan created successfully!");

      if (onSuccess) {
        onSuccess(result);
      }

    } catch (error: any) {
      console.error("❌ Submission error:", error);
      console.error("📊 Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers
      });

      let errorMessage = "Failed to create annual plan";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("🚨 Final error message:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((step) => {
        const status = getStepStatus(step);
        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                status === "completed"
                  ? "bg-green-600 text-white"
                  : status === "current"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div
                className={`w-20 h-1 mx-4 ${
                  step < currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // Debug: Watch form values (only show on submission)
  // const watchedValues = form.watch();
  // console.log("📝 Current form values:", watchedValues);

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Plan Information
        </CardTitle>
        <p className="text-gray-600">
          Set up basic information for your annual supervision plan
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Year Selection */}
          <FormField
            control={form.control}
            name="financial_year_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Year *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select financial year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingFinancialYears ? (
                      <SelectItem value="loading" disabled>
                        Loading financial years...
                      </SelectItem>
                    ) : financialYears.length > 0 ? (
                      financialYears.map((year: any) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.year} ({year.start_date} - {year.end_date})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        No financial years available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Plan Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Title *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Annual Supervision Plan 2024-2025"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Brief description of the annual supervision plan objectives and scope..."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Workflow Role Assignments */}
        <div className="space-y-4">
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Workflow Assignments (Optional)
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Assign users who will review, authorize, and approve this annual supervision plan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reviewer Selection */}
              <FormField
                control={form.control}
                name="reviewer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reviewer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reviewer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No reviewer assigned</SelectItem>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>
                            Loading users...
                          </SelectItem>
                        ) : users.length > 0 ? (
                          users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || `${user.first_name} ${user.last_name}`}
                              {user.designation && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({user.designation})
                                </span>
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            No users available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Authorizer Selection */}
              <FormField
                control={form.control}
                name="authorizer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorizer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select authorizer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No authorizer assigned</SelectItem>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>
                            Loading users...
                          </SelectItem>
                        ) : users.length > 0 ? (
                          users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || `${user.first_name} ${user.last_name}`}
                              {user.designation && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({user.designation})
                                </span>
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            No users available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Approver Selection */}
              <FormField
                control={form.control}
                name="approver_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No approver assigned</SelectItem>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>
                            Loading users...
                          </SelectItem>
                        ) : users.length > 0 ? (
                          users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || `${user.first_name} ${user.last_name}`}
                              {user.designation && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({user.designation})
                                </span>
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            No users available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Planned Visits
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Add supervision visits for different locations
            </p>
          </div>
          <Button onClick={addPlannedVisit} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Visit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Visit {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePlannedVisit(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`planned_visits.${index}.location_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleLocationChange(value, index);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingLocations ? (
                              <SelectItem value="loading" disabled>
                                Loading locations...
                              </SelectItem>
                            ) : locations.length > 0 ? (
                              locations.map((location: any) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name} {location.code && `(${location.code})`}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-data" disabled>
                                No locations available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`planned_visits.${index}.location_code`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Auto-populated"
                            readOnly
                            className="bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`planned_visits.${index}.facility_id`}
                    render={({ field }) => {
                      const currentLocationId = form.watch(`planned_visits.${index}.location_id`);
                      const filteredFacilities = getFacilitiesForLocation(currentLocationId);

                      return (
                        <FormItem>
                          <FormLabel>Facility</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleFacilityChange(value, index);
                            }}
                            defaultValue={field.value}
                            disabled={!currentLocationId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !currentLocationId
                                      ? "Select location first"
                                      : "Select facility (optional)"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No specific facility</SelectItem>
                              {isLoadingFacilities ? (
                                <SelectItem value="loading" disabled>
                                  Loading facilities...
                                </SelectItem>
                              ) : filteredFacilities.length > 0 ? (
                                filteredFacilities.map((facility: any) => (
                                  <SelectItem key={facility.id} value={facility.id}>
                                    {facility.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-data" disabled>
                                  No facilities available for this location
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name={`planned_visits.${index}.visit_type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visit Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visit type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SUPPORTIVE_SUPERVISION">
                              Supportive Supervision
                            </SelectItem>
                            <SelectItem value="INTEGRATED_SUPPORTIVE_SUPERVISION">
                              Integrated Supportive Supervision
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`planned_visits.${index}.requires_evaluation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requires Evaluation *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select evaluation requirement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="YES">Yes</SelectItem>
                            <SelectItem value="NO">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`planned_visits.${index}.preferred_quarter`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Quarter</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quarter" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Q1">Q1 (Oct-Dec)</SelectItem>
                            <SelectItem value="Q2">Q2 (Jan-Mar)</SelectItem>
                            <SelectItem value="Q3">Q3 (Apr-Jun)</SelectItem>
                            <SelectItem value="Q4">Q4 (Jul-Sep)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`planned_visits.${index}.duration_days`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Days)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="30"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            placeholder="e.g., 3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => {
    const formData = form.getValues();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            Review & Submit
          </CardTitle>
          <p className="text-gray-600">
            Review your annual supervision plan before submission
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {formData.planned_visits?.length || 0}
              </div>
              <div className="text-sm text-blue-600">Total Visits</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MapPin className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {new Set(formData.planned_visits?.map(v => v.location_name)).size || 0}
              </div>
              <div className="text-sm text-green-600">Unique Locations</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="mx-auto h-8 w-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {formData.planned_visits?.filter(v => v.requires_evaluation === "YES").length || 0}
              </div>
              <div className="text-sm text-purple-600">Require Evaluation</div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Plan Title</h4>
              <p className="text-gray-600">{formData.title}</p>
            </div>

            {formData.description && (
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-gray-600">{formData.description}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Planned Visits</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.planned_visits?.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{visit.location_name}</div>
                      <div className="text-sm text-gray-600">
                        {visit.visit_type.replace('_', ' ')} • {visit.requires_evaluation === "YES" ? "Evaluation Required" : "No Evaluation"}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {visit.preferred_quarter} • {visit.duration_days}d
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Render Current Step */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between">
            <div>
              {onCancel && currentStep === 1 && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < totalSteps && (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
              {currentStep === totalSteps && (
                <Button
                  type="submit"
                  disabled={createAnnualPlanMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createAnnualPlanMutation.isPending ? (
                    <>
                      <LoadingSpinner />
                      Creating Plan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Plan
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnnualPlanManualForm;