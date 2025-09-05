"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
  ChartAccountSchema,
  TChartAccountData,
  TChartAccountFormValues,
} from "@/features/admin/types/finance/chart-account";
import {
  useAddChartAccountMutation,
  useUpdateChartAccountMutation,
} from "@/features/modules/controllers/finance/chartAccountController";
import FormTextArea from "components/atoms/FormTextArea";

const AddChartsOfAccount = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TChartAccountData;

  const form = useForm<TChartAccountFormValues>({
    resolver: zodResolver(ChartAccountSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",

      code: data?.code ?? "",
    },
  });

  const [addChartAccount, { isLoading }] = useAddChartAccountMutation();

  const [updateChartAccount, { isLoading: isUpdateLoading }] =
    useUpdateChartAccountMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TChartAccountFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateChartAccount({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await addChartAccount(data);
      toast.success("Category Added Succesfully");
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
            label='Name'
            name='name'
            placeholder='Enter Name'
            required
          />

          <FormTextArea
            label='Description'
            name='description'
            placeholder='Enter Description'
          />

          <FormInput
            label='Code'
            name='code'
            placeholder='Enter Code'
            required
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || isUpdateLoading}>Save</FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddChartsOfAccount;
