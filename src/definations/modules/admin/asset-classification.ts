import { z } from "zod";

export const AssetClassificationSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().optional(),
});

export type TAssetClassificationFormValues = z.infer<
    typeof AssetClassificationSchema
>;

export interface IAssetClassificationData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    created_by: string;
    updated_by: string;
}
