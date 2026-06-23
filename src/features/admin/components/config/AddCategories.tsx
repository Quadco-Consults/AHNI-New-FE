"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import { toast } from "sonner";
import {
  CategorySchema,
  TCategoryData,
  TCategoryFormValues,
} from "@/features/admin/types/config/category";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategories,
} from "@/features/modules/controllers/config/categoryController";
import { useGetAllJobCategories } from "@/features/modules/controllers/config/jobCategoryController";
import FormTextArea from "@/components/FormTextArea";
import { useMemo } from "react";

const AddCategories = () => {
  const { dialogProps } = useAppSelector(dialogSelector);
  const { data: jobCategoriesData, isLoading: jobCategoriesLoading } =
    useGetAllJobCategories();

  const data = dialogProps?.data as unknown as TCategoryData;

  // Fetch all categories for parent selection
  // Reduced from 1000 to 100 - most orgs won't have > 100 parent categories
  const { data: allCategories, isLoading: categoriesLoading } = useGetAllCategories({
    page: 1,
    size: 100,
    search: "",
  });
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

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            <p className="font-medium">📋 Creating a Category</p>
            <p className="text-xs mt-1">
              Categories are standalone groups. To add subcategories like "Fixed Assets" or "IT Equipment", use the Subcategories tab after creating this category.
            </p>
          </div>

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateCategoryLoading}>
              {dialogProps?.type === "update" ? "Update Category" : "Create Category"}
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddCategories;
