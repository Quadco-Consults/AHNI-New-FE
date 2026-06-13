"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import { toast } from "sonner";
import FormSelect from "@/components/FormSelect";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import {
  useAddItemMutation,
  useUpdateItemMutation,
} from "@/features/modules/controllers/config/itemController";
import {
  ItemSchema,
  TItemData,
  TItemFormValues,
} from "@/features/admin/types/config/item";
import FormTextArea from "@/components/FormTextArea";

const AddNewItems = () => {
  const { data: categories } = useGetAllCategories({
    page: 1,
    size: 2000000,
  });

  const categoryOptions = categories?.results?.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const { dialogProps } = useAppSelector(dialogSelector);

  const data = dialogProps?.data as unknown as TItemData;
  const form = useForm<TItemFormValues>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      uom: data?.uom ?? "",
      category: data?.category ?? "",
    },
  });

  const [items, { isLoading }] = useAddItemMutation();
  const [updateItems, { isLoading: updateItemsLoading }] = useUpdateItemMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TItemFormValues> = async (data) => {
    console.log("🚀 ITEM CREATION - Starting:", data);
    try {
      if (dialogProps?.type === "update") {
        console.log("🔄 ITEM UPDATE - ID:", dialogProps?.data?.id);
        await updateItems({
          //@ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
        console.log("✅ ITEM UPDATE - Success");
      } else {
        console.log("➕ ITEM CREATE - Calling API with data:", data);
        const result = await items(data);
        console.log("✅ ITEM CREATE - Success, result:", result);
      }

      toast.success("Item Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      console.error("❌ ITEM CREATION ERROR:", error);
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
            placeholder='Enter Item Name'
            required
          />

          <FormTextArea
            label='Description'
            placeholder='Enter Item Description'
            name='description'
            required
          />

          <FormInput label='UOM' name='uom' required placeholder='Enter UOM' />
          <FormSelect
            label='Category'
            name='category'
            required
            placeholder='Select Category'
            options={categoryOptions}
          />

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

export default AddNewItems;
