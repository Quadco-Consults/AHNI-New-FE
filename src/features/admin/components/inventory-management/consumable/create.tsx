"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import RoundBack from "assets/svgs/RoundBack";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
  EditItemSchema,
  ItemSchema,
  TItemFormValues,
} from "@/features/admin/types/config/item";
import useQuery from "hooks/useQuery";
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
import { formatDate } from "utils/date";

const stockControlMethodOptions = [
  { label: "Stock Level", value: "STOCK_LEVEL" },
  { label: "Availability", value: "AVAILABILITY" },
  { label: "Just In Time", value: "JUST_IN_TIME" },
];

export default function CreateConsumablePage() {
  const query = useQuery();
  const consumableId = query.get("id");

  const { data: item } = useGetSingleItem(consumableId || "", {
    enabled: !!consumableId,
  });

  const { data: category } = useGetAllCategories({
    page: 1,
    size: 2000000,
    search: "",
  });

  const categoryOptions = useMemo(
    () =>
      category?.data.results.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    [category]
  );

  const Schema = consumableId ? EditItemSchema : ItemSchema;

  const defaultValues = useMemo(() => {
    return consumableId
      ? {
          name: "",
          description: "",
          quantity: "",
          stock_control_method: "STOCK_LEVEL",
          category: "",
          expiry_date: formatDate(String(new Date())),
          // previous_quantity: "",
          re_order_level: "",
          buffer_stock: "",
          max_stock: "",
          entry_date: "",
          // available_quantity: "",
          item_cost: "",
          // grn_tracking_number: "",
          uom: "",
        }
      : {
          name: "",
          description: "",
          category: "",
          uom: "",
        };
  }, [consumableId]);

  const form = useForm<TItemFormValues>({
    resolver: zodResolver(Schema),
    defaultValues,
  });

  useEffect(() => {
    if (consumableId) {
      form.reset({
        name: item?.data?.name,
        description: item?.data?.description,
        uom: item?.data?.uom,
        quantity: item?.data?.quantity ? String(item?.data?.quantity) : "0",
        stock_control_method: item?.data?.stock_control_method,
        category: item?.data?.category?.id,
        expiry_date: item?.data?.expiry_date || "",
        // previous_quantity: String(item?.data?.previous_quantity ?? ""),
        re_order_level: String(item?.data?.re_order_level ?? ""),
        buffer_stock: String(item?.data?.buffer_stock ?? ""),
        max_stock: String(item?.data?.max_stock ?? ""),
        entry_date: item?.data?.entry_date,
        // available_quantity: String(item?.data?.available_quantity ?? ""),
        item_cost: item?.data?.item_cost,
        // grn_tracking_number: item?.data?.grn_tracking_number,
      });
    }
  }, [consumableId, item, form]);

  const { createItem, isLoading: isCreateLoading } = useAddItem();
  const { updateItem: editItem, isLoading: isEditLoading } = useUpdateItem(
    consumableId!
  );

  const router = useRouter();

  const onSubmit: SubmitHandler<TItemFormValues> = async (data) => {
    const editConsumableData = {
      name: data?.name,
      description: data?.description,
      uom: data?.uom,
      price: data?.item_cost,
      category: data?.category,

      quantity: data?.quantity ? String(Number(data?.quantity)) : "0",
      stock_control_method: data?.stock_control_method,
      expiry_date: data?.expiry_date,
      // previous_quantity: data?.previous_quantity
      //   ? String(Number(data?.previous_quantity))
      //   : "0",
      re_order_level: data?.re_order_level
        ? String(Number(data?.re_order_level))
        : "0",
      buffer_stock: data?.buffer_stock
        ? String(Number(data?.buffer_stock))
        : "0",
      max_stock: data?.max_stock ? String(Number(data?.max_stock)) : "0",
      entry_date: data?.entry_date,
      // available_quantity: data?.available_quantity
      //   ? String(Number(data?.available_quantity))
      //   : "0",
      item_cost: data?.item_cost,
      // grn_tracking_number: data?.grn_tracking_number || "",
    };

    const createConsumableData = {
      name: data?.name,
      description: data?.description,
      uom: data?.uom,
      category: data?.category,
    };

    try {
      if (consumableId) {
        await editItem(editConsumableData);
        toast.success("Consumable Updated");
      } else {
        await createItem(createConsumableData);
        toast.success("Consumable Created");
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
              <FormSelect
                name='category'
                label='Category'
                placeholder='Select Category'
                options={categoryOptions}
                required
              />
            )}
            {consumableId && (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormInput
                  name='quantity'
                  label='Quantity'
                  placeholder='Enter Quantity'
                  required
                />

                <FormSelect
                  name='stock_control_method'
                  label='Stock Control Method'
                  placeholder='Select Stock Control Method'
                  options={stockControlMethodOptions}
                  required
                />

                <FormInput
                  label='Expiry Date'
                  name='expiry_date'
                  type='date'
                  placeholder='Select Expiry Date'
                  required
                />
                {/* <FormInput
                  name='previous_quantity'
                  label='Previous Quantity'
                  placeholder='Enter Previous Quantity'
                  required
                /> */}

                <FormInput
                  name='re_order_level'
                  placeholder='Enter Re-order Levek Stock'
                  label='Re-order Level'
                  required
                />
                <FormInput
                  name='buffer_stock'
                  label='Buffer Stock'
                  placeholder='Enter Buffer Stock'
                  required
                />

                <FormInput
                  name='max_stock'
                  label='Max Stock'
                  placeholder='Enter Max Stock'
                  required
                />

                <FormInput
                  name='entry_date'
                  type='date'
                  label='Entry Date'
                  placeholder='Select Entry Date'
                  required
                />

                {/* <FormInput
                  name='available_quantity'
                  label='Available Quantity'
                  placeholder='Enter Available Quantity'
                  required
                /> */}

                <FormInput
                  name='item_cost'
                  label='Cost of Item'
                  placeholder='Enter Cost of Item'
                  required
                />

                {/* <FormInput
                  label='GRN Tracking Number'
                  name='grn_tracking_number'
                  placeholder='Enter GRN Tracking Number'
                  // required
                /> */}
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
