"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/Card";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { toast } from "sonner";
import { 
  useGetSingleWorkPlanActivity,
  useUpdateWorkPlanActivity 
} from "@/features/programs/controllers/workPlanController";
import { useEffect } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import {
  TWorkPlanTrackerFormValues,
  WorkPlanTrackerSchema,
} from "features/programs/types/activity-tracker";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: true },
  { name: "Edit", icon: false },
];

export default function CreateActivityTracker() {
  const searchParams = useSearchParams();
  const params = useParams();
  const activityId = searchParams.get("id");
  const workPlanId = searchParams.get("plan") || (params.id as string);

  const { updateWorkPlanActivity, isLoading } =
    useUpdateWorkPlanActivity(workPlanId, activityId || "");

  const router = useRouter();

  // Use the new hook to get work plan activity
  const { data: workPlanActivity } = useGetSingleWorkPlanActivity(
    workPlanId,
    activityId || "",
    !!(workPlanId && activityId)
  );

  //   // Keep the old hook as fallback if needed
  //   const { data: workPlanTracker } = useGetSingleActivityTracker(
  //     activityId ?? skipToken
  //   );

  //   console.log({ workPlanActivity, workPlanTracker, activityId, workPlanId });

  const form = useForm<TWorkPlanTrackerFormValues>({
    resolver: zodResolver(WorkPlanTrackerSchema),
    defaultValues: {
      output_description: "",
      achieved_output: "",
      achievement_percentage: "",
      amount_expended_ngn: "",
      amount_expended_usd: "",
      implementation_usd_rate: "",
      expenditure_usd_rate: "",
      expenditure_ngn_rate: "",
      variance_ngn: "",
      variance_usd: "",
      percentage_variance_ngn: "",
      percentage_variance_usd: "",
      efficiency_output_expenditure_ratio: "",
      efficiency_output_expenditure_level: "",
      comments: "",
    },
  });

  useEffect(() => {
    // Prioritize workPlanActivity data, fallback to workPlanTracker
    const activityData = workPlanActivity?.data?.data;
    console.log("camp", { activityData });

    if (activityData && activityData.activity_trackers?.length > 0) {
      console.log({ ds: "hejhnn" });

      // Get the latest activity tracker data
      const latestTracker = activityData.activity_trackers[0];

      // Use description_of_output from main activity data and other fields from tracker
      const { description_of_output: output_description } = activityData;

      const {
        achieved_output_number: achieved_output,
        auto_calculated_achievement_percentage,
        amount_expended_ngn,
        amount_expended_usd,
        implementation_usd_rate,
        expenditure_usd_rate: expenditure_usd_rate,
        expenditure_ngn_rate,
        variance_ngn,
        variance_usd,
        percentage_variance_ngn,
        percentage_variance_usd,
        efficiency_output_expenditure_ratio,
        efficiency_output_expenditure_level,
        comments,
      } = latestTracker;

      console.log({ latestTracker });

      form.reset({
        output_description: String(output_description || ""),
        achieved_output: String(achieved_output || ""),
        achievement_percentage: String(
          auto_calculated_achievement_percentage || ""
        ),
        amount_expended_ngn: String(amount_expended_ngn || ""),
        amount_expended_usd: String(amount_expended_usd || ""),
        implementation_usd_rate: String(implementation_usd_rate || ""),
        expenditure_usd_rate: String(expenditure_usd_rate || ""),
        expenditure_ngn_rate: String(expenditure_ngn_rate || ""),
        variance_ngn: String(variance_ngn || ""),
        variance_usd: String(variance_usd || ""),
        percentage_variance_ngn: String(percentage_variance_ngn || ""),
        percentage_variance_usd: String(percentage_variance_usd || ""),
        efficiency_output_expenditure_ratio: String(
          efficiency_output_expenditure_ratio || ""
        ),
        efficiency_output_expenditure_level: String(
          efficiency_output_expenditure_level || ""
        ),
        comments: String(comments || ""),
      });
    }
  }, [workPlanActivity, form]);

  const { handleSubmit } = form;

  const goBack = () => {
    router.back();
  };

  const onSubmit: SubmitHandler<TWorkPlanTrackerFormValues> = async (data) => {
    try {
      await updateWorkPlanActivity(data);
      toast.success("Activity Tracker Updated");
      router.push(RouteEnum.PROGRAM_ACTIVITY_TRACKER);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className='space-y-6 min-h-screen'>
      <BreadcrumbCard list={breadcrumbs} />

      <button
        onClick={goBack}
        className='w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center'
      >
        <LongArrowLeft />
      </button>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className='space-y-10 p-10'>
            <div className='bg-red-100 py-5 px-2.5 rounded-md'>
              <h2 className='text-lg font-bold text-red-500'>
                Work Plan Tracker
              </h2>
            </div>

            <FormTextArea
              label='Description of Output'
              name='output_description'
              placeholder='Enter Output Description'
              required
            />

            <FormTextArea
              label='Achieved Output'
              name='achieved_output'
              placeholder='Enter Achieved Output'
              required
            />

            <FormInput
              type='number'
              label='Percentage of Achievement'
              name='achievement_percentage'
              required
              placeholder='Enter Percentage of Achievement'
            />

            <div className='bg-red-100 py-5 px-2.5 rounded-md'>
              <h2 className='text-lg font-bold text-red-500'>
                Variance Analysis
              </h2>
            </div>

            <FormInput
              type='number'
              label='Amount Expended (NGN)'
              name='amount_expended_ngn'
              placeholder='Enter Amount Expended NGN '
              required
            />

            <FormInput
              type='number'
              label='Amount Expended USD'
              name='amount_expended_usd'
              placeholder='Enter Amount Expended USD'
              required
            />

            <FormInput
              type='number'
              label='Implementation USD Rate'
              name='implementation_usd_rate'
              placeholder='Enter Implementation USD Rate'
              required
            />

            <FormInput
              type='number'
              label='Expenditure Rate NGN'
              name='expenditure_ngn_rate'
              placeholder='Enter Amount Expenditure Rate NGN'
              required
            />

            <FormInput
              type='number'
              label='Expenditure Rate USD'
              name='expenditure_usd_rate'
              placeholder='Enter Amount Expenditure Rate USD'
              required
            />

            <FormInput
              type='number'
              label='Variance NGN'
              name='variance_ngn'
              placeholder='Enter Variance NGN '
            />

            <FormInput
              type='number'
              label='Variance USD'
              name='variance_usd'
              placeholder='Enter Variance USD '
            />

            <FormInput
              type='number'
              label='Percentage Variance NGN'
              name='percentage_variance_ngn'
              placeholder='Enter Percentage Variance NGN'
              required
            />

            <FormInput
              type='number'
              label='Percentage Variance USD'
              name='percentage_variance_usd'
              placeholder='Enter Percentage Variance USD'
              required
            />

            <FormInput
              type='number'
              label='Efficiency Output vs Efficiency Ratio'
              name='efficiency_output_expenditure_ratio'
              placeholder='Enter Efficiency Output vs Efficiency Ratio'
              required
            />

            <FormInput
              type='number'
              label='Efficiency Output vs Efficiency Level'
              name='efficiency_output_expenditure_level'
              placeholder='Enter Efficiency Output vs Efficiency Level'
              required
            />

            <FormInput
              label='Comments'
              name='comments'
              placeholder='Enter Comments'
              required
            />
          </Card>

          <div className='flex justify-end gap-5 pt-10'>
            <FormButton
              onClick={goBack}
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              size='lg'
            >
              Cancel
            </FormButton>

            <FormButton loading={isLoading} disabled={isLoading} size='lg'>
              Submit
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
