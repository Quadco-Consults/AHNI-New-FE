import { TCategoryData } from "definitions/modules/config/category";
import { TItemData } from "definitions/modules/config/item";
import { TItemStoreStockData } from "./item-store-stock";
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
  category: TCategoryData;
  category_detail?: TCategoryData; // Enhanced API includes category details
  created_datetime: string;
  updated_datetime: string;

  // Legacy fields (for backward compatibility - will be deprecated in Phase 2)
  quantity?: number;
  stock_control_method?: string;
  expiry_date?: string;
  previous_quantity?: number;
  re_order_level?: number;
  buffer_stock?: number;
  max_stock?: number;
  entry_date?: string;
  available_quantity?: number;
  item_cost?: string;
  grn_tracking_number?: null;

  created_by: string;
  updated_by: null;
  item: TItemData;

  // Enhanced API fields - store-based inventory tracking
  store_stocks?: TItemStoreStockData[]; // Store stock information for the item
  total_quantity_across_stores?: number; // Sum of all store quantities
  total_available_across_stores?: number; // Sum of all store available quantities
  stores_count?: number; // Number of stores with this item

  // Master Catalog properties (calculated from store_stocks) - for backward compatibility
  total_quantity?: number; // Alias for total_quantity_across_stores
  total_available?: number; // Alias for total_available_across_stores
}

export interface TConsumableSingleData {
  id: string;
  name: string;
  description: string;
  category: TCategoryData;
  category_detail?: TCategoryData; // Enhanced API includes category details
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

  // Enhanced API fields - store-based inventory tracking
  store_stocks?: TItemStoreStockData[]; // Per-store stock levels
  total_quantity_across_stores?: number; // Sum of all store quantities
  total_available_across_stores?: number; // Sum of all store available quantities
  stores_count?: number; // Number of stores with this item

  // Master Catalog properties (calculated from store_stocks) - for backward compatibility
  total_quantity?: number; // Alias for total_quantity_across_stores
  total_available?: number; // Alias for total_available_across_stores

  created_by: string;
  updated_by: null | string;
}
