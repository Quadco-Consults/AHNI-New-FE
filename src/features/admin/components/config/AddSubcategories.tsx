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
  useGetAllCategories,
} from "@/features/modules/controllers/config/categoryController";
import FormTextArea from "components/atoms/FormTextArea";
import { useMemo } from "react";

const AddSubcategories = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TCategoryData;

  // Fetch all categories for parent selection
  const { data: allCategories, isLoading: categoriesLoading } = useGetAllCategories({
    page: 1,
    size: 1000,
    search: "",
  });

  const form = useForm<TCategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      parent: typeof data?.parent === 'string' ? data?.parent : data?.parent?.id ?? "",
    },
  });

  const [category, { isLoading }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();

  const dispatch = useAppDispatch();

  // Watch the selected parent
  const selectedParent = form.watch("parent");

  // Show ALL parent categories (categories without a parent)
  const parentCategoryOptions = useMemo(() => {
    if (!allCategories?.data?.results) {
      return [];
    }

    return allCategories.data.results
      .filter((cat) => {
        // Exclude self when editing
        const isNotSelf = !data?.id || cat.id !== data.id;
        // ONLY show top-level categories (no parent) as parent options
        const isTopLevel = !cat.parent;

        return isNotSelf && isTopLevel;
      })
      .map((cat) => ({
        label: `${cat.name} (${cat.job_category})`,
        value: cat.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allCategories, data?.id]);

  // Get selected parent details (name and job_category)
  const selectedParentData = useMemo(() => {
    if (!selectedParent || !allCategories?.data?.results) return null;
    const parent = allCategories.data.results.find((cat) => cat.id === selectedParent);
    return parent || null;
  }, [selectedParent, allCategories]);

  const onSubmit: SubmitHandler<TCategoryFormValues> = async (formData) => {
    try {
      // Validate that a parent is selected
      if (!formData.parent) {
        toast.error("Please select a parent category for this subcategory");
        return;
      }

      // Get parent category to inherit job_category
      if (!selectedParentData) {
        toast.error("Parent category not found");
        return;
      }

      // For subcategories, exclude code and serial_number - backend will auto-generate
      // Auto-inherit job_category from parent
      const subcategoryPayload = {
        name: formData.name,
        description: formData.description,
        job_category: selectedParentData.job_category, // Inherited from parent
        parent: formData.parent,
      };

      console.log("Subcategory Payload to Backend:", JSON.stringify(subcategoryPayload, null, 2));

      if (dialogProps?.type === "update") {
        await updateCategory({
          //@ts-ignore
          id: String(dialogProps?.data?.id),
          body: subcategoryPayload,
        });
        toast.success("Subcategory Updated Successfully");
      } else {
        await category(subcategoryPayload);
        toast.success("Subcategory Created Successfully");
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
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-4 sm:gap-y-7'
        >
          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 sm:p-3 text-xs sm:text-sm text-blue-800">
            <p className="font-medium">📋 Creating a Subcategory</p>
            <p className="text-[10px] sm:text-xs mt-1">
              Subcategories are assigned to parent categories. For example: "Fixed Assets" under "Assets" or "Medical Equipment" under "Consumables".
            </p>
          </div>

          <FormInput
            label='Subcategory Name'
            name='name'
            placeholder='e.g., Fixed Assets, Medical Equipment, IT Services'
            required
          />

          <FormTextArea
            label='Description'
            name='description'
            placeholder='Enter Description (optional)'
          />

          <div className="space-y-2">
            <FormSelect
              label='Parent Category'
              name='parent'
              required
              placeholder={
                categoriesLoading
                  ? "Loading..."
                  : parentCategoryOptions.length === 0
                  ? "No parent categories available"
                  : "Select Parent Category"
              }
              options={parentCategoryOptions}
              disabled={categoriesLoading}
            />

            {selectedParent && selectedParentData && (
              <div className="text-xs sm:text-sm bg-green-50 border border-green-200 rounded-md p-2 sm:p-3">
                <p className="font-medium text-green-800">✓ This subcategory will be under:</p>
                <p className="text-green-700 mt-1 font-semibold break-words">{selectedParentData.name}</p>
                <p className="text-green-600 text-[10px] sm:text-xs mt-1">
                  Job Category: <span className="font-semibold">{selectedParentData.job_category}</span> (inherited from parent)
                </p>
              </div>
            )}

            {parentCategoryOptions.length === 0 && !categoriesLoading && (
              <div className="text-xs sm:text-sm bg-yellow-50 border border-yellow-200 rounded-md p-2 sm:p-3">
                <p className="font-medium text-yellow-800">⚠️ No Parent Categories Available</p>
                <p className="text-yellow-700 text-[10px] sm:text-xs mt-1">
                  You need to create a parent category first in the "Categories" tab.
                </p>
              </div>
            )}
          </div>

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateCategoryLoading}>
              {dialogProps?.type === "update" ? "Update Subcategory" : "Create Subcategory"}
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddSubcategories;
