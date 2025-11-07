"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import FormCheckbox from "components/atoms/FormCheckbox";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
  TravelRateSchema,
  TravelRateFormValues,
  ITravelRate,
} from "@/features/admin/types/config/travel-rate";
import {
  useAddTravelRateMutation,
  useUpdateTravelRateMutation,
} from "@/features/modules/controllers/config/travelRateController";

const AddTravelRate = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as ITravelRate;

  const form = useForm<TravelRateFormValues>({
    resolver: zodResolver(TravelRateSchema),
    defaultValues: {
      state: data?.state ?? "",
      accommodation_rate: data?.accommodation_rate ?? 0,
      meal_allowance: data?.meal_allowance ?? 0,
      effective_date: data?.effective_date ? data.effective_date.split('T')[0] : "",
      notes: data?.notes ?? "",
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

  const nigerianStates = [
    { label: "Abia", value: "Abia" },
    { label: "Adamawa", value: "Adamawa" },
    { label: "Akwa Ibom", value: "Akwa Ibom" },
    { label: "Anambra", value: "Anambra" },
    { label: "Bauchi", value: "Bauchi" },
    { label: "Bayelsa", value: "Bayelsa" },
    { label: "Benue", value: "Benue" },
    { label: "Borno", value: "Borno" },
    { label: "Cross River", value: "Cross River" },
    { label: "Delta", value: "Delta" },
    { label: "Ebonyi", value: "Ebonyi" },
    { label: "Edo", value: "Edo" },
    { label: "Ekiti", value: "Ekiti" },
    { label: "Enugu", value: "Enugu" },
    { label: "FCT", value: "FCT" },
    { label: "Gombe", value: "Gombe" },
    { label: "Imo", value: "Imo" },
    { label: "Jigawa", value: "Jigawa" },
    { label: "Kaduna", value: "Kaduna" },
    { label: "Kano", value: "Kano" },
    { label: "Katsina", value: "Katsina" },
    { label: "Kebbi", value: "Kebbi" },
    { label: "Kogi", value: "Kogi" },
    { label: "Kwara", value: "Kwara" },
    { label: "Lagos", value: "Lagos" },
    { label: "Nasarawa", value: "Nasarawa" },
    { label: "Niger", value: "Niger" },
    { label: "Ogun", value: "Ogun" },
    { label: "Ondo", value: "Ondo" },
    { label: "Osun", value: "Osun" },
    { label: "Oyo", value: "Oyo" },
    { label: "Plateau", value: "Plateau" },
    { label: "Rivers", value: "Rivers" },
    { label: "Sokoto", value: "Sokoto" },
    { label: "Taraba", value: "Taraba" },
    { label: "Yobe", value: "Yobe" },
    { label: "Zamfara", value: "Zamfara" },
  ];

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
            placeholder='Select Nigerian state'
            options={nigerianStates}
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

        <FormCheckbox
          label='Active'
          name='is_active'
          description='Check to make this travel rate active'
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