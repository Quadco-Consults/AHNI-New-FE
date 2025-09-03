// import { IAssetClassificationData } from "definations/modules/admin/asset-classification";
// import { TAssetConditionData } from "definations/modules/admin/asset-condition";
// import { TLocationData } from "definations/modules/config/location";
import {
  IAssetClassificationData,
  TAssetConditionData,
  TAssetTypeData,
  TFundingSourceData,
  TLocationData,
} from "@/features/modules/types";
import { IProjectSingleData } from "@/features/projects/types/project";
import { IUser } from "features/auth/types/user";
import { z } from "zod";
// import { TAssetTypeData } from "definations/modules/admin/asset-type";
// import { TFundingSourceData } from "definations/modules/project/funding-source";
// import { IProjectSingleData } from "definations/project";

// export const AssetSchema = z.object({
//     name: z.string().min(1, "Please enter a name"),
//     assignee: z.string().min(1, "Please select an assignee"),
//     asset_code: z.string().min(1, "Please enter an asset code"),
//     plate_number: z.string().optional(),
//     chasis_number: z.string().optional(),
//     description: z.string().min(1, "Please enter a description"),
//     asset_type: z.string().min(1, "Please select an asset type"),
//     project: z.string().min(1, "Please select a project"),
//     donor: z.string().min(1, "Please select a donor"),
//     depreciation_rate: z.string().min(1, "Please enter depreciation rate"),
//     acquisition_date: z.string().min(1, "Please enter an acquisition date"),
//     state: z.string().min(1, "Please select a state"),
//     asset_condition: z.string().min(1, "Please select an asset condition"),
//     location: z.string().min(1, "Please select a location"),
//     estimated_life_span: z
//         .string()
//         .min(1, "Please enter an estimated life span"),

//     classification: z.string().min(1, "Please select a classification"),
//     usd_cost: z.string().min(1, "Please enter USD cost"),
//     ngn_cost: z.string().min(1, "Please enter NGN cost"),
//     unit: z.string().min(1, "Please enter a unit"),
//     implementer: z.string().min(1, "Please select an implementer"),
//     insurance_duration: z
//         .string()
//         .min(1, "Please enter current insurance duration"),
// });

export const AssetSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  assignee: z.string().optional().nullable(),
  asset_code: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  chasis_number: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  asset_type: z.string().optional().nullable(),
  project: z.string().optional().nullable(),
  donor: z.string().optional().nullable(),
  depreciation_rate: z.string().optional().nullable(),
  acquisition_date: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  asset_condition: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  estimated_life_span: z.string().optional().nullable(),
  classification: z.string().optional().nullable(),
  usd_cost: z.string().optional().nullable(),
  ngn_cost: z.string().optional().nullable(),
  unit: z.string().min(1, "Please enter unit"),
  implementer: z.string().optional().nullable(),
  insurance_duration: z.string().optional().nullable(),
  category: z.string().min(1, "Please select a Category"),
  uom: z.string().min(1, "Please enter uom"),
});

export type TAssetFormValues = z.infer<typeof AssetSchema>;

export interface TAssetPaginatedData {
  id: string;
  implementer: string;
  asset_condition: string;
  location: string;
  classification: string;
  asset_type: TAssetTypeData;
  created_datetime: string;
  updated_datetime: string;
  name: string;
  assignee: string;
  asset_code: string;
  acquisition_date: string;
  plate_number: string;
  chasis_number: string;
  state: string;
  estimated_life_span: string;
  usd_cost: string;
  ngn_cost: string;
  unit: number;
  created_by: string;
  updated_by: string;
}

export interface TAssetSingleData {
  id: string;
  implementer: IUser;
  plate_number: string;
  chasis_number: string;
  asset_condition: TAssetConditionData;
  location: TLocationData;
  project: IProjectSingleData;
  donor: TFundingSourceData;
  depreciation_rate: string;
  insurance_duration: string;
  classification: IAssetClassificationData;
  asset_type: TAssetTypeData;
  created_datetime: string;
  updated_datetime: string;
  name: string;
  assignee: IUser;
  asset_code: string;
  acquisition_date: string;
  state: string;
  estimated_life_span: string;
  usd_cost: string;
  ngn_cost: string;
  unit: number;
  created_by: string;
  updated_by: string;
  description?: string;
}
