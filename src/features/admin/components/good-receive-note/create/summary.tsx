"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import { Form } from "components/ui/form";
import {
  GoodReceiveNoteSchema,
  TGoodReceiveNoteFormValues,
} from "features/admin/types/inventory-management/good-receive-note";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";

import { useSearchParams } from "next/navigation";
import {
  useGetSingleGoodReceiveNote,
} from "@/features/admin/controllers/goodReceiveNoteController";
import {
  useGetAllPurchaseOrders,
  useGetSinglePurchaseOrder,
} from "@/features/procurement/controllers/purchaseOrderController";
import { toast } from "sonner";
import GoodReceiveNoteLayout from "./Layout";
import { useRouter } from "next/navigation";
import { AdminRoutes } from "@/constants/RouterConstants";

export default function CreateGoodReceiveNote() {
  const router = useRouter();

  const form = useForm<TGoodReceiveNoteFormValues>({
    resolver: zodResolver(GoodReceiveNoteSchema),
    defaultValues: {
      purchase_order: "",
      invoice_number: "",
      waybill_number: "",
      remark: "",
      items: [],
    },
  });

  const searchParams = useSearchParams();
  // @ts-ignore
  const id = searchParams.get("id");

  const { data: purchaseOrder } = useGetAllPurchaseOrders({
    page: 1,
    size: 2000000,
  });

  const purchaseOrderOptions = useMemo(
    () =>
      // @ts-ignore
      purchaseOrder?.data.results.map(({ purchase_order_number, id }) => ({
        label: purchase_order_number,
        value: id,
      })),
    [purchaseOrder]
  );

  const purchaseOrderId = form.watch("purchase_order");

  const { data: singlePurchaseOrder } = useGetSinglePurchaseOrder(
    purchaseOrderId || ""
  );


  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit: SubmitHandler<TGoodReceiveNoteFormValues> = async (data) => {
    try {
      console.log("📝 Form submission data:", data);
      console.log("📝 Items from form:", data.items);

      // Validate that items exist and have at least one item
      if (!data.items || data.items.length === 0) {
        toast.error("Please select a purchase order to load items before proceeding.");
        return;
      }

      // Validate that at least one item has received quantity
      const itemsWithQuantity = data.items.filter(item =>
        item.quantity_received && parseFloat(item.quantity_received) > 0
      );

      if (itemsWithQuantity.length === 0) {
        toast.error("Please enter received quantity for at least one item.");
        return;
      }

      // Transform the data to match backend expectations
      const grn_items = itemsWithQuantity.map((item) => ({
        purchase_order_item: String(item.item_id), // Convert to string as backend expects UUID string
        received_quantity: parseFloat(item.quantity_received), // Convert to number
        remark: item.comment || "", // Backend expects 'remark' instead of 'comment'
      }));

      const transformedData = {
        purchase_order: data.purchase_order,
        invoice_number: data.invoice_number,
        waybill_number: data.waybill_number,
        remark: data.remark,
        grn_items: grn_items,
      };

      console.log("💾 Saving to localStorage - transformedData:", transformedData);
      console.log("💾 grn_items count:", grn_items.length);
      console.log("💾 grn_items details:", grn_items);

      // Store data in localStorage for uploads page
      const dataToStore = {
        formData: transformedData,
        isEdit: !!id,
        editId: id
      };

      console.log("💾 Full data being stored:", dataToStore);
      localStorage.setItem('grnFormData', JSON.stringify(dataToStore));

      // Navigate to uploads page
      router.push(AdminRoutes.GRN_CREATE_UPLOADS);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: goodNote } = useGetSingleGoodReceiveNote(id || "");

  useEffect(() => {
    if (goodNote) {
      form.reset({
        purchase_order: goodNote.data.purchase_order.id,
        invoice_number: goodNote.data.invoice_number,
        waybill_number: goodNote.data.waybill_number,
        remark: goodNote.data.remark,
      });
    }
  }, [goodNote, purchaseOrder, form]);

  // Populate items array when purchase order is selected
  useEffect(() => {
    if (singlePurchaseOrder?.data?.purchase_order_items) {
      console.log("🛒 PO Data:", singlePurchaseOrder.data);
      console.log("🛒 PO Items:", singlePurchaseOrder.data.purchase_order_items);

      const items = singlePurchaseOrder.data.purchase_order_items.map(
        (item: any) => {
          console.log("🛒 Processing PO item:", item);
          return {
            item_id: item.id, // This should be the UUID
            quantity_ordered: String(item.quantity),
            quantity_received: "",
            comment: "",
          };
        }
      );

      console.log("🛒 Mapped items for form:", items);
      replace(items);
    }
  }, [singlePurchaseOrder, replace]);

  return (
    <GoodReceiveNoteLayout>
      <div className='space-y-8'>
        <Card>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
              <FormSelect
                label='Purchase Order'
                name='purchase_order'
                placeholder='Select Purchase Order'
                required
                options={purchaseOrderOptions}
              />

              {singlePurchaseOrder && (
                <h3 className='font-bold text-xl'>Description of Goods</h3>
              )}

              {fields.map((field, index) => {
                const purchaseOrderItem =
                  singlePurchaseOrder?.data?.purchase_order_items?.[index];
                return (
                  <div
                    key={field.id}
                    className='grid grid-cols-4 gap-6 items-center'
                  >
                    <span className='font-medium'>
                      {purchaseOrderItem?.item_detail?.name ||
                        purchaseOrderItem?.description}
                    </span>

                    <FormInput
                      label='Quantity Ordered'
                      name={`items.${index}.quantity_ordered`}
                      disabled
                    />

                    <FormInput
                      label='Quantity Received'
                      name={`items.${index}.quantity_received`}
                      placeholder='Enter Quantity Received'
                      required
                    />

                    <FormInput
                      label='Comment'
                      name={`items.${index}.comment`}
                      placeholder='Enter Comment'
                      required
                    />
                  </div>
                );
              })}

              <FormInput
                label='Invoice Number'
                name='invoice_number'
                placeholder='Enter Invoice Number'
                required
              />

              <FormInput
                label='Waybill Number'
                name='waybill_number'
                placeholder='Enter Waybill Number'
                required
              />

              <FormTextArea
                label='Remark'
                name='remark'
                placeholder='Enter Remark'
                required
              />
              <div className='flex justify-end'>
                <FormButton
                  size='lg'
                  type='submit'
                >
                  Next
                </FormButton>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </GoodReceiveNoteLayout>
  );
}
