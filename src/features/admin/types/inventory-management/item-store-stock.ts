import { z } from "zod";
import { TStoreSingleData } from "./store";
import { TItemData } from "../config/item";

// Zod Schema for Item Store Stock
export const ItemStoreStockSchema = z.object({
  item: z.string().min(1, "Please select an item"),
  store: z.string().min(1, "Please select a store"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  available_quantity: z.coerce.number().min(0, "Available quantity cannot be negative"),
  reserved_quantity: z.coerce.number().min(0, "Reserved quantity cannot be negative").default(0),
  re_order_level: z.coerce.number().min(0, "Re-order level cannot be negative").default(0),
  buffer_stock: z.coerce.number().min(0, "Buffer stock cannot be negative").default(0),
  max_stock: z.coerce.number().min(0, "Max stock cannot be negative").default(0),
});

export type TItemStoreStockFormValues = z.infer<typeof ItemStoreStockSchema>;

// Item Store Stock for API responses
export interface TItemStoreStockData {
  id: string;
  item: string; // Item ID (for paginated)
  item_detail?: TItemData; // Full item object (for detail view)
  store: string; // Store ID (for paginated)
  store_detail?: TStoreSingleData; // Full store object (for detail view)
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  re_order_level: number;
  buffer_stock: number;
  max_stock: number;
  last_updated: string;
  created_datetime: string;
  updated_datetime: string;
}

// Stock Movement Record (for tracking)
export interface TStockMovementData {
  id: string;
  item_store_stock: string;
  movement_type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER" | "REQUISITION";
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type?: "GRN" | "TRANSFER" | "REQUISITION" | "ADJUSTMENT";
  reference_id?: string;
  remark?: string;
  created_by: string;
  created_datetime: string;
}

// Stock Alert Level
export type StockAlertLevel = "OK" | "LOW" | "CRITICAL" | "OUT_OF_STOCK";

// Helper to determine stock alert level
export function getStockAlertLevel(
  available: number,
  reorderLevel: number,
  bufferStock: number
): StockAlertLevel {
  if (available === 0) return "OUT_OF_STOCK";
  if (available <= bufferStock) return "CRITICAL";
  if (available <= reorderLevel) return "LOW";
  return "OK";
}

// Stock summary by store
export interface TStoreStockSummary {
  store_id: string;
  store_name: string;
  store_code: string;
  total_items: number;
  total_quantity: number;
  total_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  last_updated: string;
}

// API Response Types
export interface ItemStoreStockApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

export interface ItemStoreStockPaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

// Filter Parameters
export interface ItemStoreStockFilterParams {
  page?: number;
  size?: number;
  search?: string;
  store?: string;
  item?: string;
  stock_alert?: StockAlertLevel;
  enabled?: boolean;
}
