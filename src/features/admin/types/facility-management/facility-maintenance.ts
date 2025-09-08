import { IUser } from "features/auth/types/user";
import { TDepartmentData } from "definations/modules/config/department";
import { TLocationData } from "definations/modules/config/location";
import { TFacilityData } from "definations/modules/program/facility";
import { z } from "zod";

export const FacilityMaintenanceSchema = z.object({
    location: z.string().min(1, "Please select location"),
    maintenance_datetime: z.string().min(1, "Please select maintenance date"),
    facility: z.string().min(1, "Please select facility"),
    maintenance_type: z.string().min(1, "Please enter maintenance type"),
    rate: z.string().min(1, "Please enter rate"),
    cost_estimate: z.string().min(1, "Please enter cost estimate"),
    total_cost_estimate: z.string().min(1, "Please enter total cost estimate"),
    description: z.string().min(1, "Please select description"),
    problem_description: z.string().min(1, "Please enter problem description"),
    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),
});

export type TFacilityMaintenanceFormValues = z.infer<
    typeof FacilityMaintenanceSchema
>;

export interface IFacilityMaintenancePaginatedData {
    id: string;
    staff: string;
    department: string;
    location: string;
    facility: string;
    created_datetime: string;
    updated_datetime: string;
    maintenance_datetime: string;
    maintenance_type: string;
    rate: string;
    cost_estimate: string;
    total_cost_estimate: string;
    description: string;
    problem_description: string;
    status: string;
    created_by: string;
    updated_by: null;
}

export interface IFacilityMaintenanceSingleData {
    id: string;
    staff: IUser;
    department: TDepartmentData;
    location: TLocationData;
    facility: TFacilityData;
    approvals: {
        id: string;
        user: {
            id: string;
            email: string;
            employee_id: string | null;
            full_name: string;
        };
        created_datetime: string;
        updated_datetime: string;
        approval_level: string;
        comments: string | null;
    }[];
    created_datetime: string;
    updated_datetime: string;
    maintenance_datetime: string;
    maintenance_type: string;
    rate: string;
    cost_estimate: string;
    total_cost_estimate: string;
    description: string;
    problem_description: string;
    status: string;
    created_by: string;
    updated_by: null;
}
