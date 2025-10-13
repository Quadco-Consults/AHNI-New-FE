import { z } from "zod";
import { TCategoryData } from "./category";
import { TItemStoreStockData } from "../inventory-management/item-store-stock";

export const ItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  uom: z.string().min(1, "Unit of measurement is required"),
  // UI-only fields for hierarchical category selection
  item_type: z.string().optional(), // GOODS, SERVICE, WORK, OTHERS
  parent_category: z.string().optional(), // Assets, Consumables, etc.
  // Final category field (can be parent or subcategory)
  category: z.string().optional(),
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

  // Legacy fields (for backward compatibility - will be deprecated in Phase 2)
  quantity?: number; // Global quantity (sum of all stores)
  stock_control_method?: string;
  expiry_date?: string;
  previous_quantity?: number;
  re_order_level?: number;
  buffer_stock?: number;
  max_stock?: number;
  entry_date?: string;
  available_quantity?: number; // Global available (sum of all stores)
  item_cost?: string;
  grn_tracking_number?: string;

  // Phase 2: Store-based inventory tracking
  store_stocks?: TItemStoreStockData[]; // Per-store stock levels
  total_quantity?: number; // Sum of all store quantities
  total_available?: number; // Sum of all store available quantities
  stores_count?: number; // Number of stores with this item

  created_by: string;
  updated_by: null | string;
  uom: string;
}
