import { IUser } from "features/auth/types/user";
import { TLocationData } from "definations/modules/config/location";
import { z } from "zod";

export const VehicleRequestSchema = z.object({
  location: z.string().min(1, "Please select a location"),
  travel_destination: z.string().min(1, "Please enter a travel destination"),
  departure_point: z.string().min(1, "Please enter point of departure"),
  return_point: z.string().min(1, "Please enter point of return"),
  departure_datetime: z.string().min(1, "Please select a departure date"),
  return_datetime: z.string().min(1, "Please select date of return"),
  travel_team_members: z.array(
    z.string().min(1, "Please select a team member")
  ),
  supervisor: z.string().min(1, "Please select a supervisior"),
  recommendations: z.string().min(1, "Please enter a recommendation"),
  purpose_of_travel: z.string().min(1, "Please enter purpose of travel"), // Required by backend (has default "General travel")

  // ⚠️ WARNING: project and activity are NOT in the backend VehicleRequest model
  // These fields are currently sent but NOT SAVED by the backend
  // TODO: Either remove from frontend OR add to backend model
  project: z.string().min(1, "Please select a project"),
  activity: z.string().min(1, "Please select an activity"),

  request_type: z.string().min(1, "Please select a request type"),
  vendor: z.string().optional(), // Optional because it's only required when request_type is "VENDOR"
  asset_vehicle: z.string().optional(), // Optional because it's only required when request_type is "ASSET"
}).refine((data) => {
  // Conditional validation: vendor is required when request_type is "VENDOR"
  if (data.request_type === "VENDOR") {
    return data.vendor && data.vendor.length > 0;
  }
  // Conditional validation: asset_vehicle is required when request_type is "AHNI_ASSET"
  if (data.request_type === "AHNI_ASSET") {
    return data.asset_vehicle && data.asset_vehicle.length > 0;
  }
  return true;
}, {
  message: "Please select a vehicle/vendor based on request type",
  path: ["vendor", "asset_vehicle"],
});

export const VehicleRequestApprovalSchema = z.object({
  vehicles: z.array(z.object({
    vehicle: z.string().min(1, "Please select a vehicle"),
    driver: z.string().min(1, "Please select a driver"),
  })).min(1, "Please add at least one vehicle"),
  comment: z.string().optional(),
});

// API payload type - actual backend format
export interface VehicleRequestApprovalPayload {
  vehicles: {vehicle: string, driver: string}[]; // Array of vehicle-driver pair objects
  comment?: string;
}

export type TVehicleRequestFormValues = z.infer<typeof VehicleRequestSchema>;
export type TVehicleRequestApprovalFormValues = z.infer<typeof VehicleRequestApprovalSchema>;

export interface IVehicleRequestPaginatedData {
  id: string;
  created_by: string; // User ID
  location: string;
  supervisor: string; // Supervisor display name (should be full name from backend)
  travel_team_members_names: string[]; // Array of team member names
  created_datetime: string;
  updated_datetime: string;
  status: string;
  travel_destination: string;
  departure_datetime: string;
  departure_point: string;
  return_datetime: string;
  return_point: string;
  recommendations: string;
  purpose_of_travel?: string; // Temporarily optional due to backend migration issue
  approved_datetime: null;
  updated_by: null;
  requesting_staff: string; // Requesting staff display name (should be full name from backend)
  approved_by: null;
  vehicles: [];
  // New fields from form
  project?: string;
  activity?: string;
  request_type?: string;
  vendor?: string;
  asset_vehicle?: string;
}

export interface IVehicleSingleData {
  id: string;
  travel_team_members: IUser[];
  location: TLocationData;
  created_by: IUser;
  supervisor: IUser;
  created_datetime: string;
  updated_datetime: string;
  status: string;
  travel_destination: string;
  departure_datetime: string;
  departure_point: string;
  return_datetime: string;
  return_point: string;
  recommendations: string;
  purpose_of_travel?: string; // Temporarily optional due to backend migration issue
  approved_datetime: string | null;
  updated_by: string | null;
  requesting_staff: IUser;
  approved_by: string | null;
  vehicles: [];
  // New fields from form
  project?: any; // Should be project object with id, title etc.
  activity?: any; // Should be activity object with id, activity_name etc.
  request_type?: string;
  vendor?: any; // Should be vendor object with id, company_name etc.
  asset_vehicle?: any; // Should be asset object with id, name, plate_number etc.
  vehicle_assignments?: {
    id: string;
    vehicle: string;
    vehicle_name: string;
    assigned_driver: string;
    driver_name: string;
  }[];
}
