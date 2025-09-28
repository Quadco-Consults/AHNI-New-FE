"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";

// import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";

import { Separator } from "components/ui/separator";
import { RouteEnum } from "constants/RouterConstants";

import { SampleMemoSchema } from "@/features/procurement/types/procurement-validator";

// import { MinusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { store } from "store/index";
import React from "react";
// import { useGetAllConsumables } from "@/features/admin/controllers/inventory-management/consumableController";
import {
  useGetAllUsers,
  useGetUserProfile,
} from "@/features/auth/controllers/userController";
import { useGetAllBudgetLines } from "@/features/modules/controllers/finance/budgetLineController";
import { useGetAllCostCategories } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetAllCostInputs } from "@/features/modules/controllers/finance/costInputController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";

import { useGetAllFundingSources } from "@/features/modules/controllers/project/fundingSourceController";

import { activityActions } from "store/formData/activity-memo";
import { z } from "zod";
import ExpensesForm from "./ExpensesForm";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useCreateActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { toast } from "sonner";

const CreateActivityMemo = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createActivityMemo, isLoading: isCreating, data: createData, response: createResponse, isSuccess: isCreateSuccess } = useCreateActivityMemo();

  // Debug hook values (only when relevant)
  if (isCreateSuccess || isCreating) {
    console.log("🔄 Hook status:", { isCreating, isCreateSuccess, hasCreateData: !!createData, hasCreateResponse: !!createResponse, isSubmitting });
  }

  // Handle successful creation and navigation
  useEffect(() => {
    console.log("=== NAVIGATION USEEFFECT DEBUG ===");
    console.log("isCreateSuccess:", isCreateSuccess);
    console.log("createResponse:", createResponse);
    console.log("createData:", createData);
    console.log("isSubmitting:", isSubmitting);
    console.log("Full response object:", JSON.stringify(createResponse, null, 2));
    console.log("Full data object:", JSON.stringify(createData, null, 2));

    if (isCreateSuccess && createResponse && !isSubmitting) {
      console.log("✅ Activity memo created successfully!");
      console.log("Full createResponse:", createResponse);

      // Extract memo ID from response - try multiple possible locations
      const memoId = createResponse?.data?.id || createData?.id || createResponse?.id;
      console.log("Extracted memo ID:", memoId);
      console.log("Memo ID type:", typeof memoId);

      if (memoId) {
        console.log("📝 Updating Redux with memo ID:", memoId);
        // Update the latest activity in Redux with the memo ID
        const currentActivity = store.getState().activity.activity;
        const latestActivityIndex = currentActivity.length - 1;

        if (latestActivityIndex >= 0) {
          const updatedActivity = {
            ...currentActivity[latestActivityIndex],
            createdMemoId: memoId,
          };

          dispatch(activityActions.updateActivity({
            index: latestActivityIndex,
            data: updatedActivity
          }));

          console.log("✅ Updated Redux with memo ID:", memoId);
        }

        // Navigate directly to final preview
        console.log("🧭 Navigating to final preview with ID:", memoId);
        const finalUrl = `${RouteEnum.FINAL_PREVIEW}?id=${memoId}&created=true`;
        console.log("Final URL:", finalUrl);
        router.push(finalUrl);
      } else {
        console.warn("❌ No memo ID found in response, falling back to sample preview");
        console.log("Available response keys:", Object.keys(createResponse || {}));
        console.log("Available data keys:", Object.keys(createData || {}));
        router.push(RouteEnum.FINAL_PREVIEW);
      }
    } else {
      console.log("❌ Navigation conditions not met:");
      console.log("- isCreateSuccess:", isCreateSuccess);
      console.log("- createResponse exists:", !!createResponse);
      console.log("- not submitting:", !isSubmitting);
    }
  }, [isCreateSuccess, createResponse, createData, router, isSubmitting, dispatch]);

  const { data: fundingSource, isLoading: fundingSourceLoading } = useGetAllFundingSources({
    page: 1,
    size: 2000000,
    search: "",
  });

  // Keep original activity plans query for now (display purposes)
  const { data: activites, error: activitiesError, isLoading: activitiesLoading, refetch: refetchActivities } = useGetAllActivityPlans({
    page: 1,
    size: 2000000,
    search: "",
    enabled: true,
  });

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: costInput, isLoading: costInputLoading } = useGetAllCostInputs({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: costCategories, isLoading: costCategoriesLoading } = useGetAllCostCategories({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: budgetLines, isLoading: budgetLinesLoading } = useGetAllBudgetLines({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: fco, isLoading: fcoLoading } = useGetAllFCONumbers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: interventions, isLoading: interventionsLoading } = useGetAllInterventionAreas({
    page: 1,
    size: 20000,
    search: "",
  });

  const { data: profile } = useGetUserProfile();

  // Create formatted options for dropdowns
  const budgetLinesOptions = React.useMemo(() => {
    const rawResults = (budgetLines as any)?.data?.results || [];
    console.log("Budget Lines raw data:", budgetLines);
    console.log("Budget Lines raw results:", rawResults);

    const options = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));
    console.log("Budget Lines formatted options:", options);
    return options;
  }, [budgetLines]);

  const costCategoriesOptions = React.useMemo(() => {
    const rawResults = (costCategories as any)?.data?.results || [];
    console.log("Cost Categories raw data:", costCategories);
    console.log("Cost Categories raw results:", rawResults);

    const options = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));
    console.log("Cost Categories formatted options:", options);
    return options;
  }, [costCategories]);

  const costInputOptions = React.useMemo(() => {
    const rawResults = (costInput as any)?.data?.results || [];
    console.log("Cost Input raw data:", costInput);
    console.log("Cost Input raw results:", rawResults);

    const options = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));
    console.log("Cost Input formatted options:", options);
    return options;
  }, [costInput]);

  const fcoOptions = React.useMemo(() => {
    const rawResults = (fco as any)?.data?.results || [];
    console.log("FCO raw data:", fco);
    console.log("FCO raw results:", rawResults);

    const options = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.number || item.code || 'Unnamed FCO'
    }));
    console.log("FCO formatted options:", options);
    return options;
  }, [fco]);

  const fundingSourceOptions = React.useMemo(() => {
    const options = (fundingSource as any)?.data?.results || [];
    console.log("Funding Sources raw data:", fundingSource);
    console.log("Funding Sources options:", options);
    return options;
  }, [fundingSource]);

  // Debug logging (reduced)
  if (fundingSourceLoading || costInputLoading || costCategoriesLoading || budgetLinesLoading || fcoLoading || interventionsLoading) {
    console.log("⏳ Some data still loading...");
  }

  const usersOptions = (users as any)?.data?.results?.map(
    ({ first_name, last_name, id }: any) => ({
      name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User',
      id,
    })
  ) || [];

  const usersOptionsFn = (users as any)?.data?.results?.map(
    ({ first_name, last_name, id }: any) => ({
      label: `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User',
      value: id,
    })
  ) || [];

  const activitiesOptions = React.useMemo(() => {
    console.log("Activities loading state:", activitiesLoading);
    console.log("Activities error:", activitiesError);
    if (activitiesError) {
      console.error("Detailed activities error:", activitiesError);
    }
    const rawResults = (activites as any)?.data?.results || [];
    console.log("Activities raw data:", activites);
    console.log("Activities raw results:", rawResults);
    console.log("Number of activities loaded:", rawResults.length);

    // Show all activities (removed restrictive memo filter)
    // Sort activities - memo required first, then by activity code
    const sortedActivities = rawResults.sort((a: any, b: any) => {
      if (a.is_memo_required && !b.is_memo_required) return -1;
      if (!a.is_memo_required && b.is_memo_required) return 1;
      return (a.activity_code || '').localeCompare(b.activity_code || '');
    });

    const options = sortedActivities.map(({ activity_code, activity_description, id, work_plan_activity, is_memo_required, work_plan_activity_identifier }: any) => {
      console.log("Activity data:", { activity_code, activity_description, id, work_plan_activity, is_memo_required, work_plan_activity_identifier });

      // Build display label with activity number, code, and description
      const activityNumber = work_plan_activity_identifier || '';
      const label = activityNumber
        ? `${activityNumber} | ${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`
        : `${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`;

      return {
        label,
        value: id, // Use ActivityPlan ID directly as per backend analysis
      };
    });
    console.log("Activities formatted options:", options);
    return options;
  }, [activites, activitiesLoading, activitiesError]);

  const interventionsOptions = (interventions as any)?.data?.results?.map(
    ({ code, id }: any) => ({
      id,
      name: code,
    })
  ) || [];

  // Form persistence key
  const FORM_STORAGE_KEY = 'activity_memo_form_data';

  // Load saved form data from localStorage
  const loadSavedFormData = () => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      console.log('Raw saved data from localStorage:', savedData);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Loaded saved form data:', parsedData);

        // Validate the structure to ensure it's compatible
        if (parsedData && typeof parsedData === 'object') {
          // Ensure arrays are properly formatted
          const validatedData = {
            ...parsedData,
            fconumber: Array.isArray(parsedData.fconumber) ? parsedData.fconumber : [],
            intervention_areas: Array.isArray(parsedData.intervention_areas) ? parsedData.intervention_areas : [],
            budget_line: Array.isArray(parsedData.budget_line) ? parsedData.budget_line : [],
            cost_categories: Array.isArray(parsedData.cost_categories) ? parsedData.cost_categories : [],
            cost_input: Array.isArray(parsedData.cost_input) ? parsedData.cost_input : [],
            funding_source: Array.isArray(parsedData.funding_source) ? parsedData.funding_source : [],
            copy: Array.isArray(parsedData.copy) ? parsedData.copy : [],
            through: Array.isArray(parsedData.through) ? parsedData.through : [],
            expenses: Array.isArray(parsedData.expenses) ? parsedData.expenses : [],
          };
          console.log('📋 Validated saved data:', validatedData);
          return validatedData;
        }
      } else {
        console.log('ℹ️ No saved form data found');
      }
    } catch (error) {
      console.error('❌ Error loading saved form data:', error);
      // Clear corrupted data
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
    return null;
  };

  const savedFormData = loadSavedFormData();
  console.log('📋 Final savedFormData being used:', savedFormData);

  const form = useForm<z.infer<typeof SampleMemoSchema>>({
    resolver: zodResolver(SampleMemoSchema),
    defaultValues: savedFormData || {
      activity: "",
      subject: "",
      requested_date: "",
      fconumber: [],
      intervention_areas: [],
      budget_line: [],
      cost_categories: [],
      cost_input: [],
      funding_source: [],
      comment: "",
      copy: [],
      approved_by: "",
      // reviewed_by: "",
      created_by: "",
      // authorized_by: "",
      through: [],
      expenses: [],
      // created_by: profile?.data.id,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  // Watch all form values for auto-save
  const watchedValues = watch();

  // Save form data to localStorage
  const saveFormData = (data: any) => {
    try {
      // Don't save if data is empty or just default values
      const hasContent = Object.values(data).some(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        return false;
      });

      if (hasContent) {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
        console.log('Form data saved to localStorage');
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  // Auto-save form data when values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFormData(watchedValues);
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [watchedValues]);

  // Clear saved data on successful submission
  const clearSavedData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      console.log('Saved form data cleared');
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  // Debug form errors (only when there are errors)
  if (Object.keys(errors).length > 0) {
    console.log("📝 Form validation errors:", errors);
  }

  useEffect(() => {
    if (profile) {
      // Get current form values to preserve saved data
      const currentValues = form.getValues();

      // Only update the created_by field if it's not already set
      if (!currentValues.created_by) {
        form.setValue('created_by', profile?.data.id);
      }
    }
  }, [profile, form]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const onSubmit = async (data: z.infer<typeof SampleMemoSchema>) => {
    console.log("🚀 FORM SUBMISSION STARTED!");
    console.log("Form data received:", data);
    setIsSubmitting(true);

    try {
      console.log("Submitting activity memo:", data);

      // TEMPORARY: Skip activity validation since we're not sending activity field
      // Issue: ActivityPlan vs ActivityPlanFromWorkPlan model mismatch
      // Activity field is optional in backend, so we can proceed without it
      console.log("All available activity IDs:", activitiesOptions.map((a: any) => a.value));
      console.log("Selected activity ID from form:", data.activity);
      console.log("Skipping activity validation - field will not be sent to API");

      // Prepare the activity memo data according to API requirements
      console.log("About to submit with activity ID:", data.activity);
      console.log("Type of activity ID:", typeof data.activity);
      const activityMemoData = {
        // Skip activity field for now since it's optional and causing UUID mismatch
        // activity: data.activity, // Commented out - ActivityPlan vs ActivityPlanFromWorkPlan mismatch
        subject: data.subject,
        requested_date: data.requested_date,
        comment: data.comment,
        approved_by: data.approved_by,
        created_by: data.created_by,
        fconumber: data.fconumber,
        intervention_areas: data.intervention_areas,
        budget_line: data.budget_line,
        cost_categories: data.cost_categories,
        cost_input: data.cost_input,
        funding_source: data.funding_source,
        through: data.through,
        copy: data.copy,
        expenses: data.expenses,
      };

      console.log("Formatted data for API:", activityMemoData);

      // Create the activity memo via API
      console.log("Making API call to create activity memo...");
      const apiResult = await createActivityMemo(activityMemoData);
      console.log("API call completed with result:", apiResult);
      console.log("API result type:", typeof apiResult);
      console.log("API result keys:", Object.keys(apiResult || {}));

      // IMMEDIATE NAVIGATION WORKAROUND: Use API result directly if hook data is undefined
      if (apiResult && apiResult.data && apiResult.data.id) {
        console.log("🚀 IMMEDIATE NAVIGATION: Using API result for navigation");
        const memoId = apiResult.data.id;
        console.log("📝 Immediate memo ID:", memoId);

        // Update Redux immediately
        const selectedActivity = (activites as any)?.data?.results?.find(
          (activity: any) => activity.id === data?.activity
        );
        const selectedCostCategory = (costCategories as any)?.data?.results?.find(
          (costCategory: any) => costCategory.id === data?.cost_categories[0]
        );

        const { activity, ...dataWithoutActivity } = data;
        const dataToSave = {
          ...dataWithoutActivity,
          selectedActivity: selectedActivity,
          selectedCostCategory: selectedCostCategory,
          createdMemoId: memoId,
          timestamp: Date.now(),
        };
        console.log("📝 Saving to Redux immediately:", dataToSave);
        dispatch(activityActions.addActivity(dataToSave));

        // Navigate directly to final preview
        console.log("🧭 Immediate navigation to:", `${RouteEnum.FINAL_PREVIEW}?id=${memoId}&created=true`);
        router.push(`${RouteEnum.FINAL_PREVIEW}?id=${memoId}&created=true`);
        return; // Exit early since we handled navigation
      }

      // Get the selected activity and cost category for Redux store
      const selectedActivity = (activites as any)?.data?.results?.find(
        (activity: any) => activity.id === data?.activity
      );
      console.log("Selected activity for Redux:", selectedActivity);
      const selectedCostCategory = (costCategories as any)?.data?.results?.find(
        (costCategory: any) => costCategory.id === data?.cost_categories[0]
      );

      // Save to Redux store for the next step (exclude activity field to avoid UUID mismatch)
      const { activity, ...dataWithoutActivity } = data;
      const dataToSave = {
        ...dataWithoutActivity,
        selectedActivity: selectedActivity,
        selectedCostCategory: selectedCostCategory,
        // Will store memo ID via useEffect when response is available
        timestamp: Date.now(), // Add timestamp to help identify the latest entry
      };
      console.log("Saving to Redux store:", dataToSave);
      dispatch(activityActions.addActivity(dataToSave));

      toast.success("Activity memo created successfully!");

      // Clear saved form data after successful submission
      clearSavedData();
    } catch (error: any) {
      console.error("Failed to create activity memo:", error);
      toast.error(error?.message || "Failed to create activity memo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='pt-5'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <Label className='font-semibold'>Through</Label>
              <FormField
                control={form.control}
                name='through'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={usersOptions || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Please Select'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.copy && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.copy.message}
                </span>
              )}
            </div>{" "}
            <div>
              <Label className='font-semibold'>CC</Label>
              <FormField
                control={form.control}
                name='copy'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={usersOptions || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Please Select'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.copy && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.copy.message}
                </span>
              )}
            </div>{" "}
          </div>

          <div className='grid grid-cols-2 gap-5'>
            {usersOptionsFn && (
              <FormSelect
                label='To'
                name='approved_by'
                required
                options={usersOptionsFn}
              />
            )}
          </div>
          <div className='grid gap-5'>
            {activitiesOptions && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => refetchActivities()}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Refresh Activities ({activitiesOptions.length} available)
                  </button>
                  {activitiesLoading && <span className="text-xs text-gray-500">Loading...</span>}
                  {activitiesError && <span className="text-xs text-red-500">Error loading activities</span>}
                </div>
                <FormSelect
                  label='Activity (Optional)'
                  name='activity'
                  required={false}
                  options={activitiesOptions}
                />
                <small className="text-gray-600 mt-1 block">
                  Note: Activity selection is currently for display only. ✓ = Memo typically required for this activity.
                </small>
              </>
            )}
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='Requested Date'
              name='requested_date'
              type='date'
              placeholder='01/01/2024'
            />
            <div>
              <Label className='font-semibold'>FCO</Label>
              {fcoLoading ? (
                <div className="p-4 text-center text-gray-500">Loading FCO numbers...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='fconumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={fcoOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={fcoOptions.length === 0 ? 'No FCO numbers available' : 'Select FCOs'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {errors.fconumber && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.fconumber.message}
                </span>
              )}
            </div>{" "}
          </div>
          <div className='grid gap-5'>
            <div>
              <Label className='font-semibold'>Intervention Areas</Label>
              {interventionsLoading ? (
                <div className="p-4 text-center text-gray-500">Loading intervention areas...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='intervention_areas'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={interventionsOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={interventionsOptions.length === 0 ? 'No intervention areas available' : 'Select Intervention Areas'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {errors.fconumber && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.fconumber.message}
                </span>
              )}
            </div>{" "}
          </div>
          <div className='grid gap-5'>
            <div>
              <Label className='font-semibold'>Budget Line</Label>
              {budgetLinesLoading ? (
                <div className="p-4 text-center text-gray-500">Loading budget lines...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='budget_line'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={budgetLinesOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={budgetLinesOptions.length === 0 ? 'No budget lines available' : 'Select Budget Lines'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {errors.budget_line && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.budget_line.message}
                </span>
              )}
            </div>{" "}
            <div>
              <Label className='font-semibold'>Cost Categories</Label>
              {costCategoriesLoading ? (
                <div className="p-4 text-center text-gray-500">Loading cost categories...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='cost_categories'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={costCategoriesOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={costCategoriesOptions.length === 0 ? 'No cost categories available' : 'Select Cost Categories'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {errors.cost_categories && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.cost_categories.message}
                </span>
              )}
            </div>{" "}
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <Label className='font-semibold'>Cost Input</Label>
              {costInputLoading ? (
                <div className="p-4 text-center text-gray-500">Loading cost inputs...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='cost_input'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={costInputOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={costInputOptions.length === 0 ? 'No cost inputs available' : 'Select Cost Inputs'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {errors.cost_input && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.cost_input.message}
                </span>
              )}
            </div>{" "}
            <div>
              <Label className='font-semibold'>Funding Sources</Label>
              {fundingSourceLoading ? (
                <div className="p-4 text-center text-gray-500">Loading funding sources...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='funding_source'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={fundingSourceOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={fundingSourceOptions.length === 0 ? 'No funding sources available' : 'Select Funding Sources'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {errors.funding_source && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.funding_source.message}
                </span>
              )}
            </div>
          </div>

          <div className='grid gap-5'>
            <FormInput label='Subject' name='subject' type='text' />
          </div>
          <div className='grid gap-5'>
            <FormTextArea label='Memo content' name='comment' type='text' />
          </div>
          <Separator className='my-4' />
          <span className='block space-y-2'>
            <h3 className='font-semibold text-xl text-black'>Expenses</h3>
          </span>
          <ExpensesForm
            fields={fields}
            remove={remove}
            watch={watch}
            setValue={setValue}
          />
          {/*  */}
          <div className='flex justify-between items-center'>
            <Button
              onClick={() =>
                dispatch(
                  openDialog({
                    type: DialogType.AddItems,
                    dialogProps: {
                      header: "Add Item",
                    },
                  })
                )
              }
              variant='outline'
              className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
              size='sm'
            >
              Click to add New
            </Button>
            <div className='flex items-center justify-end gap-3'>
              <FormButton
                type='button'
                className='flex items-center justify-center gap-2'
                onClick={() =>
                  append({
                    item: "",
                    uom: "",
                    quantity: "",
                    unit_cost: "",
                    total_cost: 0,
                  })
                }
              >
                <AddSquareIcon />
                Add new expenses item row
              </FormButton>

              {/*  */}
              {/* <Link className='w-fit' href={generatePath(RouteEnum.SAMPLE_PREVIEW)}> */}
              <FormButton
                loading={isSubmitting || isCreating}
                disabled={isSubmitting || isCreating}
                type='submit'
                className='flex items-center justify-center gap-2'
                onClick={() => console.log("🖱️ Next button clicked!")}
              >
                <LongArrowRight />
                {isSubmitting || isCreating ? "Creating..." : "Next"}
              </FormButton>
              {/* </Link> */}
            </div>
          </div>
          <div className='flex gap-3 items-center justify-center'>
            <Button
              type='button'
              variant='outline'
              className='flex items-center justify-center gap-2'
              onClick={() => {
                if (confirm('Are you sure you want to clear the draft? This will remove all saved form data.')) {
                  clearSavedData();
                  form.reset();
                  toast.success('Draft cleared successfully');
                }
              }}
            >
              Clear Draft
            </Button>
            <FormButton
              loading={isSubmitting || isCreating}
              disabled={isSubmitting || isCreating}
              type='submit'
              className='flex items-center justify-center gap-2'
              onClick={() => console.log("🖱️ Save button clicked!")}
            >
              <LongArrowRight />
              {isSubmitting || isCreating ? "Creating..." : "Save"}
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateActivityMemo;
