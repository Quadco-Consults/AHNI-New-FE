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
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import {
  MarketPriceSchema,
  TMarketPriceData,
  TMarketPriceFormValues,
} from "@/features/admin/types/config/market-price";
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

  const categoryOptions = [
    "Purchase Request",
    "Purchase Order",
    "Bid Submission",
    "Market Survey",
    "Other",
  ].map((cat) => ({
    label: cat,
    value: cat,
  }));

  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TMarketPriceData;
  const form = useForm<TMarketPriceFormValues>({
    resolver: zodResolver(MarketPriceSchema),
    defaultValues: {
      date: data?.date ?? "",
      item: data?.item ?? "",
      source: data?.source ?? "",
      unit_price: data?.unit_price ?? "",
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
            label='Unit Price'
            name='unit_price'
            placeholder='Enter Unit Price'
            required
            type='number'
          />

          <FormSelect
            required
            label='Item'
            name='item'
            placeholder='Enter Item Name'
            options={itemsOptions}
          />

          <FormInput label='Date' name='date' required type='date' />
          <FormSelect
            label='Source'
            name='source'
            required
            placeholder='Select Source'
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

export default AddMarketPrice;
