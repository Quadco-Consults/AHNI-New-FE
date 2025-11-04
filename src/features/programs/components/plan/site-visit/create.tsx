"use client";

import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/Loading";
import MultiSelectFormField from "components/ui/sspmultiselect";
import { Textarea } from "components/ui/textarea";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Card from "components/Card";
import DateInput from "components/DateInput";
import BreadcrumbCard from "components/Breadcrumb";
import { RouteEnum } from "constants/RouterConstants";

import {
  SiteVisitApplicationSchema,
  TSiteVisitApplicationFormValues,
  SiteVisitType,
  SiteVisitTypeLabels,
} from "@/features/programs/types/site-visit";

import { useCreateSiteVisit } from "@/features/programs/controllers/siteVisitController";

import {
  useGetAllFacility,
  useGetSingleFacilityManager,
} from "@/features/modules/controllers/program/facilityController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";

const SiteVisitCreate = () => {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState<string>("");

  // Site Visit API
  const { createSiteVisit, isLoading: isCreating, isSuccess, error: createError } = useCreateSiteVisit();

  // Fetch facilities
  const { data: facility, isLoading: isFacilityLoading } = useGetAllFacility({
    page: 1,
    size: 2000000,
  });

  // Fetch from both sources: Users table AND Employee database
  const { data: user } = useGetAllUsers({ page: 1, size: 2000000 });

  const { data: employeeData } = useGetEmployeeOnboardings({
    page: 1,
    size: 2000000,
  });

  // Combine users from both sources
  const allStaff = [
    // Users from user table (filter to exclude vendors)
    ...filterAhniStaffOnly((user?.data?.results || []) as any[]),
    // Employees from employee database (all are AHNI staff)
    ...((employeeData?.data?.results || []) as any[]).map((emp: any) => ({
      id: emp.id,
      first_name: emp.legal_firstname || emp.first_name,
      last_name: emp.legal_lastname || emp.last_name,
      email: emp.email,
      user_type: 'STAFF',
      designation: emp.designation?.name || emp.position,
      department: emp.department?.name,
      phone_number: emp.phone_number || emp.mobile_number,
      is_staff: true,
      _source: 'employee_database'
    }))
  ];

  // Remove duplicates based on email
  const uniqueStaff = allStaff.reduce((acc: any[], current: any) => {
    const exists = acc.find(item => item.email === current.email);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  const ahniStaffUsers = uniqueStaff;

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
      site_visit_type: SiteVisitType.SUPPORTIVE_SUPERVISION,
      other_type_description: "",
      travel_reason: "",
      expected_outcome: "",
      proposed_start_date: "",
      proposed_end_date: "",
      team_members: [],
      reviewer: "",
      authorizer: "",
      approver: "",
      additional_comments: "",
      project: "",
    },
  });

  const { handleSubmit, watch, setValue } = form;
  const facilityId = watch("facility");
  const siteVisitType = watch("site_visit_type");

  // Update selected facility when form field changes
  useEffect(() => {
    setSelectedFacility(facilityId);
  }, [facilityId]);

  // Auto-populate location and state when facility is selected
  useEffect(() => {
    if (facilityData?.data) {
      setValue("location", facilityData.data.name);
      setValue("state", facilityData.data.state);
      setValue("lga", facilityData.data.lga || "");
    }
  }, [facilityData, setValue]);

  const onSubmit: SubmitHandler<TSiteVisitApplicationFormValues> = async (
    data: TSiteVisitApplicationFormValues
  ) => {
    try {
      console.log("Site Visit Application Data:", data);

      await createSiteVisit(data);

      if (isSuccess) {
        toast.success("Site Visit application submitted successfully!");
        // Redirect to site visit list
        router.push(RouteEnum.PROGRAM_SITE_VISIT || "/dashboard/programs/plan/site-visit");
      }

    } catch (error: any) {
      console.error("Site Visit creation error:", error);
      toast.error(
        createError?.message ??
        error.message ??
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
                  name="site_visit_type"
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

                {siteVisitType === SiteVisitType.OTHERS && (
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

                <FormInput
                  name="location"
                  label="Location"
                  placeholder="Enter specific location/address"
                  required
                />

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
                  name="travel_reason"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Reason for Travel *</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Explain the reason for this site visit"
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
                    name="proposed_start_date"
                    label="Proposed Start Date"
                    required
                  />
                  <DateInput
                    name="proposed_end_date"
                    label="Proposed End Date"
                    required
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">Team Members</h3>

                <FormField
                  control={form.control}
                  name="team_members"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Select Team Members *</Label>
                      <FormControl>
                        <MultiSelectFormField
                          options={ahniStaffUsers || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select team members for this site visit"
                          variant="inverted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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

                <FormInput
                  name="project"
                  label="Related Project"
                  placeholder="Enter project reference (if applicable)"
                />

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
                <FormButton type="submit" size="lg" disabled={isCreating}>
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