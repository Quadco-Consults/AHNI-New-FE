import { z } from "zod";
import { TCategoryData } from "./category";

export const ItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  uom: z.string(),
  category: z.string(),
});

export const EditItemSchema = ItemSchema.extend({
  quantity: z.string().optional(),
  stock_control_method: z.string().optional(),
  expiry_date: z.string().optional(),
  // previous_quantity: z.string().optional(),
  re_order_level: z.string().optional(),
  buffer_stock: z.string().optional(),
  max_stock: z.string().optional(),
  entry_date: z.string().optional(),
  // available_quantity: z.string().optional(),
  item_cost: z.string().optional(),
  // grn_tracking_number: z.string().optional(),
});

export type TItemFormValues = z.infer<typeof EditItemSchema>;

export interface TItemData {
  id: string;
  name: string;
  description: string;
  category: TCategoryData;
  created_datetime: string;
  updated_datetime: string;
  quantity: number;
  stock_control_method: string;
  expiry_date: string;
  previous_quantity: number;
  re_order_level: number;
  buffer_stock: number;
  max_stock: number;
  entry_date: string;
  available_quantity: number;
  item_cost: string;
  grn_tracking_number: string;
  created_by: string;
  updated_by: null;
  uom: string;
}
