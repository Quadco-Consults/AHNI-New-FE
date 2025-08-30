import { z } from "zod";
import { TAssetSingleData } from "./asset";
import { TLocationData } from "@/features/modules/types";

export const AssetRequestSchema = z.object({
  asset: z.string().min(1, "Please select an asset"),
  type: z.string().min(1, "Please select a type"),
  recommendation: z.string().min(1, "Please enter a recommendation"),
  description: z.string().min(1, "Please enter a description"),
  reviewer: z.string().min(1, "Please select a reviewer"),
  authorizer: z.string().min(1, "Please select an authorizer"),
  approver: z.string().min(1, "Please select an approver"),
  from_location: z.string().optional().nullable(),
  to_location: z.string().optional().nullable(),
  disposal_justification: z
    .string()
    .min(1, "Please enter a disposal justification"),
});

export type TAssetRequestFormValues = z.infer<typeof AssetRequestSchema>;

export interface IAssetRequestPaginatedData {
  id: string;
  asset: string;
  created_datetime: string;
  updated_datetime: string;
  type: string;
  status: string;
  recommendation: string;
  description: string;
  disposal_justification: string;
  comments: string | null;
  created_by: string;
  updated_by: string | null;
}

export interface IAssetRequestSingleSData {
  id: string;
  asset: TAssetSingleData;
  approvals: {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    approval_level: string;
    comments: null;
  }[];
  created_datetime: string;
  updated_datetime: string;
  type: string;
  status: string;
  recommendation: string;
  description: string;
  disposal_justification: string;
  from_location: TLocationData;
  to_location: TLocationData;
  comments: string;
  created_by: string;
  updated_by: string;
  document?: string;
}
