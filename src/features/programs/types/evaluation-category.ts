import { z } from "zod";

export const EvaluationCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export interface EvaluationCategoryData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  description: string;
}

export interface EvaluationCategoryResponse {
  message: string;
  data: EvaluationCategoryData;
}
