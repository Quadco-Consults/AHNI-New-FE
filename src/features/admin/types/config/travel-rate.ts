import { z } from "zod";

export const TravelRateSchema = z.object({
  location: z.string().min(1, "Location is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  accommodation_rate: z.number().min(0, "Accommodation rate must be 0 or greater"),
  meal_allowance: z.number().min(0, "Meal allowance must be 0 or greater"),
  transport_allowance: z.number().min(0, "Transport allowance must be 0 or greater"),
  per_diem_rate: z.number().min(0, "Per diem rate must be 0 or greater"),
  currency: z.string().min(1, "Currency is required"),
  effective_date: z.string().min(1, "Effective date is required"),
  expiry_date: z.string().optional(),
  category: z.enum(['Local', 'International', 'Regional']),
  staff_level: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type TravelRateFormValues = z.infer<typeof TravelRateSchema>;

export interface ITravelRate {
  id: string;
  location: string;
  state: string;
  country: string;
  accommodation_rate: number;
  meal_allowance: number;
  transport_allowance: number;
  per_diem_rate: number;
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
  location: string;
  state: string;
  country: string;
  accommodation_rate: number;
  meal_allowance: number;
  transport_allowance: number;
  per_diem_rate: number;
  currency: string;
  effective_date: string;
  expiry_date?: string;
  category: TravelCategory;
  staff_level?: string;
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