import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Field Required"),
  code: z.string().min(1, "Field Required"),
  description: z.string().optional(),
  serial_number: z.any().optional(),
  job_category: z.enum(["GOODS", "SERVICE", "WORK", "OTHERS"]),
  parent: z.string().optional(), // Parent category ID for hierarchical structure
});

export type TCategoryFormValues = z.infer<typeof CategorySchema>;

export interface TCategoryData {
  created_at: string;
  description: string;
  id: string;
  name: string;
  updated_at: string;
  job_category: string;
  serial_number: any;
  code: string;
  parent?: string | TCategoryData | null; // Can be ID string or nested category object
  children?: TCategoryData[]; // Child categories for hierarchical display
}
