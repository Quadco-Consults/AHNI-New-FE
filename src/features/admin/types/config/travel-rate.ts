import { z } from "zod";

export const TravelRateSchema = z.object({
  state: z.string().min(1, "State is required"),
  accommodation_rate: z.coerce.number().min(0, "Accommodation rate must be 0 or greater"),
  meal_allowance: z.coerce.number().min(0, "Meal allowance must be 0 or greater"),
  effective_date: z.string().min(1, "Effective date is required"),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type TravelRateFormValues = z.infer<typeof TravelRateSchema>;

export interface ITravelRate {
  id: string;
  location: string;
  state: string;
  state_name?: string; // State name from relationship
  state_code?: string; // State code from relationship
  country: string;
  accommodation_rate: number;
  meal_allowance: number;
  transport_allowance: number;
  per_diem_rate: number;
  lodging_rate?: number; // Backend field name
  mie_rate?: number; // Backend field name
  currency: string;
  effective_date: string;
  expiry_date?: string;
  category: TravelCategory; // Local, International, etc.
  staff_level?: string; // Grade levels that apply
  notes?: string;
  is_active: boolean;
  created_by: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface TravelRateFormData {
  state: string;
  accommodation_rate: number;
  meal_allowance: number;
  effective_date: string;
  notes?: string;
  is_active: boolean;
}

export type TravelCategory = 'Local' | 'International' | 'Regional';

export interface LocationOption {
  id: string;
  name: string;
  state: string;
  country: string;
}