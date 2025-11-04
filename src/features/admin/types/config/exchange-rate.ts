import { z } from "zod";

export const ExchangeRateSchema = z.object({
  base_currency: z.string().min(1, "Base currency is required"),
  target_currency: z.string().min(1, "Target currency is required"),
  exchange_rate: z.number().min(0.0001, "Exchange rate must be greater than 0"),
  effective_date: z.string().min(1, "Effective date is required"),
  expiry_date: z.string().optional(),
  source: z.string().min(1, "Source is required"),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type ExchangeRateFormValues = z.infer<typeof ExchangeRateSchema>;

export interface IExchangeRate {
  id: string;
  base_currency: string;
  target_currency: string;
  exchange_rate: number;
  effective_date: string;
  expiry_date?: string;
  source: string; // Bank, CBN, Manual, etc.
  notes?: string;
  is_active: boolean;
  created_by: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface ExchangeRateFormData {
  base_currency: string;
  target_currency: string;
  exchange_rate: number;
  effective_date: string;
  expiry_date?: string;
  source: string;
  notes?: string;
  is_active: boolean;
}

export type ExchangeRateSource = 'CBN' | 'Bank' | 'Manual' | 'API';

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}