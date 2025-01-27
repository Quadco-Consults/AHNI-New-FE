import { z } from "zod";

export const InterventionAreaSchema = z.object({
  code: z.string().min(1, "Field Required"),
  description: z.string().optional(),
});

export type TInterventionAreaFormValues = z.infer<
  typeof InterventionAreaSchema
>;

export interface TInterventionAreaData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  code: string;
  description: string;
}
