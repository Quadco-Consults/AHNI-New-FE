import { TCategoryData } from "definations/modules/config/category";
import { z } from "zod";

export const ConsumableSchema = z.object({
    name: z.string().min(1, "Please enter an item name"),
    description: z.string().min(1, "Please enter a description"),

    // quantity: z.string(),
    // stock_control_method: z.string(),
    // category: z.string(),
    // expiry_date: z.string(),
    // previous_quantity: z.string(),
    // re_order_level: z.string(),
    // buffer_stock: z.string(),
    // max_stock: z.string(),
    // entry_date: z.string(),
    // available_quantity: z.string(),
    // item_cost: z.string(),
    // grn_tracking_number: z.string().optional(),
});

export type TConsumableFormValues = z.infer<typeof ConsumableSchema>;

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
