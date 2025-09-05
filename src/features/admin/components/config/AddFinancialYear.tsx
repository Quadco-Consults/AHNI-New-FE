"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
  FinancialYearSchema,
  TFinancialYearData,
  TFinancialYearFormValues,
} from "@/features/admin/types/config/financial-year";
import {
  useAddFinancialYearMutation,
  useUpdateFinancialYearMutation,
} from "@/features/modules/controllers/config/financialYearController";

const AddFinancialYear = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TFinancialYearData;
  const form = useForm<TFinancialYearFormValues>({
    resolver: zodResolver(FinancialYearSchema),
    defaultValues: {
      year: data?.year ?? "",
    },
  });

  const [financialYear, { isLoading }] = useAddFinancialYearMutation();
  const [updateFinancialYear, { isLoading: updateFinancialYearLoading }] =
    useUpdateFinancialYearMutation();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<TFinancialYearFormValues> = async (data) => {
    try {
      if (dialogProps?.type === "update") {
        await updateFinancialYear({
          // @ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
      } else {
        await financialYear(data);
      }

      toast.success("Financial Year Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };
  return (
    <CardContent>
      <Form {...form}>
        <form
          action=''
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-7'
        >
          <FormInput
            label='Year'
            name='year'
            placeholder='Enter Year'
            required
          />
          {/* 
                    <FormInput
                        label="Dynamic Order"
                        name="dyanmic_order"
                        placeholder="Enter Dynamic Order"
                        type="number"
                        required
                    /> */}

          {/* <FormSelect
                        label="Current"
                        name="current"
                        placeholder="Select Current Status"
                        required
                        options={isCurrent}
                    /> */}

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateFinancialYearLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddFinancialYear;
