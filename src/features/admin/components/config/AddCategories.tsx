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
  CategorySchema,
  TCategoryData,
  TCategoryFormValues,
} from "@/features/admin/types/config/category";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "@/features/modules/controllers/config/categoryController";
import { useGetAllJobCategories } from "@/features/modules/controllers/config/jobCategoryController";
import FormTextArea from "components/atoms/FormTextArea";

const AddCategories = () => {
  const { dialogProps } = useAppSelector(dailogSelector);
  const { data: jobCategoriesData, isLoading: jobCategoriesLoading } =
    useGetAllJobCategories();

  const data = dialogProps?.data as unknown as TCategoryData;
  const form = useForm<TCategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      // @ts-ignore
      job_category: data?.job_category ?? undefined,
      serial_number: data?.serial_number ?? "",
      code: data?.code ?? "",
    },
  });

  const [category, { isLoading }] = useAddCategoryMutation();

  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TCategoryFormValues> = async (data) => {
    console.log({ data });

    try {
      if (dialogProps?.type === "update") {
        await updateCategory({
          //@ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
      } else {
        await category(data);
      }

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
            name='description'
            placeholder='Enter Description'
          />

          <FormInput
            label='Code'
            name='code'
            placeholder='Enter Code'
            required
          />

          <FormInput
            label='Serial Number'
            name='serial_number'
            type='number'
            placeholder='Enter Serial Number'
            required
          />

          <FormSelect
            label='Job Category'
            name='job_category'
            required
            placeholder={
              jobCategoriesLoading ? "Loading..." : "Select Job Category"
            }
            options={jobCategoriesData?.data || []}
            disabled={jobCategoriesLoading}
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateCategoryLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddCategories;
