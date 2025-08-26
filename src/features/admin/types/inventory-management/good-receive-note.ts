import { z } from "zod";

export const GoodReceiveNoteSchema = z.object({
  purchase_order: z.string().min(1, "Please select a purchase order"),
  invoice_number: z.string().min(1, "Please enter an invoice number"),
  waybill_number: z.string().min(1, "Please enter a waybill number"),
  remark: z.string().min(1, "Please enter a remark"),
  items: z
    .array(
      z.object({
        item_id: z.number(),
        quantity_ordered: z.string(),
        quantity_received: z.string().min(1, "Please enter quantity received"),
        comment: z.string().min(1, "Please enter a comment"),
      })
    )
    .optional(),
});

export type TGoodReceiveNoteFormValues = z.infer<typeof GoodReceiveNoteSchema>;

export interface IGoodReceiveNotePaginatedData {
  id: string;
  purchase_order: string;
  vendor: string;
  created_datetime: string;
  updated_datetime: string;
  invoice_number: string;
  waybill_number: string;
  remark: string;
  approved_datetime: null;
  rejected_datetime: null;
  created_by: string;
  updated_by: null;
  approved_by: null;
  rejected_by: null;
}

export interface IGoodReceiveNoteSingleData {
  id: string;
  purchase_order: {
    id: string;
    vendor_name: string;
    purchase_order_number: string;
    request_dept: string;
    comment: string;
    delivery_lead_time: string;
    ship_to_address: string;
    payment_terms: string;
    authorized_datetime: string;
  };
  created_datetime: string;
  updated_datetime: string;
  invoice_number: string;
  waybill_number: string;
  remark: string;
  created_by: string;
  updated_by: null;
}
