"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import FormCheckBox from "@/components/FormCheckBox";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import {
  TravelRateSchema,
  TravelRateFormValues,
  ITravelRate,
} from "@/features/admin/types/config/travel-rate";
import {
  useAddTravelRateMutation,
  useUpdateTravelRateMutation,
} from "@/features/modules/controllers/config/travelRateController";
import { useGetAllStatesQuery } from "@/features/modules/controllers/config/stateController";

const AddTravelRate = () => {
  const { dialogProps } = useAppSelector(dialogSelector);

  const data = dialogProps?.data as unknown as ITravelRate;

  // Fetch states from our states system
  const { data: statesData } = useGetAllStatesQuery({
    page: 1,
    size: 50, // Get all states
    search: ""
  });

  const form = useForm<TravelRateFormValues>({
    resolver: zodResolver(TravelRateSchema),
    defaultValues: {
      state: data?.state_name || data?.state || "",
      // Handle both frontend and backend field names
      accommodation_rate: data?.lodging_rate || data?.accommodation_rate || 0,
      meal_allowance: data?.mie_rate || data?.meal_allowance || 0,
      effective_date: data?.effective_date ? data.effective_date.split('T')[0] : "",
      notes: data?.notes || "",
      is_active: data?.is_active ?? true,
    },
  });

  const dispatch = useAppDispatch();

  const [addTravelRate, { isLoading: isAddLoading }] = useAddTravelRateMutation();

  const { updateTravelRate, isLoading: isUpdateLoading } = useUpdateTravelRateMutation(data?.id || "");

  const currencyOptions = [
    { label: "NGN - Nigerian Naira", value: "NGN" },
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
  ];

  const categoryOptions = [
    { label: "Local", value: "Local" },
    { label: "Regional", value: "Regional" },
    { label: "International", value: "International" },
  ];

  // Generate state options from our states system
  const stateOptions = statesData?.data?.results?.map((state) => ({
    label: `${state.name} (${state.code})`,
    value: state.name,
  })) || [];

  const onSubmit: SubmitHandler<TravelRateFormValues> = async (formData) => {
    try {
      if (dialogProps?.type === "update") {
        await updateTravelRate(formData);
      } else {
        await addTravelRate(formData);
      }

      toast.success(
        dialogProps?.type === "update"
          ? "Travel Rate Updated Successfully"
          : "Travel Rate Added Successfully"
      );
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  return (
    <Form {...form}>
      <form
        action=''
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-y-7'
      >
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label='State'
            name='state'
            placeholder={statesData?.data?.results?.length ? 'Select Nigerian state' : 'Loading states...'}
            options={stateOptions}
            required
          />

          <FormInput
            label='Effective Date'
            name='effective_date'
            placeholder='Select effective date'
            type="date"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label='Accommodation Rate (₦)'
            name='accommodation_rate'
            placeholder='Enter daily lodging rate'
            type="number"
            step="0.01"
            required
          />

          <FormInput
            label='Meal & Incidental Expenses (₦)'
            name='meal_allowance'
            placeholder='Enter daily meal allowance'
            type="number"
            step="0.01"
            required
          />
        </div>

        <FormTextArea
          label='Notes (Optional)'
          name='notes'
          placeholder='Enter additional notes about this travel rate'
        />

        <FormCheckBox
          label='Active'
          name='is_active'
        />

        <div className='flex justify-start gap-4'>
          <FormButton loading={isAddLoading || isUpdateLoading}>
            {dialogProps?.type === "update" ? "Update" : "Save"}
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default AddTravelRate;