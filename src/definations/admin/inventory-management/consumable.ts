import { TCategoryData } from "definations/modules/config/category";
import { TItemData } from "definations/modules/config/item";
import { z } from "zod";

export const ConsumableSchema = z.object({
    name: z.string().min(1, "Please enter an item name"),
    description: z.string().min(1, "Please enter a description"),
});

export const EditConsumableSchema = z.object({
    name: z.string().min(1, "Please enter an item name"),
    description: z.string().min(1, "Please enter a description"),
    quantity: z.string().min(1, "Please enter quantity"),
    stock_control_method: z
        .string()
        .min(1, "Please select stock control method"),
    category: z.string().min(1, "Please select category"),
    expiry_date: z.string().min(1, "Please select expiry date"),
    previous_quantity: z.string().min(1, "Please enter previous quantity"),
    re_order_level: z.string().min(1, "Please enter re-order levek"),
    buffer_stock: z.string().min(1, "Please enter buffer stock"),
    max_stock: z.string().min(1, "Please enter max stock"),
    entry_date: z.string().min(1, "Please select entry date"),
    available_quantity: z.string().min(1, "Please enter available quantity"),
    item_cost: z.string().min(1, "Please enter item cost"),
    grn_tracking_number: z.string().optional(),
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
