// import { IAssetClassificationData } from "definitions/modules/admin/asset-classification";
// import { TAssetConditionData } from "definitions/modules/admin/asset-condition";
// import { TLocationData } from "definitions/modules/config/location";
import {
  IAssetClassificationData,
  TAssetConditionData,
  TAssetTypeData,
  TFundingSourceData,
  TLocationData,
} from "@/features/modules/types";
import { IProjectSingleData } from "@/features/projects/types/project";
import { IUser } from "@/features/auth/types/user";
import { z } from "zod";
// import { TAssetTypeData } from "definitions/modules/admin/asset-type";
// import { TFundingSourceData } from "definitions/modules/project/funding-source";
// import { IProjectSingleData } from "definitions/project";

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

  // Vehicle-specific fields - Basic Info
  plate_number: z.string().optional().nullable(),
  chasis_number: z.string().optional().nullable(), // VIN
  engine_number: z.string().optional().nullable(),
  odometer_reading: z.coerce.string().optional().nullable(), // Current odometer for vehicles - accepts numbers
  make: z.string().optional().nullable(), // Manufacturer (Toyota, Honda, etc.)
  model: z.string().optional().nullable(), // Model (Hilux, Accord, etc.)

  // Vehicle-specific fields - Additional Details
  manufacture_year: z.coerce.string().optional().nullable(), // Year of manufacture
  vehicle_color: z.string().optional().nullable(), // Vehicle color
  fuel_type: z.string().optional().nullable(), // Petrol, Diesel, Electric, Hybrid
  seating_capacity: z.coerce.string().optional().nullable(), // Number of seats
  vehicle_type: z.string().optional().nullable(), // Sedan, SUV, Truck, Van, etc.

  // Vehicle-specific fields - Registration & Insurance
  registration_number: z.string().optional().nullable(), // Government registration number
  registration_expiry_date: z.string().optional().nullable(), // When registration expires
  insurance_policy_number: z.string().optional().nullable(), // Insurance policy number
  insurance_provider: z.string().optional().nullable(), // Insurance company name
  insurance_expiry_date: z.string().optional().nullable(), // When insurance expires

  // Vehicle-specific fields - Maintenance
  last_service_date: z.string().optional().nullable(), // Last maintenance/service date
  next_service_date: z.string().optional().nullable(), // Next scheduled service date
  service_interval_km: z.coerce.string().optional().nullable(), // Service every X km

  // Common equipment fields (IT, Lab, etc.)
  serial_number: z.string().optional().nullable(), // IT, Lab equipment

  // Standard asset fields
  description: z.string().optional().nullable(),
  asset_type: z.string().optional().nullable(),
  project: z.string().optional().nullable(),
  donor: z.string().optional().nullable(),
  depreciation_rate: z.coerce.string().optional().nullable(), // Accepts numbers from input type='number'
  acquisition_date: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  asset_condition: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  estimated_life_span: z.string().optional().nullable(),
  classification: z.string().optional().nullable(),
  usd_cost: z.coerce.string().min(1, "Please enter USD cost"),
  ngn_cost: z.coerce.string().min(1, "Please enter NGN cost"),
  unit: z.coerce.string().min(1, "Please enter unit"), // Accepts numbers from input type='number'
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

  // Vehicle-specific fields - Basic Info
  plate_number: string;
  chasis_number: string;
  engine_number?: string;
  odometer_reading?: number | string;
  make?: string;
  model?: string;

  // Vehicle-specific fields - Additional Details
  manufacture_year?: string | number;
  vehicle_color?: string;
  fuel_type?: string;
  seating_capacity?: string | number;
  vehicle_type?: string;

  // Vehicle-specific fields - Registration & Insurance
  registration_number?: string;
  registration_expiry_date?: string;
  insurance_policy_number?: string;
  insurance_provider?: string;
  insurance_expiry_date?: string;

  // Vehicle-specific fields - Maintenance
  last_service_date?: string;
  next_service_date?: string;
  service_interval_km?: string | number;

  // Common equipment fields
  serial_number?: string;

  // Standard asset fields
  asset_condition: TAssetConditionData;
  location: TLocationData;
  project: IProjectSingleData;
  donor: TFundingSourceData;
  depreciation_rate: string | number;
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
  uom?: string;
  category?: string | { id: string; name: string };
  category_detail?: any;
}
