"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
  RiskCategorySchema,
  TRiskCategoryData,
  TRiskCategoryFormValues,
} from "@/features/programs/types/program/risk-category";
import {
  useAddRiskCategory,
  useUpdateRiskCategory,
} from "@/features/modules/controllers/program/riskCategoryController";
import FormTextArea from "@/components/FormTextArea";

const AddRiskCategory = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TRiskCategoryData;

  const form = useForm<TRiskCategoryFormValues>({
    resolver: zodResolver(RiskCategorySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const { addRiskCategory: riskCategory, isLoading } = useAddRiskCategory();
  const { updateRiskCategory, isLoading: updateRiskLoading } =
    useUpdateRiskCategory();

  const onSubmit: SubmitHandler<TRiskCategoryFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateRiskCategory({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await riskCategory(data);
      toast.success("Risk Category Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
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
            placeholder='Enter Description'
            name='description'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateRiskLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddRiskCategory;
