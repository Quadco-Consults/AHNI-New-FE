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
import { useGetAllUsers } from "@/features/auth/controllers/userController";
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
      received_by: "",
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
      purchaseOrder?.results?.map(({ purchase_order_number, id }) => ({
        label: purchase_order_number,
        value: id,
      })) || [],
    [purchaseOrder]
  );

  const purchaseOrderId = form.watch("purchase_order");

  const { data: singlePurchaseOrder } = useGetSinglePurchaseOrder(
    purchaseOrderId || ""
  );

  // Get users for acceptor selection (filter for relevant roles)
  const { data: usersData } = useGetAllUsers({
    page: 1,
    size: 1000,
  });

  const acceptorOptions = useMemo(() => {
    if (!usersData?.data?.results) return [];

    // Filter for users who can accept GRNs (AHNI_STAFF, ADMIN, STORE_KEEPER)
    const eligibleUsers = usersData.data.results.filter((user: any) =>
      ['AHNI_STAFF', 'ADMIN', 'STORE_KEEPER'].includes(user.user_type)
    );

    return eligibleUsers.map((user: any) => ({
      label: `${user.first_name} ${user.last_name} (${user.user_type})`,
      value: user.id,
    }));
  }, [usersData]);


  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit: SubmitHandler<TGoodReceiveNoteFormValues> = async (data) => {
    try {
      // Validate that items exist and have at least one item
      if (!data.items || data.items.length === 0) {
        toast.error("Please select a purchase order to load items before proceeding.");
        return;
      }

      // Validate that at least one item has received quantity
      const itemsWithQuantity = data.items.filter(item =>
        item.quantity_received && parseFloat(item.quantity_received) > 0
      );

      console.log("🔍 Total items:", data.items.length);
      console.log("🔍 Items with quantity:", itemsWithQuantity.length);
      console.log("🔍 All items data:", data.items);

      if (itemsWithQuantity.length === 0) {
        toast.error("Please enter received quantity for at least one item.");
        return;
      }

      // Transform the data to match backend expectations
      const grn_items = itemsWithQuantity.map((item) => ({
        purchase_order_item: String(item.item_id),
        received_quantity: parseFloat(item.quantity_received),
        remark: item.comment || "",
      }));

      const transformedData = {
        purchase_order: data.purchase_order,
        invoice_number: data.invoice_number,
        waybill_number: data.waybill_number,
        remark: data.remark,
        ...(data.received_by && { received_by: data.received_by }),
        grn_items: grn_items,
      };

      console.log("📦 Transformed data to store:", transformedData);
      console.log("📦 GRN items count:", grn_items.length);
      console.log("📦 First GRN item:", grn_items[0]);

      // Store data in localStorage for uploads page
      const dataToStore = {
        formData: transformedData,
        isEdit: !!id,
        editId: id
      };

      console.log("💾 Storing to localStorage:", dataToStore);
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
      console.log("🔍 Purchase Order Items Data:", singlePurchaseOrder.data.purchase_order_items);
      console.log("🔍 First Item Full Data:", singlePurchaseOrder.data.purchase_order_items[0]);

      const items = singlePurchaseOrder.data.purchase_order_items.map(
        (item: any) => ({
          item_id: item.id,
          quantity_ordered: String(item.quantity),
          quantity_received: "",
          comment: "",
        })
      );

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
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                  <h3 className='font-bold text-xl text-blue-900 mb-2'>📦 Items to Receive</h3>
                  <p className='text-blue-700 text-sm'>
                    Review each item from Purchase Order <strong>{singlePurchaseOrder?.data?.purchase_order_number}</strong> and
                    enter the actual quantities received along with your comments.
                  </p>
                  <div className='mt-2 text-sm text-blue-600'>
                    <strong>Vendor:</strong> {singlePurchaseOrder?.data?.vendor_detail?.company_name || 'N/A'}
                  </div>
                </div>
              )}

              {fields.map((field, index) => {
                const purchaseOrderItem =
                  singlePurchaseOrder?.data?.purchase_order_items?.[index];

                // Try multiple fallbacks for item name
                const itemName =
                  purchaseOrderItem?.item_detail?.name ||
                  purchaseOrderItem?.item_detail?.description ||
                  purchaseOrderItem?.description ||
                  `Item ${index + 1}`;

                // Try multiple fallbacks for UOM
                const itemUOM =
                  purchaseOrderItem?.uom ||
                  purchaseOrderItem?.item_detail?.uom ||
                  'Each';

                const unitPrice = purchaseOrderItem?.unit_price || '0';

                return (
                  <Card key={field.id} className='p-4 border border-gray-200 bg-gray-50'>
                    {/* Item Header Information */}
                    <div className='mb-4 pb-3 border-b border-gray-300'>
                      <h4 className='font-semibold text-lg text-gray-800 mb-2'>
                        {itemName}
                      </h4>
                      {purchaseOrderItem?.item_detail?.description && (
                        <p className='text-sm text-gray-600 mb-2'>{purchaseOrderItem.item_detail.description}</p>
                      )}
                      <div className='grid grid-cols-3 gap-4 text-sm'>
                        <div>
                          <span className='text-gray-600'>Unit of Measurement:</span>
                          <div className='font-medium text-gray-800'>{itemUOM}</div>
                        </div>
                        <div>
                          <span className='text-gray-600'>Unit Price:</span>
                          <div className='font-medium text-gray-800'>
                            ₦{parseFloat(unitPrice || '0').toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className='text-gray-600'>FCO Number:</span>
                          <div className='font-medium text-gray-800'>
                            {purchaseOrderItem?.fco_number || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormInput
                        label='Quantity Ordered'
                        name={`items.${index}.quantity_ordered`}
                        disabled
                        className='bg-gray-100'
                      />

                      <FormInput
                        label='Quantity Received'
                        name={`items.${index}.quantity_received`}
                        placeholder='Enter Quantity Received'
                        required
                        type='number'
                        min='0'
                        step='0.01'
                      />

                      <FormTextArea
                        label='Comment'
                        name={`items.${index}.comment`}
                        placeholder='Enter your comments about this item...'
                        required
                        rows={2}
                      />
                    </div>
                  </Card>
                );
              })}

              {/* GRN Information Section */}
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 my-6'>
                <h3 className='font-bold text-xl text-gray-900 mb-2'>📋 Good Receive Note Information</h3>
                <p className='text-gray-700 text-sm mb-4'>
                  Enter the delivery and invoice details for this goods receipt.
                </p>

                <div className='space-y-4'>
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

                  <FormSelect
                    label='Received By (Store Keeper/Admin)'
                    name='received_by'
                    placeholder='Select who will receive the goods'
                    options={acceptorOptions}
                  />
                </div>
              </div>

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
