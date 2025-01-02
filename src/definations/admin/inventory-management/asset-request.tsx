import { z } from "zod";

export const AssetRequestSchema = z.object({
    asset: z.string().min(1, "Please select an asset"),
    type: z.string().min(1, "Please select a type"),
    recommendation: z.string().min(1, "Please enter a recommendation"),
    description: z.string().min(1, "Please enter a description"),
    reviewer: z.string().min(1, "Please select a reviewer"),
    authorizer: z.string().min(1, "Please select an authorizer"),
    approver: z.string().min(1, "Please select an approver"),
    disposal_justification: z
        .string()
        .min(1, "Please enter a disposal justification"),
});

export type TAssetRequestFormValues = z.infer<typeof AssetRequestSchema>;

export interface IAssetRequestPaginatedData {}

export interface IAssetRequestSingleSData {}
