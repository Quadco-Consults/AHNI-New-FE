import { z } from "zod";

export type FinancialYearResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  year: string;
  is_current: boolean;
  dynamic_order: number;
};

export interface FinancialYearData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: FinancialYearResultsData[];
}

export interface FinancialYearResponse {
  message: string;
  data: FinancialYearResultsData;
}

export const FinancialYearSchema = z.object({
  year: z.string(),
  is_current: z.boolean(),
});