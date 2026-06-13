"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormCheckBox from "@/components/FormCheckBox";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import {
  ExchangeRateSchema,
  ExchangeRateFormValues,
  IExchangeRate,
} from "@/features/admin/types/config/exchange-rate";
import {
  useAddExchangeRateMutation,
  useUpdateExchangeRateMutation,
} from "@/features/modules/controllers/config/exchangeRateController";

const AddExchangeRate = () => {
  const { dialogProps } = useAppSelector(dialogSelector);

  const data = dialogProps?.data as unknown as IExchangeRate;

  const form = useForm<ExchangeRateFormValues>({
    resolver: zodResolver(ExchangeRateSchema),
    defaultValues: {
      base_currency: data?.base_currency ?? "",
      target_currency: data?.target_currency ?? "",
      exchange_rate: data?.exchange_rate ?? 0,
      effective_date: data?.effective_date ? data.effective_date.split('T')[0] : "",
      expiry_date: data?.expiry_date ? data.expiry_date.split('T')[0] : "",
      source: data?.source ?? "",
      notes: data?.notes ?? "",
      is_active: data?.is_active ?? true,
    },
  });

  const dispatch = useAppDispatch();

  const [addExchangeRate, { isLoading: isAddLoading }] = useAddExchangeRateMutation();

  const { updateExchangeRate, isLoading: isUpdateLoading } = useUpdateExchangeRateMutation(data?.id || "");

  const currencyOptions = [
    { label: "NGN - Nigerian Naira", value: "NGN" },
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
    { label: "CAD - Canadian Dollar", value: "CAD" },
    { label: "AUD - Australian Dollar", value: "AUD" },
    { label: "JPY - Japanese Yen", value: "JPY" },
    { label: "CHF - Swiss Franc", value: "CHF" },
  ];

  const sourceOptions = [
    { label: "Central Bank of Nigeria (CBN)", value: "CBN" },
    { label: "Commercial Bank", value: "Bank" },
    { label: "Manual Entry", value: "Manual" },
    { label: "External API", value: "API" },
  ];

  const onSubmit: SubmitHandler<ExchangeRateFormValues> = async (formData) => {
    try {
      if (dialogProps?.type === "update") {
        await updateExchangeRate(formData);
      } else {
        await addExchangeRate(formData);
      }

      toast.success(
        dialogProps?.type === "update"
          ? "Exchange Rate Updated Successfully"
          : "Exchange Rate Added Successfully"
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
            label='Base Currency'
            name='base_currency'
            placeholder='Select base currency'
            options={currencyOptions}
            required
          />

          <FormSelect
            label='Target Currency'
            name='target_currency'
            placeholder='Select target currency'
            options={currencyOptions}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label='Exchange Rate'
            name='exchange_rate'
            placeholder='Enter exchange rate'
            type="number"
            step="0.0001"
            required
          />

          <FormSelect
            label='Source'
            name='source'
            placeholder='Select source'
            options={sourceOptions}
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

        <FormTextArea
          label='Notes'
          name='notes'
          placeholder='Enter additional notes (optional)'
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

export default AddExchangeRate;