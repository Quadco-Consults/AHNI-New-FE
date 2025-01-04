import { z } from "zod";
import { TAssetSingleData } from "../inventory-management/asset";
import { TFCONumberData } from "definations/modules/finance/fco-number";

export const VehicleMaintenanceSchema = z.object({
    asset: z.string().min(1, "Please select an asset"),
    maintenance_type: z.string().min(1, "Please select a maintenance type"),
    fco: z.string().min(1, "Please select an fco"),
    cost_estimate: z.string().min(1, "Please enter a cost estimate"),
    description: z.string().min(1, "Please enter a description"),
    reviewer: z.string().min(1, "Please select a reviewer"),
    authorizer: z.string().min(1, "Please select an authorizer"),
    approver: z.string().min(1, "Please select an approver"),
});

export type TVehicleMaintenanceFormValues = z.infer<
    typeof VehicleMaintenanceSchema
>;

export interface IVehicleMaintenancePaginatedData {
    id: string;
    asset: string;
    fco: string;
    created_datetime: string;
    updated_datetime: string;
    maintenance_type: string;
    cost_estimate: string;
    description: string;
    status: string;
    created_by: string;
    updated_by: string | null;
}

export interface IVehicleMaintenanceSingleData {
    id: string;
    asset: TAssetSingleData;
    fco: TFCONumberData;
    approvals: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        approval_level: string;
        comments: string | null;
    }[];
    created_datetime: string;
    updated_datetime: string;
    maintenance_type: string;
    cost_estimate: string;
    description: string;
    status: string;
    created_by: string;
    updated_by: string | null;
}
