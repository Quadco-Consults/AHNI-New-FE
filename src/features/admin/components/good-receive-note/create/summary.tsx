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
import { SubmitHandler, useForm } from "react-hook-form";

import { useSearchParams } from "next/navigation";
import {
  useCreateGoodReceiveNote,
  useGetSingleGoodReceiveNote,
  useModifyGoodReceiveNote,
} from "@/features/admin/controllers/goodReceiveNoteController";
import {
  useGetAllPurchaseOrders,
  useGetSinglePurchaseOrder,
} from "@/features/procurement/controllers/purchaseOrderController";
import { toast } from "sonner";
import GoodReceiveNoteLayout from "./Layout";

export default function CreateGoodReceiveNote() {
  const form = useForm<TGoodReceiveNoteFormValues>({
    resolver: zodResolver(GoodReceiveNoteSchema),
    defaultValues: {
      purchase_order: "",
      invoice_number: "",
      waybill_number: "",
      remark: "",
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

  const { createGoodReceiveNote, isLoading: isCreateLoading } =
    useCreateGoodReceiveNote();

  const { modifyGoodReceiveNote, isLoading: isModifyLoading } =
    useModifyGoodReceiveNote(id!);

  const onSubmit: SubmitHandler<TGoodReceiveNoteFormValues> = async (data) => {
    try {
      console.log({ data });

      if (id) {
        await modifyGoodReceiveNote(data);
        toast.success("Good Received Note Updated");
      } else {
        await createGoodReceiveNote(data);
        toast.success("Good Received Note Created");
      }

      // router.push(AdminRoutes.GRN_CREATE_UPLOADS);

      toast.success("Good Received Note Created");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
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

              {singlePurchaseOrder?.data?.purchase_order_items?.map(
                ({ id, item_detail, quantity }) => (
                  <div key={id} className='grid grid-cols-4 gap-6 items-center'>
                    <span className='font-medium'>{item_detail?.name}</span>

                    <FormInput
                      label='Quantity Ordered'
                      name='_'
                      placeholder={String(quantity)}
                      disabled
                    />

                    <FormInput
                      label='Quantity Received'
                      name='_'
                      placeholder='Enter Quantity Received'
                    />

                    <FormInput
                      label='Comment'
                      name='_'
                      placeholder='Enter Comment'
                      required
                    />
                  </div>
                )
              )}

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
                  loading={isCreateLoading || isModifyLoading}
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
