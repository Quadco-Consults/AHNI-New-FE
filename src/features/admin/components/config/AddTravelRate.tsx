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
      location: data?.location ?? "",
      state: data?.state ?? "",
      country: data?.country ?? "",
      accommodation_rate: data?.accommodation_rate ?? 0,
      meal_allowance: data?.meal_allowance ?? 0,
      transport_allowance: data?.transport_allowance ?? 0,
      per_diem_rate: data?.per_diem_rate ?? 0,
      currency: data?.currency ?? "NGN",
      effective_date: data?.effective_date ? data.effective_date.split('T')[0] : "",
      expiry_date: data?.expiry_date ? data.expiry_date.split('T')[0] : "",
      category: data?.category ?? "Local",
      staff_level: data?.staff_level ?? "",
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

  const staffLevelOptions = [
    { label: "All Levels", value: "" },
    { label: "Level 1-5", value: "Level 1-5" },
    { label: "Level 6-10", value: "Level 6-10" },
    { label: "Level 11-15", value: "Level 11-15" },
    { label: "Level 16+", value: "Level 16+" },
    { label: "Directors", value: "Directors" },
    { label: "Management", value: "Management" },
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
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label='Location'
            name='location'
            placeholder='Enter city/location'
            required
          />

          <FormInput
            label='State'
            name='state'
            placeholder='Enter state'
            required
          />

          <FormInput
            label='Country'
            name='country'
            placeholder='Enter country'
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label='Category'
            name='category'
            placeholder='Select travel category'
            options={categoryOptions}
            required
          />

          <FormSelect
            label='Currency'
            name='currency'
            placeholder='Select currency'
            options={currencyOptions}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label='Accommodation Rate'
            name='accommodation_rate'
            placeholder='Enter accommodation rate'
            type="number"
            step="0.01"
            required
          />

          <FormInput
            label='Per Diem Rate'
            name='per_diem_rate'
            placeholder='Enter per diem rate'
            type="number"
            step="0.01"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label='Meal Allowance'
            name='meal_allowance'
            placeholder='Enter meal allowance'
            type="number"
            step="0.01"
            required
          />

          <FormInput
            label='Transport Allowance'
            name='transport_allowance'
            placeholder='Enter transport allowance'
            type="number"
            step="0.01"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label='Effective Date'
            name='effective_date'
            placeholder='Select effective date'
            type="date"
            required
          />

          <FormInput
            label='Expiry Date'
            name='expiry_date'
            placeholder='Select expiry date (optional)'
            type="date"
          />
        </div>

        <FormSelect
          label='Staff Level'
          name='staff_level'
          placeholder='Select applicable staff level (optional)'
          options={staffLevelOptions}
        />

        <FormTextArea
          label='Notes'
          name='notes'
          placeholder='Enter additional notes (optional)'
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