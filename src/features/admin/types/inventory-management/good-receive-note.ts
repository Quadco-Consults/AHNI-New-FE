import { z } from "zod";
import { TStoreSingleData } from "./store";

export const GoodReceiveNoteSchema = z.object({
  purchase_order: z.string().min(1, "Please select a purchase order"),
  destination_store: z.string().min(1, "Please select destination store"), // Phase 3: Store integration
  invoice_number: z.string().min(1, "Please enter an invoice number"),
  waybill_number: z.string().min(1, "Please enter a waybill number"),
  remark: z.string().min(1, "Please enter a remark"),
  received_by: z.string().optional(), // Optional field for who receives the GRN
  items: z
    .array(
      z.object({
        item_id: z.union([z.number(), z.string()]), // Support both number and string
        quantity_ordered: z.string(),
        quantity_received: z.coerce.string().min(1, "Please enter quantity received"), // Coerce number to string
        comment: z.string().min(1, "Please enter a comment"),
      })
    )
    .min(1, "At least one item is required"),
});

export type TGoodReceiveNoteFormValues = z.infer<typeof GoodReceiveNoteSchema>;

export interface IGoodReceiveNotePaginatedData {
  id: string;
  purchase_order: string;
  vendor: string;
  destination_store?: string; // Phase 3: Store ID
  destination_store_name?: string; // Phase 3: Store name for display
  destination_store_code?: string; // Phase 3: Store code for display
  created_datetime: string;
  updated_datetime: string;
  invoice_number: string;
  waybill_number: string;
  remark: string;
  status?: "pending" | "received" | "accepted" | "rejected" | "cancelled";
  accepted_datetime: string | null;
  rejected_datetime: string | null;
  received_datetime?: string | null;
  created_by: string;
  updated_by: string | null;
  accepted_by: string | null;
  rejected_by: string | null;
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
    purchase_request?: string; // PR ID to fetch PR details
  };
  destination_store?: string; // Phase 3: Store ID
  destination_store_detail?: TStoreSingleData; // Phase 3: Full store object (when expanded)
  created_datetime: string;
  updated_datetime: string;
  invoice_number: string;
  waybill_number: string;
  remark: string;
  status?: "pending" | "received" | "accepted" | "rejected" | "cancelled";
  accepted_datetime?: string | null;
  rejected_datetime?: string | null;
  received_datetime?: string | null;
  created_by: string;
  created_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
  updated_by: string | null;
  accepted_by?: string | null;
  accepted_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
  rejected_by?: string | null;
  rejected_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
  received_by?: string | null;
  received_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
}
