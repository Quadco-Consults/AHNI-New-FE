import { TDepartmentData } from "definations/modules/config/department";
import { TLocationData } from "definations/modules/config/location";
// import { TFacilityData } from "definations/modules/program/facility";
import { z } from "zod";
import { TAssetSingleData } from "./inventory-management/asset";

export const AssetMaintenanceSchema = z.object({
  // staff_name: z.string().min(1, "Please select staff"),
  // department: z.string().min(1, "Please select department"),
  // location: z.string().min(1, "Please select location"),
  maintenance_datetime: z.string().min(1, "Please select maintenance date"),
  asset: z.string().min(1, "Please select asset"),
  maintenance_type: z.string().min(1, "Please enter maintenance type"),
  rate: z.string().min(1, "Please enter rate"),
  cost_estimate: z.string().min(1, "Please enter cost estimate"),
  total_cost_estimate: z.string().min(1, "Please enter total cost estimate"),
  description_type: z.string().min(1, "Please select description"),
  description: z.string().min(1, "Please enter problem description"),
  reviewer: z.string().min(1, "Please select reviewer"),
  authorizer: z.string().min(1, "Please select authorizer"),
  approver: z.string().min(1, "Please select approver"),
});

export type TAssetMaintenanceFormData = z.infer<typeof AssetMaintenanceSchema>;

export interface IAssetMaintenancePaginatedData {
  id: string;
  department: string;
  location: string;
  asset: string;
  asset_classification: string;
  created_datetime: string;
  updated_datetime: string;
  staff_name: string;
  maintenance_datetime: string;
  maintenance_type: string;
  rate: string;
  cost_estimate: string;
  total_cost_estimate: string;
  description_type: string;
  description: string;
  problem_description: string;
  disposal_justification: string;
  status: string;
  created_by: string;
  updated_by: string;
}

export interface IAssetMaintenanceSingleData {
  id: string;
  department: TDepartmentData;
  location: TLocationData;
  asset: TAssetSingleData;
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
  staff_name: string;
  maintenance_datetime: string;
  maintenance_type: string;
  rate: string;
  cost_estimate: string;
  total_cost_estimate: string;
  description_type: string;
  description: string;
  problem_description: null;
  disposal_justification: string;
  status: string;
  created_by: string;
  updated_by: string | null;
}
