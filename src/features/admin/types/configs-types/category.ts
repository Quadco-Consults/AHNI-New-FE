import { z } from "zod";

export type CategoryResultsData = {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  serial_number: number;
  job_category: string;
};

export interface CategoryData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: CategoryResultsData[];
}

export interface CategoryResponse {
  message: string;
  data: CategoryResultsData;
}

export const CategorySchema = z.object({
  name: z.string(),
  description: z.string(),
  serial_number: z.number(),
  job_category: z.string(),
});