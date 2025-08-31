"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import DateInput from "@/components/DateInput";
import { Form } from "@/components/ui/form";
import {
  ExpenditureSchema,
  IExpenditurePaginatedData,
  TExpenditureFormData,
} from "@/features/contracts-grants/types/grants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateExpenditure,
  useModifyExpenditure,
} from "@/features/contracts-grants/controllers/expenditureController";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";
import { useMemo } from "react";
import { formatNumberCurrency } from "utils/utls";

export default function ExpenditureModal() {
  const { dialogProps } = useAppSelector((state) => state.ui.dailog);

  const expenditure =
    dialogProps?.expenditure as unknown as IExpenditurePaginatedData;

  const form = useForm<TExpenditureFormData>({
    resolver: zodResolver(ExpenditureSchema),
    defaultValues: {
      amount: expenditure?.amount ?? "",
      description: expenditure?.description ?? "",
      work_plan_activity: expenditure?.work_plan_activity ?? "",
      date: expenditure?.date ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const grantId = dialogProps?.grantId as string;

  const { createExpenditure, isLoading: isCreateLoading } =
    useCreateExpenditure(grantId || "");

  const { updateExpenditure, isLoading: isModifyLoading } =
    useModifyExpenditure(grantId || "", expenditure?.id || "");

  // Get project data to calculate balance
  const { data: projectData } = useGetSingleProject(grantId || "");

  // Fetch work plan activities for the project/grant
  const { data: activitiesData } = useGetAllActivityPlans({
    project: grantId, // Using grantId as project ID
    size: 1000, // Get all activities
    enabled: !!grantId,
  });

  // Create options for the activity dropdown
  const activityOptions = useMemo(() => {
    if (!activitiesData?.data?.results) return [];
    
    console.log("Available activities:", activitiesData.data.results);
    
    return activitiesData.data.results.map((activity) => ({
      value: activity.work_plan_activity,
      label: `${activity.work_plan_activity_identifier} - ${activity.activity_name}`,
    }));
  }, [activitiesData]);

  // Calculate current balance
  const currentBalance = useMemo(() => {
    if (!projectData?.data) return 0;
    const obligation = parseFloat(projectData.data.total_obligation_amount || "0");
    const expenditure = parseFloat(projectData.data.total_expenditure_amount || "0");
    return obligation - expenditure;
  }, [projectData]);

  const onSubmit: SubmitHandler<TExpenditureFormData> = async (data) => {
    if (!grantId) {
      toast.error("Grant ID is required");
      return;
    }
    
    console.log("Submitting expenditure data:", data);
    console.log("Grant ID:", grantId);
    console.log("Available activity options:", activityOptions);
    
    // Prepare submit data with correct field names
    const submitData = { ...data };
    
    // If work_plan_activity is empty or not a valid UUID, remove it from the data
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (
      !submitData.work_plan_activity ||
      typeof submitData.work_plan_activity !== "string" ||
      submitData.work_plan_activity.trim() === "" ||
      !uuidRegex.test(submitData.work_plan_activity)
    ) {
      delete submitData.work_plan_activity;
    }

    // Format date to YYYY-MM-DD if it's a Date object
    if (submitData.date) {
      let formattedDate = submitData.date;
      if (typeof formattedDate === 'object' && (formattedDate as Date).toISOString) {
        // Safely cast and format if it's a Date object
        formattedDate = (formattedDate as Date).toISOString().split('T')[0];
      } else if (typeof formattedDate === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        const dateObj = new Date(formattedDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().slice(0, 10);
        }
      }
      submitData.date = formattedDate;
    }
    
    console.log("Final submit data:", submitData);
    
    try {
      if (expenditure?.id) {
        await updateExpenditure(submitData);
        toast.success("Expenditure Updated");
      } else {
        await createExpenditure(submitData);
        toast.success("Expenditure Created");
      }

      dispatch(closeDialog());
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message ?? error?.message ?? "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        {/* Balance Display */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">
            Available Balance: {formatNumberCurrency(currentBalance.toString(), "USD")}
          </p>
        </div>

        <DateInput
          label='Date'
          name='date'
          required
        />

        <FormSelect
          label='Work Plan Activity (Optional)'
          name='work_plan_activity'
          placeholder='Select Work Plan Activity (Optional)'
          options={activityOptions}
        />

        <FormInput
          type='number'
          label='Amount'
          name='amount'
          placeholder='Enter Amount'
          required
        />

        <FormTextArea
          label='Description'
          name='description'
          placeholder='Enter Description'
          required
        />

        <div className='flex justify-end'>
          <FormButton size='lg' loading={isCreateLoading || isModifyLoading}>
            Submit
          </FormButton>
        </div>
      </form>
    </Form>
  );
}