"use client";

import React, { useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import MultiSelectFormField from "@/components/ui/multiselect";
import { SubGrantSchema, TSubGrantFormData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useCreateSubGrant, useUpdateSubGrant, useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { usePublishSubGrant } from "@/features/contracts-grants/controllers/subGrantWorkflowController";
import { useGetAllGrants } from "@/features/contracts-grants/controllers/grantController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { CG_ROUTES } from "@/constants/RouterConstants";
import { Loading } from "@/components/Loading";

const CreateSubGrant: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("editId") || "";
  
  const form = useForm<TSubGrantFormData>({
    resolver: zodResolver(SubGrantSchema),
    defaultValues: {
      project: "",
      title: "",
      award_type: "",
      amount_usd: "",
      amount_ngn: "",
      duration: "",
      start_date: "",
      end_date: "",
      submission_start_date: "",
      submission_end_date: "",
      sub_grant_administrator: "",
      technical_staff: "", // Optional - kept for backend compatibility
      business_unit: "", // Optional - kept for backend compatibility
      locations: [],
    },
  });

  const { createSubGrant, isLoading: isCreating, data: createResponse } = useCreateSubGrant();
  const { updateSubGrant, isLoading: isUpdating } = useUpdateSubGrant(editId);
  const { data: subGrantData, isLoading: isLoadingSubGrant } = useGetSingleSubGrant(editId, !!editId);

  // We'll use this for auto-publishing, but we need the ID first
  const [newSubGrantId, setNewSubGrantId] = React.useState<string>("");
  const { publishSubGrant, isLoading: isPublishing } = usePublishSubGrant(newSubGrantId);

  const isLoading = isCreating || isUpdating || isPublishing;
  const isEditMode = !!editId;

  // Fetch data for dropdowns
  const { data: grantsData, isLoading: grantsLoading, error: grantsError } = useGetAllGrants({ size: 100, enabled: true });
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAllUsers({ size: 100, enabled: true });
  const { data: locationsData, isLoading: locationsLoading, error: locationsError } = useGetAllLocations({ page: 1, size: 2000, enabled: true });


  // Transform data for select options
  const grantOptions = grantsData?.data?.results?.map((grant: any) => ({
    value: grant.id,
    label: grant.title || grant.name // Use title from API, fallback to name
  })) || [];

  const userOptions = (usersData?.data?.results || usersData?.results)
    ?.filter((user: any) => user.first_name && user.last_name) // Filter out users with null names
    ?.map((user: any) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name}`
    })) || [];

  const locationOptions = locationsData?.data?.results || [];

  // Temporary debugging to see API responses
  console.log("=== TEMP DEBUG ===");
  console.log("Grants API Response:", grantsData);
  console.log("Users API Response:", usersData);
  console.log("Locations API Response:", locationsData);
  console.log("API Loading States:", { grantsLoading, usersLoading, locationsLoading });
  console.log("API Errors:", { grantsError, usersError, locationsError });
  console.log("Processed Options:");
  console.log("- Grant Options:", grantOptions, `(${grantOptions.length} items)`);
  console.log("- User Options:", userOptions, `(${userOptions.length} items)`);
  console.log("- Location Options:", locationOptions, `(${locationOptions?.length || 0} items)`);
  console.log("=== END DEBUG ===");

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && subGrantData?.data && !isLoadingSubGrant && !grantsLoading && !usersLoading && !locationsLoading) {
      const data = subGrantData.data;

      console.log("=== EDIT MODE DEBUG ===");
      console.log("Edit ID:", editId);
      console.log("SubGrant Data (full):", data);
      console.log("Project:", data.grant);
      console.log("Grant Administrator:", data.sub_grant_administrator);
      console.log("Locations from API:", data.locations);

      const projectId = typeof data.grant === 'string' ? data.grant : data.grant?.id || "";
      const adminId = typeof data.sub_grant_administrator === 'string' ? data.sub_grant_administrator : data.sub_grant_administrator?.id || "";
      const techStaffId = typeof data.technical_staff === 'string' ? data.technical_staff : data.technical_staff?.id || "";
      const businessUnitId = typeof data.business_unit === 'string' ? data.business_unit : data.business_unit?.id || "";
      const locationIds = Array.isArray(data.locations) ? data.locations.map((loc: any) => typeof loc === 'string' ? loc : loc.id) : [];

      console.log("Extracted IDs:");
      console.log("- Project ID:", projectId);
      console.log("- Grant Admin ID:", adminId);
      console.log("- Location IDs:", locationIds);

      const formData = {
        project: projectId,
        title: data.title || "",
        award_type: data.award_type || "",
        amount_usd: data.amount_usd || "",
        amount_ngn: data.amount_ngn || "",
        duration: data.duration || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        submission_start_date: data.submission_start_date || "",
        submission_end_date: data.submission_end_date || "",
        sub_grant_administrator: adminId,
        technical_staff: techStaffId || "", // Optional field
        business_unit: businessUnitId || "", // Optional field
        locations: locationIds,
      };

      console.log("Form Data to be reset:", formData);
      form.reset(formData);

      // Force update after a short delay to ensure dropdowns re-render
      setTimeout(() => {
        console.log("Form values after reset:", form.getValues());
      }, 100);

      console.log("=== END EDIT MODE DEBUG ===");
    }
  }, [isEditMode, subGrantData, isLoadingSubGrant, grantsLoading, usersLoading, locationsLoading, editId]);

  // Currency conversion rate (USD to NGN) - you might want to fetch this from an API
  const USD_TO_NGN_RATE = 1600; // Example rate

  // Watch for changes in USD amount and convert to NGN
  const usdAmount = form.watch("amount_usd");

  useEffect(() => {
    if (usdAmount && !isNaN(parseFloat(usdAmount)) && !isEditMode) {
      const ngnAmount = (parseFloat(usdAmount) * USD_TO_NGN_RATE).toString();
      form.setValue("amount_ngn", ngnAmount, { shouldValidate: false });
    }
  }, [usdAmount, form, isEditMode]);

  // Auto-publish effect when a new sub-grant is created
  useEffect(() => {
    const handleAutoPublish = async () => {
      if (newSubGrantId && !isEditMode) {
        try {
          await publishSubGrant();
          toast.success("Sub-Grant created and published successfully! Submissions will automatically open/close based on scheduled dates.");

          // Navigate after successful auto-publish
          form.reset();
          router.push(CG_ROUTES.SUBGRANT_ADVERT || "/dashboard/c-and-g/sub-grant");
        } catch (publishError) {
          console.error("Failed to auto-publish:", publishError);
          toast.error("Sub-Grant created successfully, but auto-publish failed. Please publish manually.");

          // Still navigate even if publish fails
          form.reset();
          router.push(CG_ROUTES.SUBGRANT_ADVERT || "/dashboard/c-and-g/sub-grant");
        }
      }
    };

    handleAutoPublish();
  }, [newSubGrantId, publishSubGrant, isEditMode, form, router]);

  const onSubmit: SubmitHandler<TSubGrantFormData> = async (data) => {
    console.log("=== FORM SUBMIT DEBUG ===");
    console.log("Is Edit Mode:", isEditMode);
    console.log("Form Data Being Submitted:", data);
    console.log("Locations in submit:", data.locations);
    console.log("=== END FORM SUBMIT DEBUG ===");

    try {
      if (isEditMode) {
        await updateSubGrant(data);
        toast.success("Sub-Grant updated successfully");
        form.reset();
        router.push(CG_ROUTES.SUBGRANT_ADVERT || "/dashboard/c-and-g/sub-grant");
      } else {
        await createSubGrant(data);

        // Check if we got the response with ID
        if (createResponse?.id) {
          setNewSubGrantId(createResponse.id);
          // Auto-publish will be handled in the useEffect above
        } else {
          toast.success("Sub-Grant created successfully");
          form.reset();
          router.push(CG_ROUTES.SUBGRANT_ADVERT || "/dashboard/c-and-g/sub-grant");
        }
      }
    } catch (error: any) {
      console.error("Submit Error:", error);
      const errorMessage = error?.response?.data?.message || error?.data?.message || error?.message ||
        `Failed to ${isEditMode ? 'update' : 'create'} sub-grant`;
      toast.error(errorMessage);
    }
  };

  if (isLoadingSubGrant && isEditMode) {
    return <Loading />;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <BackNavigation />
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {isEditMode ? "Edit Sub-Grant" : "Create Sub-Grant"}
          </h2>

          {/* Display API errors */}
          {(grantsError || usersError || locationsError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">API Connection Issues:</h3>
              {grantsError && (
                <p className="text-red-600 text-sm">• Grants: {grantsError.message}</p>
              )}
              {usersError && (
                <p className="text-red-600 text-sm">• Users: {usersError.message}</p>
              )}
              {locationsError && (
                <p className="text-red-600 text-sm">• Locations: {locationsError.message}</p>
              )}
              <p className="text-red-600 text-sm mt-2">Please check your authentication or contact support.</p>
            </div>
          )}

          {/* Display loading status */}
          {(grantsLoading || usersLoading || locationsLoading) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                Loading form data...
                {grantsLoading && " • Grants"}
                {usersLoading && " • Users"}
                {locationsLoading && " • Locations"}
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Project */}
              <FormSelect
                label="Project"
                name="project"
                required
                placeholder={grantsLoading ? "Loading projects..." : grantOptions.length > 0 ? "Select a project" : "No projects available"}
                options={grantOptions}
                disabled={grantsLoading}
              />

              {/* Title */}
              <FormInput
                label="Title"
                name="title"
                required
                placeholder="Enter sub-grant title"
              />

              {/* Grant Administrator */}
              <FormSelect
                label="Grant Administrator"
                name="sub_grant_administrator"
                required
                placeholder={usersLoading ? "Loading users..." : userOptions.length > 0 ? "Select administrator" : "No users available"}
                options={userOptions}
                disabled={usersLoading}
              />

              {/* Award Type */}
              <FormSelect
                label="Award Type"
                name="award_type"
                required
                placeholder="Select award type"
                options={[
                  { value: "COMPETITIVE_GRANT", label: "Competitive Grant" },
                  { value: "FIXED_AMOUNT", label: "Fixed Amount" },
                  { value: "COST_REIMBURSEMENT", label: "Cost Reimbursement" },
                  { value: "COOPERATIVE_AGREEMENT", label: "Cooperative Agreement" },
                ]}
              />

              {/* Project Locations */}
              <div>
                <Label className="font-semibold">Project Location <span className="text-red-500">*</span></Label>
                <FormField
                  control={form.control}
                  name="locations"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={locationOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={locationsLoading ? "Loading locations..." : "Select project locations"}
                          variant="inverted"
                          disabled={locationsLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.formState.errors.locations && (
                  <span className="text-sm text-red-500 font-medium">
                    {form.formState.errors.locations.message as string}
                  </span>
                )}
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Amount (USD)"
                  name="amount_usd"
                  required
                  placeholder="Enter amount in USD"
                />
                <FormInput
                  label="Amount (NGN) - Auto calculated"
                  name="amount_ngn"
                  required
                  placeholder="Auto-calculated from USD"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Grant Duration */}
              <FormSelect
                label="Grant Duration"
                name="duration"
                required
                placeholder="Select duration"
                options={[
                  { value: "3_MONTHS", label: "3 Months" },
                  { value: "6_MONTHS", label: "6 Months" },
                  { value: "9_MONTHS", label: "9 Months" },
                  { value: "1_YEAR", label: "1 Year" },
                  { value: "18_MONTHS", label: "18 Months" },
                  { value: "2_YEARS", label: "2 Years" },
                  { value: "3_YEARS", label: "3 Years" },
                  { value: "4_YEARS", label: "4 Years" },
                  { value: "5_YEARS", label: "5 Years" },
                ]}
              />

              {/* Advert Dates */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Advert Start Date"
                  name="submission_start_date"
                  required
                  type="date"
                  placeholder="Select advert start date"
                />
                <FormInput
                  label="Advert End Date"
                  name="submission_end_date"
                  required
                  type="date"
                  placeholder="Select advert end date"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <FormButton loading={isLoading} disabled={isLoading}>
                  {isEditMode ? "Update Sub-Grant" : "Create Sub-Grant"}
                </FormButton>
                <FormButton
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </section>
  );
};

export default CreateSubGrant;