import { z } from "zod";
import { TStoreSingleData } from "./store";
import { TItemData } from "../config/item";

// ===== STORE TRANSFER SCHEMA =====

export const StoreTransferItemSchema = z.object({
  item: z.string().min(1, "Please select an item"),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  remark: z.string().optional(),
});

export const StoreTransferSchema = z.object({
  source_store: z.string().min(1, "Please select source store"),
  destination_store: z.string().min(1, "Please select destination store"),
  transfer_reason: z.string().min(1, "Please enter transfer reason"),
  expected_delivery_date: z.string().optional(),
  items: z
    .array(StoreTransferItemSchema)
    .min(1, "At least one item is required"),
});

export type TStoreTransferFormValues = z.infer<typeof StoreTransferSchema>;
export type TStoreTransferItemFormValues = z.infer<typeof StoreTransferItemSchema>;

// ===== STORE TRANSFER INTERFACES =====

export type StoreTransferStatus =
  | "pending"       // Transfer created, awaiting approval
  | "approved"      // Approved, ready to ship
  | "in_transit"    // Items shipped, in transit
  | "received"      // Items received at destination
  | "rejected"      // Transfer rejected
  | "cancelled";    // Transfer cancelled

export interface IStoreTransferItem {
  id: string;
  item: string;
  item_detail?: TItemData;
  quantity_requested: number;
  quantity_approved?: number;
  quantity_sent?: number;
  quantity_received?: number;
  remark?: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface IStoreTransferPaginatedData {
  id: string;
  transfer_number: string;
  source_store: string;
  source_store_name?: string;
  source_store_code?: string;
  destination_store: string;
  destination_store_name?: string;
  destination_store_code?: string;
  transfer_reason: string;
  status: StoreTransferStatus;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  created_datetime: string;
  updated_datetime: string;
  created_by: string;
  created_by_name?: string;
  approved_by?: string | null;
  approved_by_name?: string | null;
  approved_datetime?: string | null;
  rejected_by?: string | null;
  rejected_by_name?: string | null;
  rejected_datetime?: string | null;
  shipped_by?: string | null;
  shipped_by_name?: string | null;
  shipped_datetime?: string | null;
  received_by?: string | null;
  received_by_name?: string | null;
  received_datetime?: string | null;
}

export interface IStoreTransferSingleData {
  id: string;
  transfer_number: string;
  source_store: string;
  source_store_detail?: TStoreSingleData;
  destination_store: string;
  destination_store_detail?: TStoreSingleData;
  transfer_reason: string;
  status: StoreTransferStatus;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  items: IStoreTransferItem[];

  // Audit trail
  created_datetime: string;
  updated_datetime: string;
  created_by: string;
  created_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;

  // Approval workflow
  approved_by?: string | null;
  approved_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
  approved_datetime?: string | null;
  approval_comment?: string | null;

  // Rejection workflow
  rejected_by?: string | null;
  rejected_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
  rejected_datetime?: string | null;
  rejection_reason?: string | null;

  // Shipping workflow
  shipped_by?: string | null;
  shipped_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
  shipped_datetime?: string | null;
  shipping_comment?: string | null;

  // Receiving workflow
  received_by?: string | null;
  received_by_detail?: {
    user_id: string;
    name: string;
    email?: string;
  } | null;
  received_datetime?: string | null;
  receiving_comment?: string | null;
}

// ===== FILTER PARAMETERS =====

export interface StoreTransferFilterParams {
  page?: number;
  size?: number;
  search?: string;
  source_store?: string;
  destination_store?: string;
  status?: StoreTransferStatus | string;
  created_by?: string;
  enabled?: boolean;
}

// ===== HELPER FUNCTIONS =====

export function getStoreTransferStatusColor(status: StoreTransferStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-blue-100 text-blue-800";
    case "in_transit":
      return "bg-purple-100 text-purple-800";
    case "received":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStoreTransferStatusLabel(status: StoreTransferStatus): string {
  switch (status) {
    case "pending":
      return "⏳ Pending Approval";
    case "approved":
      return "✓ Approved";
    case "in_transit":
      return "🚚 In Transit";
    case "received":
      return "✓ Received";
    case "rejected":
      return "✗ Rejected";
    case "cancelled":
      return "⊗ Cancelled";
    default:
      return status;
  }
}

// ===== API RESPONSE INTERFACES =====

export interface StoreTransferPaginatedResponse<T> {
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

export interface StoreTransferSingleResponse {
  status: boolean;
  message: string;
  data: IStoreTransferSingleData;
}
