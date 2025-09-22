"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";

import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";

import { Separator } from "components/ui/separator";
import { RouteEnum } from "constants/RouterConstants";

import { SampleMemoSchema } from "@/features/procurement/types/procurement-validator";

import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { store } from "store/index";
import React from "react";
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
import ExpensesForm from "../activity-memo/form/ExpensesForm";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useUpdateActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useUpdatePurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("=== EDIT FORM DEBUG ===");
  console.log("Purchase Request Data:", purchaseRequestData);
  console.log("Activity Memo Data:", activityMemoData);
  console.log("Purchase Request ID:", purchaseRequestId);

  const { updateActivityMemo, isLoading: isUpdatingMemo } = useUpdateActivityMemo(activityMemoData?.id);
  const { updatePurchaseRequest, isLoading: isUpdatingPR } = useUpdatePurchaseRequest(purchaseRequestId);

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

  // Pre-populate form with existing data
  const form = useForm<z.infer<typeof SampleMemoSchema>>({
    resolver: zodResolver(SampleMemoSchema),
    defaultValues: {
      activity: activityMemoData?.activity || "",
      subject: activityMemoData?.subject || "",
      requested_date: activityMemoData?.requested_date || "",
      fconumber: activityMemoData?.fconumber || [],
      intervention_areas: activityMemoData?.intervention_areas || [],
      budget_line: activityMemoData?.budget_line || [],
      cost_categories: activityMemoData?.cost_categories || [],
      cost_input: activityMemoData?.cost_input || [],
      funding_source: activityMemoData?.funding_source || [],
      comment: activityMemoData?.comment || "",
      copy: activityMemoData?.copy || [],
      approved_by: activityMemoData?.approved_by || "",
      created_by: activityMemoData?.created_by || "",
      through: activityMemoData?.through || [],
      expenses: activityMemoData?.expenses || [],
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
    if (activityMemoData) {
      console.log("Resetting form with activity memo data:", activityMemoData);
      reset({
        activity: activityMemoData.activity || "",
        subject: activityMemoData.subject || "",
        requested_date: activityMemoData.requested_date || "",
        fconumber: activityMemoData.fconumber || [],
        intervention_areas: activityMemoData.intervention_areas || [],
        budget_line: activityMemoData.budget_line || [],
        cost_categories: activityMemoData.cost_categories || [],
        cost_input: activityMemoData.cost_input || [],
        funding_source: activityMemoData.funding_source || [],
        comment: activityMemoData.comment || "",
        copy: activityMemoData.copy || [],
        approved_by: activityMemoData.approved_by || "",
        created_by: activityMemoData.created_by || "",
        through: activityMemoData.through || [],
        expenses: activityMemoData.expenses || [],
      });
    }
  }, [activityMemoData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const onSubmit = async (data: z.infer<typeof SampleMemoSchema>) => {
    console.log("🚀 EDIT FORM SUBMISSION STARTED!");
    console.log("Form data received:", data);
    setIsSubmitting(true);

    try {
      // Update activity memo if it exists
      if (activityMemoData?.id) {
        console.log("Updating activity memo:", activityMemoData.id);
        const activityMemoUpdateData = {
          subject: data.subject,
          requested_date: data.requested_date,
          comment: data.comment,
          approved_by: data.approved_by,
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

        await updateActivityMemo(activityMemoUpdateData);
        console.log("✅ Activity memo updated successfully");
      }

      // Update purchase request items if available
      if (purchaseRequestData && data.expenses.length > 0) {
        console.log("Updating purchase request items...");
        const purchaseRequestUpdateData = {
          items: data.expenses.map((expense: any) => ({
            item: expense.item,
            quantity: expense.quantity,
            unit_cost: expense.unit_cost,
            amount: expense.total_cost || (parseFloat(expense.quantity || "0") * parseFloat(expense.unit_cost || "0")),
          })),
        };

        await updatePurchaseRequest(purchaseRequestUpdateData);
        console.log("✅ Purchase request updated successfully");
      }

      toast.success("Purchase request updated successfully!");

      // Navigate back to details page
      router.push(`/dashboard/procurement/purchase-request/${purchaseRequestId}/details`);

    } catch (error: any) {
      console.error("Failed to update purchase request:", error);
      toast.error(error?.message || "Failed to update purchase request. Please try again.");
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
              {errors.through && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.through.message}
                </span>
              )}
            </div>
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
            </div>
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