import { TCategoryData } from "definations/modules/config/category";
import { TItemData } from "definations/modules/config/item";
import { z } from "zod";

export const ConsumableSchema = z.object({
  name: z.string().min(1, "Please enter an item name"),
  description: z.string().min(1, "Please enter a description"),
  uom: z.string().min(1, "Please enter a uom"),
  category: z.string().min(1, "Please select category"),
});

export const EditConsumableSchema = ConsumableSchema.extend({
  quantity: z.string().optional(),
  stock_control_method: z.string().optional(),
  expiry_date: z.string().optional(),
  previous_quantity: z.string().optional(),
  re_order_level: z.string().optional(),
  buffer_stock: z.string().optional(),
  max_stock: z.string().optional(),
  entry_date: z.string().optional(),
  available_quantity: z.string().optional(),
  item_cost: z.string().optional(),
  grn_tracking_number: z.string().optional(),
});

export type TConsumableFormValues = z.infer<typeof EditConsumableSchema>;

export interface TConsumablePaginatedData {
  id: string;
  name: string;
  description: string;
  category: string;
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
  grn_tracking_number: null;
  created_by: string;
  updated_by: null;
  item: TItemData;
}

export interface TConsumableSingleData {
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
}
