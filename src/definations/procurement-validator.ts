import { z } from "zod";

export const EOISchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
  status: z.string(),
  financial_year: z.string().min(1, "Field is required"),
  categories: z.array(z.string()),
});

export const PrequalificationCriteriaSchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
  stage: z.string(),
});

export const PrequalificationStagesSchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
});

export const LotsSchema = z.object({
  name: z.string().min(1, "Field is required"),
  packet_number: z.number().min(1, "Field is required"),
});
