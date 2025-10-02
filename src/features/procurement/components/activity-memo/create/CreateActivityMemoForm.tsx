"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { MinusCircle } from "lucide-react";

// Import controllers
import { useGetAllUsers, useGetUserProfile } from "@/features/auth/controllers/userController";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetAllBudgetLines } from "@/features/modules/controllers/finance/budgetLineController";
import { useGetAllCostCategories } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetAllCostInputs } from "@/features/modules/controllers/finance/costInputController";
import { useGetAllFundingSources } from "@/features/modules/controllers/project/fundingSourceController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useCreateActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { SampleMemoSchema } from "@/features/procurement/types/procurement-validator";

const CreateActivityMemoForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all required data
  const { data: users } = useGetAllUsers({ page: 1, size: 2000000 });
  const { data: profile } = useGetUserProfile();
  const { data: activites } = useGetAllActivityPlans({ page: 1, size: 2000000 });
  const { data: fco } = useGetAllFCONumbers({ page: 1, size: 2000000 });
  const { data: budgetLines } = useGetAllBudgetLines({ page: 1, size: 2000000 });
  const { data: costCategories } = useGetAllCostCategories({ page: 1, size: 2000000 });
  const { data: costInput } = useGetAllCostInputs({ page: 1, size: 2000000 });
  const { data: fundingSource } = useGetAllFundingSources({ page: 1, size: 2000000 });
  const { data: interventions } = useGetAllInterventionAreas({ page: 1, size: 20000 });
  const { data: items } = useGetAllItems({ page: 1, size: 2000000 });

  const { createActivityMemo, isLoading: isCreating } = useCreateActivityMemo();

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

  const fcoOptions = React.useMemo(() =>
    (fco as any)?.data?.results?.map((item: any) => ({
      id: item.id,
      name: item.name || item.number || item.code || 'Unnamed FCO'
    })) || [], [fco]);

  const budgetLinesOptions = React.useMemo(() =>
    (budgetLines as any)?.data?.results?.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    })) || [], [budgetLines]);

  const costCategoriesOptions = React.useMemo(() =>
    (costCategories as any)?.data?.results?.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    })) || [], [costCategories]);

  const costInputOptions = React.useMemo(() =>
    (costInput as any)?.data?.results?.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    })) || [], [costInput]);

  const fundingSourceOptions = React.useMemo(() =>
    (fundingSource as any)?.data?.results || [], [fundingSource]);

  const interventionsOptions = React.useMemo(() =>
    (interventions as any)?.data?.results?.map(({ code, id }: any) => ({
      id,
      name: code,
    })) || [], [interventions]);

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

  const savedFormData = loadSavedFormData();

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
      created_by: "",
      through: [],
      expenses: [],
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const watchedValues = watch();

  // Auto-save
  useEffect(() => {
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
  }, [watchedValues]);

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

      await createActivityMemo(activityMemoData);

      toast.success("Activity Memo created successfully!");
      if (typeof window !== 'undefined') {
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
      router.push("/dashboard/procurement/activity-memo");
    } catch (error) {
      console.error("Error creating activity memo:", error);
      toast.error("Failed to create activity memo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Activity Memo
        </h2>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {/* Reviewer, Authorizer, and Approver */}
            <div className="grid grid-cols-3 gap-5">
              <div>
                <Label className="font-semibold">Reviewer</Label>
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
                          placeholder="Select Reviewer(s)"
                          variant="inverted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <Label className="font-semibold">Authorizer</Label>
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
                          placeholder="Select Authorizer(s)"
                          variant="inverted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormSelect
                  label="Approver (To)"
                  name="approved_by"
                  required
                  placeholder="Select Approver"
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