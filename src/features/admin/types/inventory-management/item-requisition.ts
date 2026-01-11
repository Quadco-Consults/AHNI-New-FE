import { z } from "zod";
import { TConsumableSingleData } from "./consumable";
import { TDepartmentData } from "definations/modules/config/department";
import { IUser } from "@/features/auth/types/user";
import { TStoreSingleData } from "./store";

export const ItemRequisitionSchema = z.object({
    consummables: z.array(
        z.object({
            consummable: z.string().min(1, "Please select an item"),
            quantity: z.string().min(1, "Please enter a quantity"),
        })
    ),
    department: z.string().min(1, "Please select a department"),
    store: z.string().min(1, "Please select a store"), // Phase 5: Store selection
    reviewer: z.string().min(1, "Please select a reviewer"),
    authorizer: z.string().min(1, "Please select an authorizer"),
    approver: z.string().min(1, "Please select an approver"),
});



export type TItemRequisitionFormValues = z.infer<typeof ItemRequisitionSchema>;

export interface TItemRequisitionPaginatedData {
    id: string;
    consummables: {
        id: string;
        consummable: string;
        item?: {
            id: string;
            name: string;
        };
        created_datetime: string;
        updated_datetime: string;
        quantity: number;
        item_requisition: string;
    }[];
    created_by: {
        id: string;
        employee_id: string | null;
        full_name: string;
        email: string;
    };
    created_datetime: string;
    updated_datetime: string;
    expiry_date: string;
    re_order_level: number;
    status: string;
    note: null;
    treatment_datetime: string;
    approved_by: {
        id: string;
        employee_id: string | null;
        full_name: string;
        email: string;
    } | null;
    approved_datetime: string;
    rejected_datetime: string;
    updated_by: string;
    department: {
        id: string;
        name: string;
        created_datetime: string;
        updated_datetime: string;
        description: string;
    } | null;
    // Phase 5: Store integration
    store?: string; // Store ID
    store_name?: string; // Store name for display
    store_code?: string; // Store code for display
}

export interface TItemRequisitionSingleData {
    id: string;
    consummables: {
        id: string;
        consummable: TConsumableSingleData;
        created_datetime: string;
        updated_datetime: string;
        quantity: number;
        item_requisition: string;
    }[];
    treated_by: string;
    rejected_by: string;
    approved_by: string;
    reviewer?: string; // Approval workflow fields
    authorizer?: string;
    approver?: string;
    created_by: IUser;
    created_datetime: string;
    updated_datetime: string;
    expiry_date: string;
    re_order_level: number;
    status: string;
    note: null;
    treatment_datetime: string;
    approved_datetime: string;
    rejected_datetime: string;
    updated_by: string;
    department: TDepartmentData;
    // Phase 5: Store integration
    store?: string; // Store ID
    store_detail?: TStoreSingleData; // Full store object (when expanded)
}
