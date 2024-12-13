import { z } from "zod";

export const AssetConditionSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TAssetConditionFormValues = z.infer<typeof AssetConditionSchema>;

export interface TAssetConditionData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}
