import { z } from "zod";
import { TConsumableSingleData } from "./consumable";
import { TDepartmentData } from "definations/modules/config/department";
import { IUser } from "features/auth/types/user";

export const ItemRequisitionSchema = z.object({
    consummables: z.array(
        z.object({
            consummable: z.string().min(1, "Please select an item"),
            quantity: z.string().min(1, "Please enter a quantity"),
        })
    ),
    department: z.string().min(1, "Please select a department"),
});



export type TItemRequisitionFormValues = z.infer<typeof ItemRequisitionSchema>;

export interface TItemRequisitionPaginatedData {
    id: string;
    consummables: {
        id: string;
        consummable: string;
        created_datetime: string;
        updated_datetime: string;
        quantity: 200;
        item_requisition: string;
    }[];
    created_by: " ";
    created_datetime: string;
    updated_datetime: string;
    expiry_date: string;
    re_order_level: number;
    status: string;
    note: null;
    treatment_datetime: string;
    approved_by: string | null,
    approved_datetime: string;
    rejected_datetime: string;
    updated_by: string;
    department: string;
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
}
