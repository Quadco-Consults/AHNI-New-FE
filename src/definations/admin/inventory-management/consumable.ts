import { TCategoryData } from "definations/modules/config/category";
import { TItemData } from "definations/modules/config/item";
import { z } from "zod";

export const ConsumableSchema = z.object({
    item: z.string().min(1, "Please select an item"),
    quantity: z.string().min(1, "Please enter a quantity"),
    stock_control_method: z
        .string()
        .min(1, "Please select a stock control method"),
    category: z.string().min(1, "Please select a category"),
    expiry_date: z.string().min(1, "Please select an expiry date"),
    previous_quantity: z.string().min(1, "Please enter a previous quantity"),
    re_order_level: z.string().min(1, "Please enter a reorder level"),
    buffer_stock: z.string().min(1, "Please enter a buffer stock"),
    max_stock: z.string().min(1, "Please enter a max stock"),
    entry_date: z.string().min(1, "Please select an entry date"),
    available_quantity: z.string().min(1, "Please enter an available quantity"),
    item_cost: z.string().min(1, "Please enter an item cost"),
    grn_tracking_number: z
        .string()
        .min(1, "Please enter a GRN tracking number"),
});

export type TConsumableFormValues = z.infer<typeof ConsumableSchema>;

export interface TConsumablePaginatedData {
    id: string;
    item: string;
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
    item: TItemData;
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
