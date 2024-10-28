import { z } from "zod";

export const assetConditionsSchema = z.object({
  description: z.string(),
  name: z.string(),
  id: z.string().optional(),
});
export const assetTypesSchema = z.object({
  name: z.string(),
  manufacturer: z.string(),
  model: z.string(),
  id: z.string().optional(),
});

export type TAssetConditions = z.infer<typeof assetConditionsSchema>;
export type TAssetTypes = z.infer<typeof assetTypesSchema>;

export interface AssetConditions {
  created_at: string;
  description: string;
  id: string;
  name: string;
  updated_at: string;
}
export interface AssetTypes {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  manufacturer: string;
  model: string;
}
