"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dailogSelector } from "@/store/ui";
import { toast } from "sonner";
import FormSelect from "@/components/atoms/FormSelect";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { z } from "zod";

const MarketPriceSchema = z.object({
  item_id: z.string().min(1, "Item is required"),
  price: z.string().min(1, "Price is required"),
  effective_date: z.string().min(1, "Date is required"),
  vendor: z.string().optional(),
});

type TMarketPriceFormValues = z.infer<typeof MarketPriceSchema>;
import {
  useAddMarketPriceMutation,
  useUpdateMarketPriceMutation,
} from "@/features/modules/controllers/config/marketPriceController";

const AddMarketPrice = () => {
  const { data: item } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
  });

  const itemsOptions = item?.data?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as any;
  const form = useForm<TMarketPriceFormValues>({
    resolver: zodResolver(MarketPriceSchema),
    defaultValues: {
      effective_date: data?.effective_date ?? "",
      item_id: data?.item_id ?? "",
      vendor: data?.vendor ?? "",
      price: data?.price ?? "",
    },
  });

  const [items, { isLoading }] = useAddMarketPriceMutation();
  const [updateItems, { isLoading: updateItemsLoading }] =
    useUpdateMarketPriceMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TMarketPriceFormValues> = async (data) => {
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

      toast.success("Price Added Succesfully");
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
            label='Price'
            name='price'
            placeholder='Enter Price'
            required
            type='text'
          />

          <FormSelect
            required
            label='Item'
            name='item_id'
            placeholder='Select Item'
            options={itemsOptions}
          />

          <FormInput label='Effective Date' name='effective_date' required type='date' />
          <FormInput
            label='Vendor (Optional)'
            name='vendor'
            placeholder='Enter Vendor'
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

export default AddMarketPrice;
