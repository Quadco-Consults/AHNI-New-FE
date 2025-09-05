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
  SupervisionCategorySchema,
  TSupervisionCategoryData,
  TSupervisionCategoryFormValues,
} from "@/features/programs/types/program/supervision-category";
import {
  useAddSupervisionCategory,
  useUpdateSupervisionCategory,
} from "@/features/modules/controllers/program/supervisionCategoryController";
import FormTextArea from "@/components/FormTextArea";

const AddSupervisionCategory = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TSupervisionCategoryData;

  const form = useForm<TSupervisionCategoryFormValues>({
    resolver: zodResolver(SupervisionCategorySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const [supervisionCategory, { isLoading }] = useAddSupervisionCategory();
  const [updateSupervisionCategory, { isLoading: updateSupervisionLoading }] =
    useUpdateSupervisionCategory();

  const onSubmit: SubmitHandler<TSupervisionCategoryFormValues> = async (
    data
  ) => {
    try {
      dialogProps?.type === "update"
        ? await updateSupervisionCategory({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await supervisionCategory(data);
      toast.success("Supervision Category Added Succesfully");
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
            placeholder='Enter Description'
            name='description'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateSupervisionLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddSupervisionCategory;
