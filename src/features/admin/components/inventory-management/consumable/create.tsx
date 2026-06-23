"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import RoundBack from "assets/svgs/RoundBack";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelectField";
import FormTextArea from "@/components/FormTextArea";
import Card from "@/components/Card";
import { Form } from "@/components/ui/form";
import { AdminRoutes } from "@/constants/RouterConstants";
import {
  ItemSchema,
  TItemFormValues,
} from "@/features/admin/types/config/item";
import useQuery from "@/hooks/useQuery";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import {
  useAddItem,
  useGetSingleItem,
  useUpdateItem,
} from "@/features/modules/controllers/config/itemController";
// import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { toast } from "sonner";
import { formatDate } from "@/utils/date";
import {
  ITEM_TYPES,
  buildCategoryOptions,
  getCategoriesByTypeAndParent,
} from "@/utils/categoryHelpers";
import { useState } from "react";

export default function CreateConsumablePage() {
  const query = useQuery();
  const consumableId = query?.get("id") || null;

  // State for cascading category selection
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>("");

  const { data: item } = useGetSingleItem(consumableId || "", !!consumableId);

  const { data: category } = useGetAllCategories({
    page: 1,
    size: 1000, // Get all categories
    search: "",
    enabled: true,
  });

  // Item type options (GOODS, SERVICE, WORK)
  const itemTypeOptions = useMemo(
    () => [
      { label: "Goods", value: ITEM_TYPES.GOODS },
      { label: "Service", value: ITEM_TYPES.SERVICE },
      { label: "Work", value: ITEM_TYPES.WORK },
      { label: "Others", value: ITEM_TYPES.OTHERS },
    ],
    []
  );

  // Parent category options (filtered by item type)
  const parentCategoryOptions = useMemo(() => {
    if (!category?.results || !selectedItemType) {
      return [];
    }

    const topLevelCategories = getCategoriesByTypeAndParent(
      category.results as any,
      selectedItemType as any
    );

    return buildCategoryOptions(topLevelCategories as any);
  }, [category, selectedItemType]);

  // Final category options (filtered by parent category)
  const finalCategoryOptions = useMemo(() => {
    if (!category?.results || !selectedItemType) {
      return [];
    }

    const childCategories = getCategoriesByTypeAndParent(
      category.results as any,
      selectedItemType as any,
      selectedParentCategory || undefined
    );

    return buildCategoryOptions(childCategories as any);
  }, [category, selectedItemType, selectedParentCategory]);

  // For edit mode: Get subcategories (consumable types) under "Consumables" parent
  const consumableTypeOptions = useMemo(() => {
    if (!category?.results) {
      return [];
    }

    // Find the "Consumables" parent category
    const consumablesParent = category.results.find(
      (cat) =>
        cat.job_category === 'GOODS' &&
        !cat.parent &&
        (cat.name.toLowerCase().includes('consumable') || cat.code === 'CON')
    );

    console.log("🔍 Consumables Parent Category:", consumablesParent);

    if (!consumablesParent) {
      // If no parent found, return all GOODS subcategories
      const goodsSubcategories = category.results.filter(
        (cat: any) => cat.job_category === 'GOODS' && cat.parent
      );
      console.log("⚠️ No Consumables parent found, using GOODS subcategories:", goodsSubcategories.length);
      return buildCategoryOptions(goodsSubcategories as any);
    }

    // Get all subcategories under Consumables
    const subcategories = category.results.filter((cat: any) => {
      if (typeof cat.parent === 'string') {
        return cat.parent === consumablesParent.id;
      } else if (cat.parent && typeof cat.parent === 'object') {
        return cat.parent.id === consumablesParent.id;
      }
      return false;
    });

    console.log("📂 Consumable Subcategories Found:", subcategories.length);
    console.log("✅ Consumable Type Options:", buildCategoryOptions(subcategories));

    return buildCategoryOptions(subcategories);
  }, [category]);

  // Use ItemSchema for both create and edit - edit mode only modifies master data
  const Schema = ItemSchema;

  const defaultValues = useMemo(() => {
    return {
      name: "",
      description: "",
      category: "",
      uom: "",
    };
  }, []);

  const form = useForm<TItemFormValues>({
    resolver: zodResolver(Schema),
    defaultValues,
  });

  useEffect(() => {
    if (consumableId && item?.data) {
      const itemData = item.data as any; // Type assertion to access all properties

      // Debug: Check category structure
      console.log("🔍 EDIT MODE - Item Data:", itemData);
      console.log("📂 Category Structure:", itemData.category);
      console.log("🔑 Category ID:", itemData.category?.id);

      // Handle category - it could be an object with id or just a string id
      const categoryId = typeof itemData.category === 'object'
        ? itemData.category?.id
        : itemData.category;

      console.log("✅ Final Category ID to use:", categoryId);

      // Only populate master data fields in edit mode
      form.reset({
        name: itemData.name,
        description: itemData.description,
        uom: itemData.uom,
        category: categoryId,
      });
    }
  }, [consumableId, item, form]);

  const { createItem, isLoading: isCreateLoading } = useAddItem();
  const { updateItem: editItem, isLoading: isEditLoading } = useUpdateItem(
    consumableId!
  );

  const router = useRouter();

  const onSubmit: SubmitHandler<TItemFormValues> = async (data) => {
    // Edit mode: Only send master data fields
    const editConsumableData: any = {
      name: data?.name,
      description: data?.description,
      uom: data?.uom,
    };

    // Only include category if it has a valid value (not null, undefined, or empty string)
    if (data?.category) {
      editConsumableData.category = data.category;
    }

    const createConsumableData = {
      name: data?.name,
      description: data?.description,
      uom: data?.uom,
      category: data?.category,
    };

    // Debug logging to see what data is being sent
    console.log("🔍 Form Data Received:", data);
    console.log("📂 Category ID being used:", data?.category);

    try {
      if (consumableId) {
        console.log("📝 Editing consumable (master data only):", editConsumableData);
        console.log("🔑 Category in edit payload:", editConsumableData.category);
        await editItem(editConsumableData);
        toast.success("Consumable Updated");
      } else {
        console.log("🚀 Creating consumable with data:", createConsumableData);
        await createItem(createConsumableData);
        toast.success("Consumable Created");
        console.log("✅ Consumable created successfully");
      }
      router.push(AdminRoutes.INDEX_CONSUMABLE);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div>
      <div className='flex items-center gap-x-2'>
        <div onClick={() => router.back()}>
          <RoundBack />
        </div>
        <h4 className='text-xl font-bold'>
          {" "}
          {consumableId ? "Update Consumable" : "Create Consumable"}
        </h4>
      </div>
      <Card>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-y-8'
            action=''
          >
            <FormInput
              label='Item Name'
              name='name'
              required
              placeholder='Enter Item Name'
            />

            <FormTextArea
              label='Item Description'
              name='description'
              placeholder='Enter Item Description'
              required
            />

            <FormInput
              label='Unit of Measurement'
              name='uom'
              placeholder='Enter Unit Measurement'
              required
            />

            {!consumableId && (
              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-700'>Category Selection</h3>
                <div className='grid grid-cols-3 gap-x-5 gap-y-6'>
                  {/* Step 1: Item Type */}
                  <FormSelect
                    label='Item Type'
                    name='item_type'
                    required
                    placeholder='Select Item Type'
                    options={itemTypeOptions}
                    onValueChange={(value) => {
                      setSelectedItemType(value);
                      setSelectedParentCategory("");
                      form.setValue("category", "");
                    }}
                  />

                  {/* Step 2: Parent Category (Assets, Consumables, etc.) */}
                  <FormSelect
                    label='Parent Category'
                    name='parent_category'
                    required={!!selectedItemType}
                    placeholder={
                      !selectedItemType
                        ? "Select Item Type first"
                        : parentCategoryOptions.length === 0
                        ? "No parent categories available"
                        : "Select Parent Category"
                    }
                    options={parentCategoryOptions}
                    disabled={!selectedItemType}
                    onValueChange={(value) => {
                      setSelectedParentCategory(value);
                      form.setValue("category", "");
                    }}
                  />

                  {/* Step 3: Final Category */}
                  <FormSelect
                    name='category'
                    label='Category'
                    required
                    placeholder={
                      !selectedItemType
                        ? "Select Item Type first"
                        : !selectedParentCategory
                        ? "Select Parent Category first"
                        : finalCategoryOptions.length === 0
                        ? "No categories available"
                        : "Select Category"
                    }
                    options={finalCategoryOptions}
                    disabled={!selectedItemType || !selectedParentCategory}
                  />
                </div>
                <p className='text-xs text-gray-500'>
                  Example: Goods → Consumables → Medical Consumables
                </p>
              </div>
            )}
            {consumableId && (
              <div className='space-y-4'>
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <p className='text-sm text-blue-800'>
                    <strong>Note:</strong> This form edits the item master data only.
                    To manage store-specific stock levels, quantities, and reorder points,
                    use the "View Store Stock" option from the consumables list.
                  </p>
                </div>

                {/* Consumable Type Dropdown - Only show if there are subcategories */}
                {consumableTypeOptions.length > 0 && (
                  <FormSelect
                    name='category'
                    label='Consumable Type'
                    placeholder="Select Consumable Type"
                    options={consumableTypeOptions}
                    required
                  />
                )}
                {/* If no subcategories, category is preserved from form reset */}
              </div>
            )}

            <div className='ml-auto'>
              <FormButton loading={isCreateLoading || isEditLoading}>
                {consumableId ? "Update Consumable" : "Create Consumable"}
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
