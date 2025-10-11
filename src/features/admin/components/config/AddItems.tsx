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
import FormSelect from "components/atoms/FormSelect";
import { useGetAllCategoriesQuery } from "@/features/modules/controllers/config/categoryController";
import {
  useAddItemMutation,
  useUpdateItemMutation,
} from "@/features/modules/controllers/config/itemController";
import {
  ItemSchema,
  TItemData,
  TItemFormValues,
} from "@/features/admin/types/config/item";
import FormTextArea from "components/atoms/FormTextArea";
import { useMemo, useEffect } from "react";
import {
  ITEM_TYPES,
  ItemType,
  getCategoriesByTypeAndParent,
  buildCategoryOptions,
  hasChildren,
} from "@/utils/categoryHelpers";
import { TCategoryData } from "@/features/admin/types/config/category";

const AddItems = () => {
  const { data: categories } = useGetAllCategoriesQuery({
    page: 1,
    size: 2000000,
  });

  const { dialogProps } = useAppSelector(dailogSelector);
  const data = dialogProps?.data as unknown as TItemData;

  const form = useForm<TItemFormValues>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      uom: data?.uom ?? "",
      item_type: (data?.category as any)?.job_category ?? "",
      parent_category: "",
      category: data?.category?.id ?? "",
    },
  });

  // Watch form fields for cascading dropdowns
  const selectedItemType = form.watch("item_type");
  const selectedParentCategory = form.watch("parent_category");

  // Get all categories from the API response
  const allCategories = useMemo(() => {
    return (categories?.data?.results || []) as TCategoryData[];
  }, [categories]);

  // Item type options (GOODS, SERVICE, WORK, OTHERS)
  const itemTypeOptions = useMemo(() => {
    return Object.values(ITEM_TYPES).map((type) => ({
      label: type,
      value: type,
    }));
  }, []);

  // Parent category options (filtered by item type)
  const parentCategoryOptions = useMemo(() => {
    if (!selectedItemType) return [];

    const parentCategories = getCategoriesByTypeAndParent(
      allCategories,
      selectedItemType as ItemType
    );

    return buildCategoryOptions(parentCategories);
  }, [allCategories, selectedItemType]);

  // Subcategory options (filtered by parent)
  const subcategoryOptions = useMemo(() => {
    if (!selectedItemType || !selectedParentCategory) return [];

    const subcategories = getCategoriesByTypeAndParent(
      allCategories,
      selectedItemType as ItemType,
      selectedParentCategory
    );

    return buildCategoryOptions(subcategories);
  }, [allCategories, selectedItemType, selectedParentCategory]);

  // Check if selected parent has children
  const parentHasChildren = useMemo(() => {
    if (!selectedParentCategory) return false;
    return hasChildren(selectedParentCategory, allCategories);
  }, [selectedParentCategory, allCategories]);

  // Reset dependent fields when parent selections change
  useEffect(() => {
    if (selectedItemType) {
      form.setValue("parent_category", "");
      form.setValue("category", "");
    }
  }, [selectedItemType]);

  useEffect(() => {
    if (selectedParentCategory) {
      form.setValue("category", "");
    }
  }, [selectedParentCategory]);

  const [items, { isLoading }] = useAddItemMutation();
  const [updateItems, { isLoading: updateItemsLoading }] =
    useUpdateItemMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TItemFormValues> = async (formData) => {
    try {
      // If parent has no children, use parent as category
      // Otherwise, subcategory selection is required
      const finalCategory = !parentHasChildren && selectedParentCategory
        ? selectedParentCategory
        : formData.category;

      if (!finalCategory) {
        toast.error("Please select a category");
        return;
      }

      // Prepare data for API (exclude UI-only fields)
      const apiData = {
        name: formData.name,
        description: formData.description,
        uom: formData.uom,
        category: finalCategory,
      };

      if (dialogProps?.type === "update") {
        await updateItems({
          //@ts-ignore
          id: String(dialogProps?.data?.id),
          body: apiData,
        });
        toast.success("Item Updated Successfully");
      } else {
        await items(apiData);
        toast.success("Item Added Successfully");
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
          className='flex flex-col gap-y-7'
        >
          <FormInput
            label='Item Name'
            name='name'
            placeholder='Enter Item Name'
            required
          />

          <FormTextArea
            label='Description'
            placeholder='Enter Item Description'
            name='description'
            required
          />

          <FormInput label='Unit of Measurement (UOM)' name='uom' required placeholder='Enter UOM (e.g., pcs, kg, liters)' />

          {/* Item Type Selection */}
          <FormSelect
            label='Item Type'
            name='item_type'
            required
            placeholder='Select Item Type (GOODS/SERVICE/WORK)'
            options={itemTypeOptions}
          />

          {/* Parent Category Selection (shown when item type is selected) */}
          {selectedItemType && parentCategoryOptions.length > 0 && (
            <FormSelect
              label='Parent Category'
              name='parent_category'
              required
              placeholder={`Select ${selectedItemType} Category (e.g., Assets, Consumables)`}
              options={parentCategoryOptions}
            />
          )}

          {/* Subcategory Selection (shown when parent has children) */}
          {selectedParentCategory && parentHasChildren && subcategoryOptions.length > 0 && (
            <FormSelect
              label='Subcategory'
              name='category'
              required
              placeholder='Select Subcategory (e.g., Fixed Assets, IT Equipment)'
              options={subcategoryOptions}
            />
          )}

          {/* Info message when parent has no children */}
          {selectedParentCategory && !parentHasChildren && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
              ✓ Category selected: {parentCategoryOptions.find(opt => opt.value === selectedParentCategory)?.label}
            </div>
          )}

          {/* Info message for hierarchy */}
          {selectedItemType && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
              <strong>Hierarchy:</strong> Item Type → Parent Category → Subcategory (if applicable)
            </div>
          )}

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateItemsLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddItems;
