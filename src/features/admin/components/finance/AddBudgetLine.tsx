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
  BudgetLineSchema,
  TBudgetLineData,
  TBudgetLineFormValues,
} from "@/features/admin/types/finance/budget-line";
import {
  useAddBudgetLineMutation,
  useUpdateBudgetLineMutation,
} from "@/features/modules/controllers/finance/budgetLineController";
import FormTextArea from "components/atoms/FormTextArea";

const AddBudgetLine = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TBudgetLineData;
  const form = useForm<TBudgetLineFormValues>({
    resolver: zodResolver(BudgetLineSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      code: data?.code ?? "",
    },
  });

  const [addBudgetLine, { isLoading }] = useAddBudgetLineMutation();

  const [updateBudgetLine, { isLoading: isUpdateLoading }] =
    useUpdateBudgetLineMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TBudgetLineFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateBudgetLine({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await addBudgetLine(data);
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
            label='Title'
            name='name'
            placeholder='Enter Name'
            required
          />

          <FormTextArea
            label='Description'
            placeholder='Enter Description'
            name='description'
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

export default AddBudgetLine;
