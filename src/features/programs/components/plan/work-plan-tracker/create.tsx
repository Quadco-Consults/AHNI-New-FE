"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormTextArea from "@/components/atoms/FormTextArea";
import LongArrowLeft from "@/components/icons/LongArrowLeft";
import Card from "@/components/Card";
import { Form } from "@/components/ui/form";
import { RouteEnum } from "@/constants/RouterConstants";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  useGetSingleWorkPlanActivity,
  useUpdateWorkPlanActivity
} from "@/features/programs/controllers/workPlanController";
import {
  useGetActivityTrackerByActivityId,
  usePatchActivityTracker,
  useCreateActivityTracker,
  useGetSingleActivityTracker
} from "@/features/programs/controllers/activityTrackerController";
import { useEffect, useState } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import {
  TWorkPlanTrackerFormValues,
  WorkPlanTrackerSchema,
} from "@/features/programs/types/activity-tracker";
import { formatNumberCurrency } from "@/utils/utls";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: true },
  { name: "Edit", icon: false },
];

export default function CreateActivityTracker() {
  const searchParams = useSearchParams();
  const params = useParams();
  const paramId = searchParams.get("id"); // Could be activityId or trackerId
  const workPlanId = searchParams.get("plan") || (params.id as string);

  // Current USD/NGN exchange rate (you can fetch this from an API or use a default)
  const [usdRate, setUsdRate] = useState(1600); // Default rate, can be updated
  const [trackerId, setTrackerId] = useState<string | null>(null);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();

  // Try to get single tracker data with the paramId - if it succeeds, we're in edit mode
  const { data: singleTrackerData } = useGetSingleActivityTracker(paramId || "", !!paramId);

  // Effect to determine if we're in edit mode and set the appropriate IDs
  useEffect(() => {
    if (paramId) {
      // If we can successfully fetch tracker data with this ID, we're in edit mode
      if (singleTrackerData?.data) {
        setIsEditMode(true);
        setTrackerId(paramId);
        setActivityId(singleTrackerData.data.work_plan_activity);
      } else if (singleTrackerData !== undefined) {
        // Only set create mode if the query has completed and returned undefined/null
        setIsEditMode(false);
        setActivityId(paramId);
        setTrackerId(null);
      }
    }
  }, [paramId, singleTrackerData]);

  // Get work plan activity for basic info
  const { data: workPlanActivity } = useGetSingleWorkPlanActivity(
    workPlanId,
    activityId || "",
    !!(workPlanId && activityId)
  );

  // Get existing tracker for this activity
  const { data: trackerData } = useGetActivityTrackerByActivityId(
    activityId || "",
    !!(activityId)
  );

  // Hooks for tracker operations
  const { createActivityTracker, isLoading: isCreating } = useCreateActivityTracker();
  const { patchActivityTracker, isLoading: isPatching } = usePatchActivityTracker(trackerId || "");

  // Legacy hook for activity updates (if needed)
  const { updateWorkPlanActivity } = useUpdateWorkPlanActivity(workPlanId, activityId || "");

  const isLoading = isCreating || isPatching;


  const form = useForm<TWorkPlanTrackerFormValues>({
    resolver: zodResolver(WorkPlanTrackerSchema),
    defaultValues: {
      description_of_output: "",
      achieved_results: "",
      amount_expended_ngn: "",
      comments: "",
    },
  });

  // Effect to set tracker ID when tracker data is loaded (for create mode)
  useEffect(() => {
    if (!isEditMode && trackerData?.data?.results?.length > 0) {
      const existingTracker = trackerData.data.results[0];
      setTrackerId(existingTracker.id);
    }
  }, [trackerData, isEditMode]);

  // Effect to populate form with existing data
  useEffect(() => {
    const activityData = workPlanActivity?.data?.data;
    // In edit mode, use single tracker data; in create mode, use tracker data by activity
    const existingTracker = isEditMode
      ? singleTrackerData?.data
      : trackerData?.data?.results?.[0];

    // Populate form with activity description
    if (activityData) {
      const { description_of_output } = activityData;

      // If we have existing tracker data, use that
      if (existingTracker) {
        form.reset({
          description_of_output: String(existingTracker.description_of_output || description_of_output || ""),
          achieved_results: String(existingTracker.achieved_results || existingTracker.achieved_output || ""),
          amount_expended_ngn: String(existingTracker.amount_expended_ngn || ""),
          comments: String(existingTracker.comments || ""),
        });

        // Set exchange rate if available
        if (existingTracker.implementation_usd_rate) {
          setUsdRate(parseFloat(existingTracker.implementation_usd_rate) || 1600);
        }
      } else {
        // If no tracker exists yet, just populate basic info
        form.reset({
          description_of_output: String(description_of_output || ""),
          achieved_results: "",
          amount_expended_ngn: "",
          comments: "",
        });
      }
    }
  }, [workPlanActivity, trackerData, singleTrackerData, isEditMode, form.reset]);

  const { handleSubmit, watch } = form;

  // Watch NGN amount to auto-calculate USD equivalent
  const amountNgn = watch("amount_expended_ngn");

  // Calculate USD amount automatically
  const amountUsd = amountNgn ? (parseFloat(amountNgn) / usdRate).toFixed(2) : "";

  // Display component for showing auto-calculated USD
  const AutoCalculatedField = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-600">
{formatNumberCurrency(parseFloat(value || "0"), "USD")} (Auto-calculated)
      </div>
      <p className="text-xs text-gray-500">Rate: {formatNumberCurrency(usdRate, "NGN")} per {formatNumberCurrency(1, "USD")}</p>
    </div>
  );

  const goBack = () => {
    router.back();
  };

  const onSubmit: SubmitHandler<TWorkPlanTrackerFormValues> = async (data) => {
    try {
      // Split data between activity and tracker fields
      const activityData = {
        description_of_output: data.description_of_output,
      };

      const trackerData = {
        achieved_output: data.achieved_results, // Map form field to correct API field
        amount_expended_ngn: data.amount_expended_ngn,
        amount_expended_usd: amountUsd,
        implementation_usd_rate: usdRate.toString(),
        // expenditure_ngn_rate and expenditure_usd_rate are auto-calculated on frontend
        comments: data.comments,
        work_plan_activity: activityId, // Required for creating new tracker
      };



      if (trackerId) {
        // Update existing tracker
        await patchActivityTracker(trackerData);
        toast.success("Activity Tracker Updated");
      } else {
        // Create new tracker
        await createActivityTracker(trackerData as any);
        toast.success("Activity Tracker Created");
      }

      // Optionally update activity description if needed
      if (activityData.description_of_output) {
        await updateWorkPlanActivity(activityData);
      }

      // Redirect back to the specific work plan tracker details page
      router.push(`/dashboard/programs/plan/activity-tracker/${workPlanId}`);
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
              name='description_of_output'
              placeholder='Enter Output Description'
              required
            />

            <FormInput
              type='number'
              label='Achieved Output (Number)'
              name='achieved_results'
              placeholder='Enter number of outputs achieved (e.g., 10)'
              required
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

            <AutoCalculatedField
              label="Amount Expended (USD)"
              value={amountUsd}
            />

            {/* Exchange Rate Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Current USD Exchange Rate (NGN per USD)
              </label>
              <input
                type="number"
                value={usdRate}
                onChange={(e) => setUsdRate(parseFloat(e.target.value) || 1600)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current USD rate"
              />
              <p className="text-xs text-gray-500">
                This will be used to calculate the USD equivalent automatically
              </p>
            </div>

            {/* Expenditure Rate fields are auto-calculated and displayed in the table */}
            {/* They are calculated as: (Amount Expended / Total Budget) × 100 */}


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
