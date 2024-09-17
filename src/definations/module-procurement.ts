import { z } from "zod";

export const lotsSchema = z.object({
  packet_number: z.string(),
  name: z.string(),
});
export const solicitationSchema = z.object({
    description: z.string(),
    name: z.string(),
});
export const prequalificationCategorySchema = z.object({
    description: z.string(),
    name: z.string(),
});
export const prequalificationCriteriaSchema = z.object({
    description: z.string(),
    name: z.string(),
    category: z.string(),
});
export const questionairsSchema = z.object({
    description: z.string(),
    name: z.string(),
});

export type TLots = z.infer<typeof lotsSchema>;
export type TSolicitation = z.infer<typeof solicitationSchema>;
export type TPrequalificationCategory = z.infer<typeof prequalificationCategorySchema>;
export type TPrequalificationCriteria = z.infer<typeof prequalificationCriteriaSchema>;
export type TQuestionairs = z.infer<typeof questionairsSchema>;

export interface Lots {
  id: string;
  name: string;
  packet_number: number;
}
export interface Solicitation {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}
export interface PrequalificationCategory {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}
export interface PrequalificationCriteria {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
    category: string;
}
export interface Questionairs {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}


