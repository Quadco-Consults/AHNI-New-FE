"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import Card from "@/components/Card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import MultiSelectFormField from "@/components/ui/multiselect";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MinusCircle } from "lucide-react";

// Import controllers
import { useGetAllUsers, useGetUserProfile } from "@/features/auth/controllers/userController";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useCreateActivityMemo, useUpdateActivityMemo, ActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { SampleMemoSchema } from "@/features/procurement/types/procurement-validator";
import ExpensesForm from "@/features/procurement/components/purchase-request/activity-memo/form/ExpensesForm";
import { useGetAllModules } from "@/features/modules/controllers/project/moduleController";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";

// Import master config API hooks (unrestricted)
import {
  useGetFCONumbersDropdown,
  useGetBudgetLinesDropdown,
  useGetCostGroupingsDropdown,
  useGetCostInputsDropdown,
  useGetFundingSourcesDropdown,
  useGetInterventionAreasDropdown
} from "@/features/modules/controllers/config/allConfigController";

interface CreateActivityMemoFormProps {
  editMode?: boolean;
  existingData?: ActivityMemo;
  memoId?: string;
}

const CreateActivityMemoForm = ({ editMode = false, existingData, memoId }: CreateActivityMemoFormProps = {}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all required data
  const { data: users } = useGetAllUsers({ page: 1, size: 2000000 });
  const { data: profile } = useGetUserProfile();
  const { data: activites } = useGetAllActivityPlans({ page: 1, size: 2000000 });
  const { data: items } = useGetAllItems({ page: 1, size: 2000000 });

  // Fetch modules
  const modulesQuery = useGetAllModules({
    page: 1,
    size: 2000000,
    search: "",
    enabled: true,
  });
  const modulesData = modulesQuery?.data;
  const modulesLoading = modulesQuery?.isLoading ?? false;
  const modulesError = modulesQuery?.error;
  const isModulesError = modulesQuery?.isError ?? false;

  // Use master config API for dropdown data (bypasses permission filtering)
  const { data: fco, isLoading: isFcoLoading, error: fcoError } = useGetFCONumbersDropdown();
  const { data: budgetLines, isLoading: isBudgetLinesLoading, error: budgetLinesError } = useGetBudgetLinesDropdown();
  const { data: costGroupings, isLoading: isCostGroupingsLoading, error: costGroupingsError } = useGetCostGroupingsDropdown();
  const { data: costInput, isLoading: isCostInputLoading, error: costInputError } = useGetCostInputsDropdown();
  const { data: fundingSource, isLoading: isFundingSourceLoading, error: fundingSourceError } = useGetFundingSourcesDropdown();
  const { data: interventions, isLoading: isInterventionsLoading, error: interventionsError } = useGetInterventionAreasDropdown();

  const { createActivityMemo, isLoading: isCreating } = useCreateActivityMemo();
  const { updateActivityMemo, isLoading: isUpdating } = useUpdateActivityMemo(memoId || '');

  // Format options
  const usersOptions = React.useMemo(() =>
    (users as any)?.data?.results?.map(({ first_name, last_name, id }: any) => ({
      name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User',
      id,
    })) || [], [users]);

  const usersOptionsFn = React.useMemo(() =>
    (users as any)?.data?.results?.map(({ first_name, last_name, id }: any) => ({
      label: `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User',
      value: id,
    })) || [], [users]);

  const activitiesOptions = React.useMemo(() => {
    const rawResults = (activites as any)?.data?.results || [];
    const sortedActivities = rawResults.sort((a: any, b: any) => {
      if (a.is_memo_required && !b.is_memo_required) return -1;
      if (!a.is_memo_required && b.is_memo_required) return 1;
      return (a.activity_code || '').localeCompare(b.activity_code || '');
    });

    return sortedActivities.map(({ activity_code, activity_description, id, work_plan_activity_identifier, is_memo_required }: any) => {
      const activityNumber = work_plan_activity_identifier || '';
      const label = activityNumber
        ? `${activityNumber} | ${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`
        : `${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`;

      return { label, value: id };
    });
  }, [activites]);

  // Format master config API data
  const fcoOptions = React.useMemo(() => {
    if (!fco || fco.length === 0) {
      console.log('💰 FCO Numbers: Empty or loading...', { hasData: !!fco, count: fco?.length || 0 });
      return [];
    }
    return fco.map((item: any) => ({
      id: item.id,
      name: item.name || item.fco_number || item.code || 'Unnamed FCO'
    }));
  }, [fco]);

  const budgetLinesOptions = React.useMemo(() => {
    if (!budgetLines || budgetLines.length === 0) {
      console.log('💰 Budget Lines: Empty or loading...', { hasData: !!budgetLines, count: budgetLines?.length || 0 });
      return [];
    }
    return budgetLines.map((item: any) => ({
      id: item.id,
      name: item.name || item.budget_line_name || 'Unnamed Budget Line'
    }));
  }, [budgetLines]);

  const costGroupingsOptions = React.useMemo(() => {
    if (!costGroupings || costGroupings.length === 0) {
      console.log('💰 Cost Groupings: Empty or loading...', { hasData: !!costGroupings, count: costGroupings?.length || 0 });
      return [];
    }
    return costGroupings.map((item: any) => ({
      id: item.id,
      name: item.name || item.code || 'Unnamed Cost Grouping'
    }));
  }, [costGroupings]);

  const costInputOptions = React.useMemo(() => {
    if (!costInput || costInput.length === 0) {
      console.log('💰 Cost Inputs: Empty or loading...', { hasData: !!costInput, count: costInput?.length || 0 });
      return [];
    }
    return costInput.map((item: any) => ({
      id: item.id,
      name: item.name || item.cost_input_name || 'Unnamed Cost Input'
    }));
  }, [costInput]);

  const fundingSourceOptions = React.useMemo(() => {
    if (!fundingSource || fundingSource.length === 0) {
      console.log('💰 Funding Sources: Empty or loading...', { hasData: !!fundingSource, count: fundingSource?.length || 0 });
      return [];
    }
    return fundingSource.map((item: any) => ({
      id: item.id,
      name: item.name || item.funding_source_name || 'Unnamed Funding Source'
    }));
  }, [fundingSource]);

  const interventionsOptions = React.useMemo(() => {
    if (!interventions || interventions.length === 0) {
      console.log('💰 Intervention Areas: Empty or loading...', { hasData: !!interventions, count: interventions?.length || 0 });
      return [];
    }
    return interventions.map((item: any) => ({
      id: item.id,
      name: item.code || item.name || 'Unnamed Intervention Area'
    }));
  }, [interventions]);

  // Module options - show ALL modules
  const modulesOptions = React.useMemo(() => {
    const rawResults = (modulesData as any)?.results || (modulesData as any)?.data?.results || [];

    // Show all modules regardless of budget line selection
    const allOptions = rawResults.map(({ name, id }: any) => ({
      id,
      name,
    }));

    return allOptions;
  }, [modulesData]);

  // Debug modules data (only log once when data changes)
  React.useEffect(() => {
    if (!modulesLoading && modulesData) {
      const rawResults = (modulesData as any)?.results || (modulesData as any)?.data?.results || [];
      console.log('🔵 MODULES: Loaded', rawResults.length, 'modules:', rawResults.map((m: any) => m.name).join(", "));
    }
  }, [modulesData, modulesLoading]);

  const itemsOptions = React.useMemo(() =>
    (items as any)?.data?.results?.map(({ name, id, uom }: any) => ({
      label: name,
      value: id,
      uom: uom,
    })) || [], [items]);

  const itemsLookup = React.useMemo(() =>
    (items as any)?.data?.results?.reduce((acc: any, item: any) => {
      acc[item.id] = item;
      return acc;
    }, {}) || {}, [items]);

  // Form persistence
  const FORM_STORAGE_KEY = 'standalone_activity_memo_form';

  const loadSavedFormData = () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return null;

    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && typeof parsedData === 'object') {
          return {
            ...parsedData,
            fconumber: Array.isArray(parsedData.fconumber) ? parsedData.fconumber : [],
            module: Array.isArray(parsedData.module) ? parsedData.module : [],
            intervention_areas: Array.isArray(parsedData.intervention_areas) ? parsedData.intervention_areas : [],
            budget_line: Array.isArray(parsedData.budget_line) ? parsedData.budget_line : [],
            cost_categories: Array.isArray(parsedData.cost_categories) ? parsedData.cost_categories : [],
            cost_input: Array.isArray(parsedData.cost_input) ? parsedData.cost_input : [],
            funding_source: Array.isArray(parsedData.funding_source) ? parsedData.funding_source : [],
            copy: Array.isArray(parsedData.copy) ? parsedData.copy : [],
            through: Array.isArray(parsedData.through) ? parsedData.through : [],
            expenses: Array.isArray(parsedData.expenses) ? parsedData.expenses : [],
          };
        }
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
    }
    return null;
  };

  // Don't load saved form data in edit mode
  const savedFormData = editMode ? null : loadSavedFormData();

  const form = useForm<z.infer<typeof SampleMemoSchema>>({
    resolver: zodResolver(SampleMemoSchema),
    defaultValues: editMode && existingData ? {
      activity: existingData.activity || "",
      subject: existingData.subject || "",
      requested_date: existingData.requested_date || "",
      fconumber: existingData.fconumber || [],
      module: (existingData as any).module || [],
      intervention_areas: existingData.intervention_areas || [],
      budget_line: existingData.budget_line || [],
      cost_categories: existingData.cost_categories || [],
      cost_input: existingData.cost_input || [],
      funding_source: existingData.funding_source || [],
      comment: existingData.comment || "",
      // Extract user IDs from *_details if copy/through are empty
      copy: (existingData as any).copy?.length > 0
        ? (existingData as any).copy
        : (existingData as any).reviewed_by_details?.map((r: any) => r.user_id) || [],
      approved_by: (existingData as any).approved_by || (existingData as any).approved_by_details?.user_id || "",
      created_by: (existingData as any).created_by || (existingData as any).created_by_details?.user_id || "",
      through: (existingData as any).through?.length > 0
        ? (existingData as any).through
        : (existingData as any).authorised_by_details?.map((a: any) => a.user_id) || [],
      expenses: existingData.expenses?.map((exp: any) => ({
        item: exp.item_detail?.id || exp.item || "",
        is_service: exp.is_service || false,
        quantity: exp.quantity || "",
        unit_cost: exp.unit_cost || "",
        duration: exp.duration || 1,
        duration_unit: exp.duration_unit || "month",
        num_of_facility: exp.num_of_facility || 1,
        uom: exp.uom || exp.item_detail?.uom || "",
        total_cost: exp.total_cost || 0,
      })) || [],
    } : savedFormData || {
      activity: "",
      subject: "",
      requested_date: "",
      fconumber: [],
      module: [],
      intervention_areas: [],
      budget_line: [],
      cost_categories: [],
      cost_input: [],
      funding_source: [],
      comment: "",
      copy: [], // CC = Reviewers
      approved_by: "", // TO = Approver
      created_by: "",
      through: [], // Through = Authorizers
      expenses: [],
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const watchedValues = watch();

  // Auto-save (disabled in edit mode)
  useEffect(() => {
    if (editMode) return; // Don't auto-save in edit mode

    const timeoutId = setTimeout(() => {
      // Only run on client side
      if (typeof window === 'undefined') return;

      try {
        const hasContent = Object.values(watchedValues).some(value => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'string') return value.trim().length > 0;
          return false;
        });

        if (hasContent) {
          localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(watchedValues));
        }
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [watchedValues, editMode]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  // Watch expenses for calculation
  const watchedExpenses = watch('expenses') || [];

  // Note: Individual expense calculations are handled by ExpensesForm component

  const calculateGrandTotal = () => {
    return watchedExpenses.reduce((sum: number, expense: any) => {
      const isService = expense?.is_service || false;
      let totalCost = 0;

      if (isService) {
        // For services: Total = Quantity × Duration × # of Facilities × Unit Cost
        const quantity = parseFloat(expense?.quantity || 0);
        const duration = parseFloat(expense?.duration || 1);
        const numOfFacility = parseFloat(expense?.num_of_facility || 1);
        const unitCost = parseFloat(expense?.unit_cost || 0);
        totalCost = quantity * duration * numOfFacility * unitCost;
      } else {
        // For regular items: Total = Quantity × Unit Cost
        const quantity = parseFloat(expense?.quantity || 0);
        const unitCost = parseFloat(expense?.unit_cost || 0);
        totalCost = quantity * unitCost;
      }

      return sum + totalCost;
    }, 0);
  };

  // Auto-set created_by to current user
  useEffect(() => {
    if (profile?.data?.id) {
      setValue('created_by', profile.data.id);
    }
  }, [profile, setValue]);

  // Auto-populate financial fields when activity is selected
  const selectedActivityId = watch('activity');
  const prevActivityIdRef = React.useRef<string | null>(null);

  // Get selected activity's project ID
  const selectedActivity = React.useMemo(() => {
    if (selectedActivityId && activites) {
      return (activites as any)?.data?.results?.find(
        (activity: any) => activity.id === selectedActivityId
      );
    }
    return null;
  }, [selectedActivityId, activites]);

  const projectId = selectedActivity?.project || null;

  // Fetch project details when activity has a project
  const { data: projectData } = useGetSingleProject(projectId as string, !!projectId);

  useEffect(() => {
    if (selectedActivityId && activites) {
      const selectedActivity = (activites as any)?.data?.results?.find(
        (activity: any) => activity.id === selectedActivityId
      );

      if (selectedActivity) {
        // Check if this is a new activity selection (activity changed)
        const isActivityChange = prevActivityIdRef.current !== null && prevActivityIdRef.current !== selectedActivityId;

        if (isActivityChange) {
          console.log("🔄 Activity changed - clearing old financial fields before auto-populating new ones...");
          // Clear all financial fields when activity changes
          setValue('budget_line', []);
          setValue('module', []);
          setValue('intervention_areas', []);
          setValue('cost_categories', []);
          setValue('cost_input', []);
          setValue('funding_source', []); // Clear funding source too
        }

        // Update the ref to track the current activity
        prevActivityIdRef.current = selectedActivityId;

        console.log("🎯 Auto-populating financial fields from activity...");
        let fieldsPopulated = 0;

        // Helper function to find option ID by name (case-insensitive match)
        const findOptionIdByName = (options: any[], searchName: string) => {
          if (!searchName) return null;
          const option = options.find(opt =>
            opt.name?.toLowerCase().trim() === searchName.toLowerCase().trim()
          );
          return option?.id || null;
        };

        // 1. Budget Line (string → array of IDs)
        if (selectedActivity.budget_line && budgetLinesOptions.length > 0) {
          const budgetLineId = findOptionIdByName(budgetLinesOptions, selectedActivity.budget_line);
          if (budgetLineId) {
            setValue('budget_line', [budgetLineId]);
            fieldsPopulated++;
            console.log(`✅ Budget Line: "${selectedActivity.budget_line}" → ID: ${budgetLineId}`);
          } else {
            console.log(`⚠️ Budget Line "${selectedActivity.budget_line}" not found in options`);
          }
        }

        // 2. Module (string → array of IDs) - only if activity has module field
        if (selectedActivity.module && modulesOptions.length > 0) {
          const moduleId = findOptionIdByName(modulesOptions, selectedActivity.module);
          if (moduleId) {
            setValue('module', [moduleId]);
            fieldsPopulated++;
            console.log(`✅ Module: "${selectedActivity.module}" → ID: ${moduleId}`);
          } else {
            console.log(`⚠️ Module "${selectedActivity.module}" not found in options`);
          }
        }

        // 3. Intervention Area (string → array of IDs)
        if (selectedActivity.intervention_area && interventionsOptions.length > 0) {
          const interventionId = findOptionIdByName(interventionsOptions, selectedActivity.intervention_area);
          if (interventionId) {
            setValue('intervention_areas', [interventionId]);
            fieldsPopulated++;
            console.log(`✅ Intervention Area: "${selectedActivity.intervention_area}" → ID: ${interventionId}`);
          } else {
            console.log(`⚠️ Intervention Area "${selectedActivity.intervention_area}" not found in options`);
          }
        }

        // 4. Cost Grouping (string → array of IDs)
        // Note: Activity has both cost_category (old/test data) and cost_grouping (correct field)
        const costGroupingValue = selectedActivity.cost_grouping || selectedActivity.cost_category;
        if (costGroupingValue && costGroupingsOptions.length > 0) {
          const costGroupingId = findOptionIdByName(costGroupingsOptions, costGroupingValue);
          if (costGroupingId) {
            setValue('cost_categories', [costGroupingId]);
            fieldsPopulated++;
            console.log(`✅ Cost Grouping: "${costGroupingValue}" → ID: ${costGroupingId}`);
          } else {
            console.log(`⚠️ Cost Grouping "${costGroupingValue}" not found in options`);
            console.log("Available cost grouping names:", costGroupingsOptions.map((opt: any) => opt.name).join(", "));
          }
        }

        // 5. Cost Input (string → array of IDs)
        if (selectedActivity.cost_input && costInputOptions.length > 0) {
          const costInputId = findOptionIdByName(costInputOptions, selectedActivity.cost_input);
          if (costInputId) {
            setValue('cost_input', [costInputId]);
            fieldsPopulated++;
            console.log(`✅ Cost Input: "${selectedActivity.cost_input}" → ID: ${costInputId}`);
          } else {
            console.log(`⚠️ Cost Input "${selectedActivity.cost_input}" not found in options`);
            console.log("Available cost input names:", costInputOptions.map((opt: any) => opt.name).join(", "));
            console.log("💡 Note: Activity has cost_input = '" + selectedActivity.cost_input + "' which may be a Cost Grouping, not a Cost Input");
          }
        }

        // 6. Funding Source from Project (if activity is linked to a project)
        if (projectData && fundingSourceOptions.length > 0) {
          const project = (projectData as any)?.data || projectData;
          console.log("🏢 Activity is linked to project:", project?.title);

          // Project funding_sources is an array of objects with { id, name }
          const projectFundingSources = project?.funding_sources || [];
          console.log("💰 Project funding sources:", projectFundingSources);

          if (projectFundingSources.length > 0) {
            // Extract IDs from the project's funding sources
            const fundingSourceIds = projectFundingSources.map((fs: any) => fs.id);
            setValue('funding_source', fundingSourceIds);
            fieldsPopulated++;
            console.log(`✅ Funding Source(s) from project: ${projectFundingSources.map((fs: any) => fs.name).join(', ')} → IDs: ${fundingSourceIds.join(', ')}`);
          } else {
            console.log("⚠️ Project has no funding sources configured");
          }
        } else if (selectedActivity.project) {
          console.log("⚠️ Activity has project ID but project data not loaded yet");
        }

        // Show feedback to user
        const autoFilledFundingSource = projectData && (projectData as any)?.data?.funding_sources?.length > 0;
        if (fieldsPopulated > 0) {
          toast.success(`Auto-filled ${fieldsPopulated} financial field(s) from activity`, {
            description: autoFilledFundingSource ? "FCO Number needs to be selected manually" : "FCO Number and Funding Source need to be selected manually",
            duration: 3000,
          });
        } else {
          toast.info("Activity selected, but no financial fields could be auto-populated", {
            description: "Please fill in the financial fields manually",
            duration: 3000,
          });
        }

        console.log(`📊 Auto-population complete: ${fieldsPopulated} fields populated`);
      }
    }
  }, [selectedActivityId, activites, budgetLinesOptions, modulesOptions, interventionsOptions, costGroupingsOptions, costInputOptions, projectData, fundingSourceOptions, setValue]);

  const onSubmit = async (data: z.infer<typeof SampleMemoSchema>) => {
    try {
      setIsSubmitting(true);

      const activityMemoData = {
        subject: data.subject,
        requested_date: data.requested_date,
        comment: data.comment,
        approved_by: data.approved_by, // TO = Final Approver
        created_by: data.created_by,
        reviewed_by: data.copy, // CC = Reviewers
        authorised_by: data.through, // Through = Authorizers
        fconumber: data.fconumber,
        module: data.module,
        intervention_areas: data.intervention_areas,
        budget_line: data.budget_line,
        cost_categories: data.cost_categories,
        cost_input: data.cost_input,
        funding_source: data.funding_source,
        through: data.through, // Keep original field for backend compatibility
        copy: data.copy, // Keep original field for backend compatibility
        expenses: data.expenses,
      };

      if (editMode && memoId) {
        await updateActivityMemo(activityMemoData);
        toast.success("Activity Memo updated successfully!");
        router.push(`/dashboard/procurement/activity-memo/${memoId}`);
      } else {
        await createActivityMemo(activityMemoData);
        toast.success("Activity Memo created successfully!");
        if (typeof window !== 'undefined') {
          localStorage.removeItem(FORM_STORAGE_KEY);
        }
        router.push("/dashboard/procurement/activity-memo");
      }
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} activity memo:`, error);
      toast.error(`Failed to ${editMode ? 'update' : 'create'} activity memo`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editMode ? 'Edit Activity Memo' : 'Create Activity Memo'}
        </h2>
        {editMode && existingData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Editing:</strong> {existingData.subject} (Ref: {existingData.ref_number || 'N/A'})
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {/* TO, Through, and CC */}
            <div className="grid grid-cols-3 gap-5">
              <div>
                <Label className="font-semibold">Through</Label>
                <FormField
                  control={control}
                  name="through"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={usersOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select Through"
                          variant="inverted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <Label className="font-semibold">CC</Label>
                <FormField
                  control={control}
                  name="copy"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={usersOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select CC"
                          variant="inverted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormSelect
                  label="TO"
                  name="approved_by"
                  required
                  placeholder="Select TO"
                  options={usersOptionsFn}
                />
              </div>
            </div>

            {/* Activity and Subject */}
            <div className="grid grid-cols-2 gap-5">
              <FormSelect
                label="Activity"
                name="activity"
                placeholder="Select Activity"
                options={activitiesOptions}
              />
              <FormInput
                label="Subject"
                name="subject"
                required
                placeholder="Enter subject"
              />
            </div>

            {/* Requested Date */}
            <div className="grid grid-cols-2 gap-5">
              <FormInput
                label="Requested Date"
                name="requested_date"
                type="date"
                required
              />
            </div>

            {/* Financial Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Financial Information</h3>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label className="font-semibold">FCO Number</Label>
                  <FormField
                    control={control}
                    name="fconumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={fcoOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select FCO Number"
                            variant="inverted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label className="font-semibold">Budget Line</Label>
                  <FormField
                    control={control}
                    name="budget_line"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={budgetLinesOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select Budget Line"
                            variant="inverted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label className="font-semibold">Module</Label>
                  {modulesLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading modules...</div>
                  ) : isModulesError ? (
                    <div className="p-4 text-center">
                      <p className="text-red-500 text-sm">Failed to load modules</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {modulesError?.message || 'API error - modules endpoint may not be available'}
                      </p>
                    </div>
                  ) : (
                    <FormField
                      control={control}
                      name="module"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <MultiSelectFormField
                              options={modulesOptions}
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              placeholder={modulesOptions.length === 0 ? 'No modules available' : 'Select Module'}
                              variant="inverted"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  {!isModulesError && modulesOptions.length === 0 && !modulesLoading && (
                    <p className="text-amber-600 text-xs mt-1">
                      💡 No modules found. Create modules in Dashboard → Programs → Modules.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label className="font-semibold">Cost Grouping</Label>
                  <FormField
                    control={control}
                    name="cost_categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={costGroupingsOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select Cost Grouping"
                            variant="inverted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label className="font-semibold">Cost Input</Label>
                  <FormField
                    control={control}
                    name="cost_input"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={costInputOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select Cost Input"
                            variant="inverted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label className="font-semibold">Funding Source</Label>
                  <FormField
                    control={control}
                    name="funding_source"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={fundingSourceOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select Funding Source"
                            variant="inverted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label className="font-semibold">Intervention Area</Label>
                  <FormField
                    control={control}
                    name="intervention_areas"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={interventionsOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select Intervention Area"
                            variant="inverted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Expenses Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses Breakdown</h3>

              <ExpensesForm
                fields={fields}
                watch={watch}
                remove={remove}
                setValue={setValue}
              />

              <div className="flex justify-between items-center mt-4">
                <Button
                  type="button"
                  className="text-primary bg-[#FFF2F2] flex gap-2"
                  onClick={() =>
                    append({
                      item: "",
                      is_service: false,
                      quantity: 1,
                      unit_cost: 0,
                      duration: 1,
                      duration_unit: "month",
                      num_of_facility: 1,
                      uom: "",
                      total_cost: 0,
                    })
                  }
                >
                  <AddSquareIcon />
                  Add Expense
                </Button>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ₦{calculateGrandTotal().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment */}
            <FormTextArea
              label="Comment"
              name="comment"
              placeholder="Enter any additional comments"
              rows={4}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <FormButton loading={isSubmitting || isCreating}>
                Create Activity Memo
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default CreateActivityMemoForm;