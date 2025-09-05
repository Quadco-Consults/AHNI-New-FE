"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import FormSelect from "@/components/FormSelect";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import {
  useAddItem,
  useUpdateItem,
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

  const categoryOptions = categories?.data?.results?.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const { dialogProps } = useAppSelector(dailogSelector);

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

  const [items, { isLoading }] = useAddItem();
  const [updateItems, { isLoading: updateItemsLoading }] = useUpdateItem();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TItemFormValues> = async (data) => {
    try {
      if (dialogProps?.type === "update") {
        await updateItems({
          //@ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
      } else {
        await items(data);
      }

      toast.success("Item Added Succesfully");
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
