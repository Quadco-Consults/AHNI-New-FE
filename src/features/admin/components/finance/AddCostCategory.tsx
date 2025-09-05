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
  CostCategorySchema,
  TCostCategoryData,
  TCostCategoryFormValues,
} from "@/features/admin/types/finance/cost-category";
import {
  useAddCostCategoryMutation,
  useUpdateCostCategoryMutation,
} from "@/features/modules/controllers/finance/costCategoryController";
import FormTextArea from "components/atoms/FormTextArea";

const AddCostCategory = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TCostCategoryData;

  const form = useForm<TCostCategoryFormValues>({
    resolver: zodResolver(CostCategorySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      code: data?.code ?? "",
    },
  });

  const [addCostCategory, { isLoading }] = useAddCostCategoryMutation();
  const [updateCostCategory, { isLoading: updateLoading }] =
    useUpdateCostCategoryMutation();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<TCostCategoryFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateCostCategory({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await addCostCategory(data);
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
            required
            placeholder='Enter Code'
          />

          <div className='flex justify-start'>
            <FormButton loading={isLoading || updateLoading}>Save</FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddCostCategory;
