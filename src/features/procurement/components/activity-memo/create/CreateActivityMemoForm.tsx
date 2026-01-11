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

// Import master config API hooks (unrestricted)
import {
  useGetFCONumbersDropdown,
  useGetBudgetLinesDropdown,
  useGetCostCategoriesDropdown,
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

  // Use master config API for dropdown data (bypasses permission filtering)
  const { data: fco, isLoading: isFcoLoading, error: fcoError } = useGetFCONumbersDropdown();
  const { data: budgetLines, isLoading: isBudgetLinesLoading, error: budgetLinesError } = useGetBudgetLinesDropdown();
  const { data: costCategories, isLoading: isCostCategoriesLoading, error: costCategoriesError } = useGetCostCategoriesDropdown();
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

  const costCategoriesOptions = React.useMemo(() => {
    if (!costCategories || costCategories.length === 0) {
      console.log('💰 Cost Categories: Empty or loading...', { hasData: !!costCategories, count: costCategories?.length || 0 });
      return [];
    }
    return costCategories.map((item: any) => ({
      id: item.id,
      name: item.name || item.cost_category_name || 'Unnamed Cost Category'
    }));
  }, [costCategories]);

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
        quantity: exp.quantity || "",
        num_of_days: exp.num_of_days || 0,
        unit_cost: exp.unit_cost || "",
        total_cost: exp.total_cost || 0,
      })) || [],
    } : savedFormData || {
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

  // Calculate totals
  useEffect(() => {
    watchedExpenses.forEach((expense: any, index: number) => {
      const quantity = parseFloat(expense?.quantity || 0);
      const unitCost = parseFloat(expense?.unit_cost || 0);
      const totalCost = quantity * unitCost;

      if (expense?.total_cost !== totalCost) {
        setValue(`expenses.${index}.total_cost`, totalCost || 0);
      }
    });
  }, [watchedExpenses, setValue]);

  const calculateGrandTotal = () => {
    return watchedExpenses.reduce((sum: number, expense: any) => {
      const quantity = parseFloat(expense?.quantity || 0);
      const unitCost = parseFloat(expense?.unit_cost || 0);
      return sum + (quantity * unitCost);
    }, 0);
  };

  // Auto-set created_by to current user
  useEffect(() => {
    if (profile?.data?.id) {
      setValue('created_by', profile.data.id);
    }
  }, [profile, setValue]);

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
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label className="font-semibold">Cost Category</Label>
                  <FormField
                    control={control}
                    name="cost_categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={costCategoriesOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select Cost Category"
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

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-5 mt-5 p-4 border rounded-lg">
                  <FormField
                    control={control}
                    name={`expenses.${index}.item`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedItem = itemsLookup[value];
                            if (selectedItem?.uom) {
                              setValue(`expenses.${index}.uom`, selectedItem.uom);
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {itemsOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormInput
                    label="Description"
                    name={`expenses.${index}.description`}
                    placeholder="Enter description"
                  />

                  <FormInput
                    label="Quantity"
                    name={`expenses.${index}.quantity`}
                    type="number"
                    placeholder="0"
                  />

                  <FormInput
                    label="Unit Cost (₦)"
                    name={`expenses.${index}.unit_cost`}
                    type="number"
                    placeholder="0.00"
                  />

                  <FormInput
                    label="UOM"
                    name={`expenses.${index}.uom`}
                    placeholder="Unit of Measure"
                  />

                  <div className="flex items-end">
                    <div className="flex-1">
                      <FormLabel>Total Cost (₦)</FormLabel>
                      <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50 font-semibold">
                        {(parseFloat(watchedExpenses[index]?.quantity || 0) *
                          parseFloat(watchedExpenses[index]?.unit_cost || 0)).toLocaleString()}
                      </div>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <MinusCircle size={20} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-4">
                <Button
                  type="button"
                  className="text-primary bg-[#FFF2F2] flex gap-2"
                  onClick={() =>
                    append({
                      item: "",
                      description: "",
                      quantity: 1,
                      unit_cost: 0,
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