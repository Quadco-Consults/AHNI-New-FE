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
  location_name?: string; // For display
  store_type: "CENTRAL" | "LOCATION";
  parent_store: string | null;
  parent_store_name?: string; // For display
  store_keeper: string; // User ID
  store_keeper_name?: string; // For display
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
  location: TLocationData; // Full location object
  store_type: "CENTRAL" | "LOCATION";
  parent_store: TStoreSingleData | null; // Nested parent store
  store_keeper: IUser; // Full user object
  description?: string;
  is_active: boolean;
  created_datetime: string;
  updated_datetime: string;
  created_by: IUser;
  updated_by: IUser | null;
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
