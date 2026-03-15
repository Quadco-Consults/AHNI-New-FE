import { z } from "zod";

export const InterventionAreaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  budget_lines: z.array(z.string()).optional(),
});

export type TInterventionAreaFormValues = z.infer<
  typeof InterventionAreaSchema
>;

export interface TInterventionAreaData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  name: string;
  code?: string;
  description?: string;
  budget_lines?: string[];
}
