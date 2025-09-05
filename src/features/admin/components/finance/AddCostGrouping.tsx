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
  CostInputSchema,
  TCostInputData,
  TCostInputFormValues,
} from "@/features/admin/types/finance/cost-input";

import {
  useAddCostGroupingMutation,
  useUpdateCostGroupingMutation,
} from "@/features/modules/controllers/finance/costGroupingController";

const AddCostGrouping = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TCostInputData;

  const form = useForm<TCostInputFormValues>({
    resolver: zodResolver(CostInputSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      code: data?.code ?? "",
    },
  });

  const [addCostGrouping, { isLoading }] = useAddCostGroupingMutation();
  const [updateCostGrouping, { isLoading: isUpdateLoading }] =
    useUpdateCostGroupingMutation();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<TCostInputFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateCostGrouping({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await addCostGrouping(data);
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
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-7'
        >
          <FormInput
            label='Name'
            name='name'
            placeholder='Enter Name'
            required
          />

          <FormInput
            label='Code'
            name='code'
            required
            placeholder='Enter Code'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || isUpdateLoading}>Save</FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddCostGrouping;
