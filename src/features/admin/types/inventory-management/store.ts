import { z } from "zod";
import { TLocationData } from "@/features/modules/types";
import { IUser } from "@/features/auth/types/user";

// Zod Schema for Store Form Validation
export const StoreSchema = z.object({
  name: z.string().min(1, "Please enter store name"),
  code: z.string().min(1, "Please enter store code"),
  location: z.string().min(1, "Please select location"),
  store_type: z.enum(["CENTRAL", "LOCATION"], {
    errorMap: () => ({ message: "Please select store type" }),
  }),
  parent_store: z.string().optional().nullable(),
  store_keeper: z.string().min(1, "Please select store keeper"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type TStoreFormValues = z.infer<typeof StoreSchema>;

// Store Type for API Responses (Paginated)
export interface TStorePaginatedData {
  id: string;
  name: string;
  code: string;
  location: string; // Location ID
  locationName?: string; // For display (camelCase from backend)
  location_data?: TLocationData; // Expanded location object
  store_type: "CENTRAL" | "LOCATION";
  parent_store: string | null;
  parentStoreName?: string; // For display (camelCase from backend)
  parent_store_data?: { id: string; name: string; code: string } | null; // Expanded parent store
  store_keeper: string; // User ID
  storeKeeperName?: string; // For display (camelCase from backend)
  store_keeper_data?: IUser; // Expanded store keeper object
  description?: string;
  is_active: boolean;
  created_datetime: string;
  updated_datetime: string;
  created_by: string;
  updated_by: string | null;
}

// Store Type for Single Store Details
export interface TStoreSingleData {
  id: string;
  name: string;
  code: string;
  description?: string;
  store_type: "CENTRAL" | "LOCATION";
  storeTypeDisplay?: string;

  // Location - API returns both ID and expanded data
  location: string; // Location ID
  locationName?: string; // Direct field
  location_data?: TLocationData; // Expanded location object

  // Parent Store - API returns both ID and expanded data
  parent_store: string | null; // Parent store ID
  parentStoreName?: string | null; // Direct field
  parent_store_data?: TStoreSingleData | null; // Expanded parent store

  // Store Keeper - API returns both ID and expanded data
  store_keeper: string; // Store keeper ID
  storeKeeperName?: string; // Direct field
  store_keeper_data?: IUser; // Expanded user object

  is_active: boolean;
  available_items_count?: number;
  total_stock_value?: number;
  created_datetime: string;
  updated_datetime: string;
  created_by: string; // Created by ID
  updated_by: string | null; // Updated by ID
  created_by_data?: IUser; // Expanded created by user
  updated_by_data?: IUser | null; // Expanded updated by user
}

// API Response Types
export interface StoreApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

export interface StorePaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

// Filter Parameters Interface
export interface StoreFilterParams {
  page?: number;
  size?: number;
  search?: string;
  location?: string;
  store_type?: "CENTRAL" | "LOCATION" | "";
  is_active?: boolean;
  enabled?: boolean;
}
