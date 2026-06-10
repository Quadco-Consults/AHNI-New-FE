"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import LongArrowRight from "@/components/icons/LongArrowRight";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import MultiSelectFormField from "@/components/ui/multiselect";

import { Separator } from "@/components/ui/separator";
import { RouteEnum } from "@/constants/RouterConstants";

import { SampleMemoSchema } from "@/features/procurement/types/procurement-validator";

import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { store } from "@/store/index";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAllUsers,
  useGetUserProfile,
} from "@/features/auth/controllers/userController";
import { useGetAllBudgetLines } from "@/features/modules/controllers/finance/budgetLineController";
import { useGetAllCostCategories } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetAllCostInputs } from "@/features/modules/controllers/finance/costInputController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";
import { useGetAllCostGroupingsManager } from "@/features/modules/controllers/finance/costGroupingController";
import { useGetAllFundingSources } from "@/features/modules/controllers/project/fundingSourceController";
import { useGetAllModules } from "@/features/modules/controllers/project/moduleController";

import { activityActions } from "@/store/formData/activity-memo";
import { z } from "zod";
import ExpensesForm from "../activity-memo/form/ExpensesForm";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useUpdateActivityMemo, usePatchActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useUpdatePurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { toast } from "sonner";

interface EditPurchaseRequestFormProps {
  purchaseRequestData?: any;
  activityMemoData?: any;
  purchaseRequestId: string;
}

const EditPurchaseRequestForm = ({
  purchaseRequestData,
  activityMemoData,
  purchaseRequestId
}: EditPurchaseRequestFormProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("=== EDIT FORM DEBUG ===");
  console.log("Purchase Request Data:", purchaseRequestData);
  console.log("Activity Memo Data:", activityMemoData);
  console.log("Purchase Request ID:", purchaseRequestId);

  const { patchActivityMemo, isLoading: isUpdatingMemo } = usePatchActivityMemo(activityMemoData?.id);
  const { updatePurchaseRequest, isLoading: isUpdatingPR } = useUpdatePurchaseRequest(purchaseRequestId, false); // Disable toast, we'll handle it manually

  // API hooks for form options
  const { data: fundingSource, isLoading: fundingSourceLoading } = useGetAllFundingSources({
    page: 1,
    size: 2000000,
    search: "",
  });

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

  const { data: modules, isLoading: modulesLoading } = useGetAllModules({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: costGroupings, isLoading: costGroupingsLoading } = useGetAllCostGroupingsManager({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: profile } = useGetUserProfile();

  // Create formatted options for dropdowns
  const budgetLinesOptions = React.useMemo(() => {
    const rawResults = (budgetLines as any)?.data?.results || [];
    return rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));
  }, [budgetLines]);

  const costCategoriesOptions = React.useMemo(() => {
    const rawResults = (costCategories as any)?.data?.results || [];
    return rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));
  }, [costCategories]);

  const costInputOptions = React.useMemo(() => {
    const rawResults = (costInput as any)?.data?.results || [];
    return rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));
  }, [costInput]);

  const fcoOptions = React.useMemo(() => {
    const rawResults = (fco as any)?.data?.results || [];
    return rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.number || item.code || 'Unnamed FCO'
    }));
  }, [fco]);

  const fundingSourceOptions = React.useMemo(() => {
    const options = (fundingSource as any)?.data?.results || [];
    return options;
  }, [fundingSource]);

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
    const rawResults = (activites as any)?.data?.results || [];
    const sortedActivities = rawResults.sort((a: any, b: any) => {
      if (a.is_memo_required && !b.is_memo_required) return -1;
      if (!a.is_memo_required && b.is_memo_required) return 1;
      return (a.activity_code || '').localeCompare(b.activity_code || '');
    });

    return sortedActivities.map(({ activity_code, activity_description, id, work_plan_activity, is_memo_required, work_plan_activity_identifier }: any) => {
      const activityNumber = work_plan_activity_identifier || '';
      const label = activityNumber
        ? `${activityNumber} | ${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`
        : `${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`;

      return {
        label,
        value: id,
      };
    });
  }, [activites, activitiesLoading, activitiesError]);

  const interventionsOptions = (interventions as any)?.data?.results?.map(
    ({ code, id }: any) => ({
      id,
      name: code,
    })
  ) || [];

  const modulesOptions = React.useMemo(() => {
    const rawResults = (modules as any)?.data?.results || [];
    return rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || 'Unnamed Module'
    }));
  }, [modules]);

  const costGroupingsOptions = React.useMemo(() => {
    const rawResults = (costGroupings as any)?.results || [];
    return rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.code || item.description || 'Unnamed Cost Grouping'
    }));
  }, [costGroupings]);

  // Create a more lenient schema for editing
  const EditMemoSchema = SampleMemoSchema.extend({
    fconumber: z.array(z.string()).default([]),
    intervention_areas: z.array(z.string()).default([]),
    budget_line: z.array(z.string()).default([]),
    cost_categories: z.array(z.string()).default([]),
    cost_input: z.array(z.string()).default([]),
    funding_source: z.array(z.string()).default([]),
    copy: z.array(z.string()).default([]),
    through: z.array(z.string()).default([]),
    module: z.array(z.string()).optional(),
  });

  // Pre-populate form with existing data
  const form = useForm<z.infer<typeof EditMemoSchema>>({
    resolver: zodResolver(EditMemoSchema),
    defaultValues: {
      activity: "",
      subject: "",
      requested_date: "",
      fconumber: [],
      intervention_areas: [],
      budget_line: [],
      cost_categories: [],
      cost_grouping: [],
      cost_input: [],
      funding_source: [],
      module: [],
      comment: "",
      copy: [],
      approved_by: "",
      created_by: "",
      through: [],
      expenses: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;

  // Update form when data is loaded
  useEffect(() => {
    console.log("📝 Form data loading...");
    console.log("Activity Memo Data:", activityMemoData);
    console.log("Purchase Request Data:", purchaseRequestData);

    // Debug the specific fields
    if (activityMemoData) {
      console.log("🔍 FIELD DEBUGGING:");
      console.log("  through_details:", JSON.stringify(activityMemoData?.through_details));
      console.log("  copy_details:", JSON.stringify(activityMemoData?.copy_details));
      console.log("  approved_by_details:", JSON.stringify(activityMemoData?.approved_by_details));
      console.log("  created_by_details:", JSON.stringify(activityMemoData?.created_by_details));
      console.log("  created_by (direct):", activityMemoData?.created_by);
      console.log("  ALL Activity Memo Keys:", Object.keys(activityMemoData));
      console.log("  budget_line:", activityMemoData?.budget_line);
      console.log("  modules:", activityMemoData?.modules);
    }

    // Determine expenses/items to use
    let expensesToUse = [];

    if (activityMemoData?.expenses && activityMemoData.expenses.length > 0) {
      // Use Activity Memo expenses if available
      console.log("✅ Using expenses from Activity Memo:", activityMemoData.expenses.length);
      expensesToUse = activityMemoData.expenses;
    } else if (purchaseRequestData?.items && purchaseRequestData.items.length > 0) {
      // Fallback to Purchase Request items
      console.log("✅ Using items from Purchase Request:", purchaseRequestData.items.length);
      expensesToUse = purchaseRequestData.items.map((item: any) => ({
        item: typeof item.item === 'object' ? item.item.id : item.item,
        quantity: item.quantity || 1,
        unit_cost: item.unit_cost || 0,
        total_cost: item.amount || (item.quantity * item.unit_cost),
        uom: item.uom || item.unit || "pieces",
        description: item.description || "",
      }));
    }

    console.log("📊 Final expenses to populate:", expensesToUse.length, "items");

    if (activityMemoData || purchaseRequestData) {
      // Extract user IDs from detail objects
      // For Through: Use Activity Memo through_details OR fallback to Purchase Request reviewed_by
      let throughIds = activityMemoData?.through_details?.map((user: any) => user.user_id || user.id) || [];
      if (throughIds.length === 0 && purchaseRequestData?.reviewed_by) {
        // If no through users in Activity Memo, use Purchase Request reviewed_by
        const reviewedBy = purchaseRequestData.reviewed_by_detail?.user_id || purchaseRequestData.reviewed_by;
        if (reviewedBy) throughIds = [reviewedBy];
      }

      // For Copy/CC: Use Activity Memo copy_details OR fallback to Purchase Request authorized_by
      let copyIds = activityMemoData?.copy_details?.map((user: any) => user.user_id || user.id) || [];
      if (copyIds.length === 0 && (purchaseRequestData?.authorized_by || purchaseRequestData?.authorised_by)) {
        // If no copy users in Activity Memo, use Purchase Request authorized_by (check both spellings)
        const authorizedBy = purchaseRequestData.authorized_by_detail?.user_id ||
                            purchaseRequestData.authorised_by_detail?.user_id ||
                            purchaseRequestData.authorized_by ||
                            purchaseRequestData.authorised_by;
        if (authorizedBy) copyIds = [authorizedBy];
      }

      // Try multiple possible locations for approved_by
      let approvedById = "";
      if (activityMemoData?.approved_by_details) {
        approvedById = activityMemoData.approved_by_details.user_id || activityMemoData.approved_by_details.id || "";
      } else if (purchaseRequestData?.approved_by) {
        approvedById = purchaseRequestData.approved_by_detail?.user_id || purchaseRequestData.approved_by;
      }

      // Extract created_by user ID - use Activity Memo creator or current user as fallback
      let createdById = "";
      if (activityMemoData?.created_by_details?.user_id) {
        createdById = activityMemoData.created_by_details.user_id;
      } else if (activityMemoData?.created_by_details?.id) {
        createdById = activityMemoData.created_by_details.id;
      } else if (activityMemoData?.created_by) {
        createdById = activityMemoData.created_by;
      } else if (profile?.id) {
        // Fallback to current logged-in user
        createdById = profile.id;
      }

      console.log("🔍 EXTRACTED USER IDs:");
      console.log("  through (reviewers):", throughIds);
      console.log("  copy (authorizers):", copyIds);
      console.log("  approved_by (raw):", activityMemoData?.approved_by_details);
      console.log("  approved_by (extracted):", approvedById);
      console.log("  created_by (raw):", activityMemoData?.created_by_details);
      console.log("  created_by (extracted):", createdById);
      console.log("  current user profile:", profile);

      reset({
        activity: activityMemoData?.activity || "",
        subject: activityMemoData?.subject || "",
        requested_date: activityMemoData?.requested_date || "",
        fconumber: activityMemoData?.fconumber || [],
        intervention_areas: activityMemoData?.intervention_areas || [],
        budget_line: activityMemoData?.budget_line || [],
        cost_categories: activityMemoData?.cost_categories || [],
        cost_grouping: activityMemoData?.cost_grouping || [],
        cost_input: activityMemoData?.cost_input || [],
        funding_source: activityMemoData?.funding_source || [],
        module: activityMemoData?.modules || [],
        comment: activityMemoData?.comment || "",
        copy: copyIds,  // CC = Authorizers
        approved_by: approvedById,  // To = Final Approver
        created_by: createdById,
        through: throughIds,  // Through = Reviewers
        expenses: expensesToUse,
      });

      console.log("✅ Form reset complete with", expensesToUse.length, "expenses");
    }
  }, [activityMemoData, purchaseRequestData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const onSubmit = async (data: z.infer<typeof EditMemoSchema>) => {
    console.log("🚀 EDIT FORM SUBMISSION STARTED!");
    console.log("Form data received:", data);
    console.log("  📋 Modules from form:", data.module);
    console.log("  👤 Approved By (To) from form:", data.approved_by);
    console.log("  👥 Through (Reviewers) from form:", data.through);
    console.log("  📧 Copy/CC (Authorizers) from form:", data.copy);
    console.log("  💰 Expenses count:", data.expenses?.length);
    console.log("\n🔄 MAPPING STRATEGY:");
    console.log("  Activity Memo: through (array) + copy (array) → reviewed_by (array) + authorised_by (array)");
    console.log("  Purchase Request: through[0] → reviewed_by (single), copy[0] → authorized_by (single)");

    setIsSubmitting(true);

    try {
      let activityMemoSuccess = false;
      let purchaseRequestSuccess = false;

      // Update activity memo if it exists
      if (activityMemoData?.id) {
        console.log("📝 Patching activity memo ID:", activityMemoData.id);
        const activityMemoUpdateData = {
          activity: data.activity || activityMemoData.activity, // Include activity field
          subject: data.subject,
          requested_date: data.requested_date,
          comment: data.comment,
          approved_by: data.approved_by,
          created_by: data.created_by, // Include created_by
          fconumber: data.fconumber,
          intervention_areas: data.intervention_areas,
          budget_line: data.budget_line,
          cost_categories: data.cost_categories,
          cost_grouping: data.cost_grouping,
          cost_input: data.cost_input,
          funding_source: data.funding_source,
          modules: data.module, // Send as 'modules' (plural)
          through: data.through,  // Activity Memo routing (array)
          copy: data.copy,        // Activity Memo CC (array)
          reviewed_by: data.through,    // Also send as reviewed_by for backend sync
          authorised_by: data.copy,     // Also send as authorised_by for backend sync (British spelling)
          expenses: data.expenses,
        };

        console.log("📤 Activity Memo PATCH Payload:", JSON.stringify(activityMemoUpdateData, null, 2));

        try {
          await patchActivityMemo(activityMemoUpdateData);
          console.log("✅ Activity memo patched successfully (partial update)");
          activityMemoSuccess = true;
        } catch (memoError: any) {
          console.error("❌ Activity Memo Update Error:", memoError);
          console.error("  Error message:", memoError?.message);
          console.error("  Error response:", memoError?.response?.data);
          throw new Error(`Activity Memo update failed: ${memoError?.response?.data?.message || memoError?.message || 'Unknown error'}`);
        }
      } else {
        console.log("⚠️ No activity memo ID found, skipping activity memo update");
      }

      // Update purchase request if available
      if (purchaseRequestId) {
        console.log("📝 Updating purchase request ID:", purchaseRequestId);
        const purchaseRequestUpdateData = {
          items: data.expenses.map((expense: any) => ({
            item: expense.item,
            quantity: typeof expense.quantity === 'string' ? parseInt(expense.quantity) : expense.quantity,
            unit_cost: typeof expense.unit_cost === 'string' ? parseFloat(expense.unit_cost) : expense.unit_cost,
            amount: expense.total_cost || (parseFloat(expense.quantity || "0") * parseFloat(expense.unit_cost || "0")),
            uom: expense.uom || "pieces",
            description: expense.description || "",
            fco_number: expense.fco_number || [],
            is_service: expense.is_service || false,
            duration: expense.duration || 1,
            duration_unit: expense.duration_unit || 'month',
            num_of_facility: expense.num_of_facility || 1,
            frequency: expense.frequency || 1,
          })),
          // Map Activity Memo fields to Purchase Request approval workflow
          // Through → Reviewed By (first person in through array)
          reviewed_by: data.through?.[0] || undefined,
          // Copy/CC → Authorized By (first person in copy array) - using American spelling
          authorized_by: data.copy?.[0] || undefined,
          // Approved By (To) → Approved By
          approved_by: data.approved_by,
          // Creator → Requested By
          requested_by: data.created_by || profile?.id,
        };

        console.log("📤 Purchase Request PUT Payload:", JSON.stringify(purchaseRequestUpdateData, null, 2));
        console.log("⚠️ Note: Backend may have item duplication issues with PUT");
        console.log("   Sending item count:", purchaseRequestUpdateData.items.length);
        console.log("   If you see duplicates, the backend needs to be fixed to replace items instead of appending");

        try {
          await updatePurchaseRequest(purchaseRequestUpdateData);
          console.log("✅ Purchase request updated successfully");
          purchaseRequestSuccess = true;

          // Invalidate and refetch Purchase Request queries to get populated detail objects
          console.log("🔄 Refetching Purchase Request data to get populated user details...");
          await queryClient.invalidateQueries({ queryKey: ["purchase-request", purchaseRequestId] });
          await queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
          await queryClient.invalidateQueries({ queryKey: ["purchase-request-list"] });
          console.log("✅ Purchase Request data refreshed with user details");

        } catch (prError: any) {
          console.error("❌ Purchase Request Update Error:", prError);
          console.error("  Error message:", prError?.message);
          console.error("  Error response:", prError?.response?.data);
          throw new Error(`Purchase Request update failed: ${prError?.response?.data?.message || prError?.message || 'Unknown error'}`);
        }
      } else {
        console.log("⚠️ No purchase request ID found, skipping purchase request update");
      }

      // Invalidate Activity Memo queries as well
      if (activityMemoSuccess && activityMemoData?.id) {
        console.log("🔄 Refetching Activity Memo data...");
        await queryClient.invalidateQueries({ queryKey: ["activity-memo", activityMemoData.id] });
        await queryClient.invalidateQueries({ queryKey: ["activity-memos"] });
        console.log("✅ Activity Memo data refreshed");
      }

      // Show success message
      if (activityMemoSuccess && purchaseRequestSuccess) {
        console.log("🎉 Both updates successful!");
        toast.success("Activity Memo and Purchase Request updated successfully!");

        // Warn about potential item duplication issue
        console.warn("\n⚠️ KNOWN BACKEND ISSUE:");
        console.warn("If you see duplicate items in the Purchase Request, this is a backend bug.");
        console.warn("The backend PUT endpoint should REPLACE items, not APPEND them.");
        console.warn("Workaround: Delete the PR and create a new one instead of editing.");
        console.warn("Permanent fix: Backend team needs to fix the PUT endpoint.\n");

        toast.warning("Note: If you see duplicate items, this is a known backend issue. Please check the console for details.", {
          duration: 5000,
        });
      } else if (activityMemoSuccess) {
        toast.success("Activity Memo updated successfully!");
      } else if (purchaseRequestSuccess) {
        toast.success("Purchase Request updated successfully!");

        // Same warning for PR-only updates
        toast.warning("Note: If you see duplicate items, this is a known backend issue.", {
          duration: 5000,
        });
      }

      // Navigate back to purchase request list (with delay to allow refetch to complete)
      console.log("🔄 Navigating back to purchase request list...");
      setTimeout(() => {
        router.push(RouteEnum.PURCHASE_REQUEST);
      }, 1000); // Increased delay to allow refetch to complete

    } catch (error: any) {
      console.error("❌ UPDATE FAILED:", error);
      console.error("  Error type:", typeof error);
      console.error("  Error object:", error);
      console.error("  Error stack:", error?.stack);

      const errorMessage = error?.message || error?.response?.data?.message || "Failed to update. Please check the console for details.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Form submission complete");
    }
  };

  // Log form validation errors
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("❌ FORM VALIDATION ERRORS:", errors);
    }
  }, [errors]);

  return (
    <div className='pt-5'>
      <Form {...form}>
        {/* Validation Errors Display */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="text-red-800 font-semibold mb-2">⚠️ Form Validation Errors:</h4>
            <ul className="list-disc list-inside text-red-700 text-sm">
              {Object.entries(errors).map(([field, error]: [string, any]) => (
                <li key={field}>
                  <strong>{field}:</strong> {error?.message || 'Invalid value'}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={(e) => {
            console.log("📝 Form submit event triggered");
            console.log("Current form errors:", errors);
            console.log("Form values:", form.getValues());

            // Check if there are validation errors
            if (Object.keys(errors).length > 0) {
              console.error("❌ Form has validation errors:", errors);
              Object.entries(errors).forEach(([field, error]) => {
                console.error(`  - ${field}:`, error);
              });
            } else {
              console.log("✅ Form validation passed, proceeding with submit");
            }

            handleSubmit(onSubmit)(e);
          }}
          className='flex flex-col gap-6'
        >
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <Label className='font-semibold'>Through (Reviewer)</Label>
              <FormField
                control={form.control}
                name='through'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        key={`through-${JSON.stringify(field.value)}`}
                        options={usersOptions || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select reviewer(s)'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {errors.through && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.through.message}
                </span>
              )}
              <small className="text-gray-500 text-xs mt-1 block">
                Who will review this request
              </small>
            </div>
            <div>
              <Label className='font-semibold'>CC (Authorizer)</Label>
              <FormField
                control={form.control}
                name='copy'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        key={`copy-${JSON.stringify(field.value)}`}
                        options={usersOptions || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select authorizer(s)'
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
              <small className="text-gray-500 text-xs mt-1 block">
                Who will authorize this request
              </small>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-5'>
            {usersOptionsFn && (
              <div>
                <FormSelect
                  key={`approved_by-${watch("approved_by")}`}
                  label='Approved By (To)'
                  name='approved_by'
                  required
                  options={usersOptionsFn}
                />
                <small className="text-gray-500 text-xs mt-1 block">
                  Final approver for this request
                </small>
              </div>
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
                  key={`activity-${watch("activity")}`}
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
                          key={`fconumber-${JSON.stringify(field.value)}`}
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
            </div>
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
                          key={`intervention_areas-${JSON.stringify(field.value)}`}
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
              {errors.intervention_areas && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.intervention_areas.message}
                </span>
              )}
            </div>
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
                          key={`budget_line-${JSON.stringify(field.value)}`}
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
            </div>
            <div>
              <Label className='font-semibold'>Module</Label>
              {modulesLoading ? (
                <div className="p-4 text-center text-gray-500">Loading modules...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='module'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          key={`module-${JSON.stringify(field.value)}`}
                          options={modulesOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={modulesOptions.length === 0 ? 'No modules available' : 'Select Module'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {errors.module && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.module.message}
                </span>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-5'>
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
                          key={`cost_categories-${JSON.stringify(field.value)}`}
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
            </div>
            <div>
              <Label className='font-semibold'>Cost Grouping</Label>
              {costGroupingsLoading ? (
                <div className="p-4 text-center text-gray-500">Loading cost groupings...</div>
              ) : (
                <FormField
                  control={form.control}
                  name='cost_grouping'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          key={`cost_grouping-${JSON.stringify(field.value)}`}
                          options={costGroupingsOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={costGroupingsOptions.length === 0 ? 'No cost groupings available' : 'Select Cost Grouping'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {errors.cost_grouping && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.cost_grouping.message}
                </span>
              )}
            </div>
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
                          key={`cost_input-${JSON.stringify(field.value)}`}
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
            </div>
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
                          key={`funding_source-${JSON.stringify(field.value)}`}
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
                    quantity: "",
                    num_of_days: "",
                    unit_cost: "",
                    total_cost: 0,
                  })
                }
              >
                <AddSquareIcon />
                Add new expenses item row
              </FormButton>

              <FormButton
                loading={isSubmitting || isUpdatingMemo || isUpdatingPR}
                disabled={isSubmitting || isUpdatingMemo || isUpdatingPR}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                <LongArrowRight />
                {isSubmitting || isUpdatingMemo || isUpdatingPR ? "Updating..." : "Update Purchase Request"}
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditPurchaseRequestForm;