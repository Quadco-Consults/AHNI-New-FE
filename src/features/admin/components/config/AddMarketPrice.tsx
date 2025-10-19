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
import { z } from "zod";

const MarketPriceSchema = z.object({
  item: z.string().min(1, "Item is required"),
  unit_price: z.union([
    z.string().min(1, "Unit price is required").transform((val) => parseFloat(val)),
    z.number().positive("Unit price must be positive")
  ]),
  date: z.string().min(1, "Date is required"),
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
      date: data?.date ?? "",
      item: data?.item ?? "",
      unit_price: data?.unit_price ?? "",
    },
  });

  const [createMarketPrice, { isLoading }] = useAddMarketPriceMutation();
  const [updateMarketPrice, { isLoading: updateItemsLoading }] =
    useUpdateMarketPriceMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TMarketPriceFormValues> = async (formData) => {
    try {
      // Send both price and unit_price to handle backend inconsistency
      const submitData = {
        item: formData.item,
        price: formData.unit_price, // Backend might expect 'price'
        unit_price: formData.unit_price, // But returns 'unit_price'
        date: formData.date,
      };

      if (dialogProps?.type === "update") {
        await updateMarketPrice({
          id: String(dialogProps?.data?.id),
          body: submitData,
        });
      } else {
        await createMarketPrice(submitData);
      }

      toast.success("Price Added Successfully");
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
          <FormSelect
            required
            label='Item'
            name='item'
            placeholder='Select Item'
            options={itemsOptions}
          />

          <FormInput
            label='Unit Price'
            name='unit_price'
            placeholder='Enter Unit Price'
            required
            type='number'
            step='0.01'
          />

          <FormInput label='Date' name='date' required type='date' />

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
