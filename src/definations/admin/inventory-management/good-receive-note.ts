import { z } from "zod";

export const GoodReceiveNoteSchema = z.object({
    purchase_order: z.string().min(1, "Please select a purchase order"),
    invoice_number: z.string().min(1, "Please enter an invoice number"),
    waybill_number: z.string().min(1, "Please enter a waybill number"),
    remark: z.string().min(1, "Please enter a remark"),
});

export type TGoodReceiveNoteFormValues = z.infer<
    typeof GoodReceiveNoteSchema
>;

export interface IGoodReceiveNotePaginatedData {}

export interface IGoodReceiveNoteSingleData {}
