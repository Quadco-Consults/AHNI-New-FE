import { IAssetClassificationData } from "definations/modules/admin/asset-classification";
import { TAssetConditionData } from "definations/modules/admin/asset-condition";
import { TLocationData } from "definations/modules/config/location";
import { TUser } from "definations/auth/user";
import { z } from "zod";

export const AssetSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    assignee: z.string().min(1, "Please select an assignee"),
    asset_code: z.string().min(1, "Please enter an asset code"),
    acquisition_date: z.string().min(1, "Please enter an acquisition date"),
    state: z.string().min(1, "Please select a state"),
    asset_condition: z.string().min(1, "Please select an asset condition"),
    location: z.string().min(1, "Please select a location"),
    estimated_life_span: z
        .string()
        .min(1, "Please enter an estimated life span"),

    classification: z.string().min(1, "Please select a classification"),
    usd_cost: z.string().min(1, "Please enter USD cost"),
    ngn_cost: z.string().min(1, "Please enter NGN cost"),
    unit: z.string().min(1, "Please enter a unit"),
    implementer: z.string().min(1, "Please select an implementer"),
});

export type TAssetFormValues = z.infer<typeof AssetSchema>;

export interface TAssetPaginatedData {
    id: string;
    implementer: string;
    asset_condition: string;
    location: string;
    classification: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    assignee: string;
    asset_code: string;
    acquisition_date: string;
    state: string;
    estimated_life_span: string;
    usd_cost: string;
    ngn_cost: string;
    unit: number;
    created_by: string;
    updated_by: string;
}

export interface TAssetSingleData {
    id: string;
    implementer: TUser;
    asset_condition: TAssetConditionData;
    location: TLocationData;
    classification: IAssetClassificationData;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    assignee: string;
    asset_code: string;
    acquisition_date: string;
    state: string;
    estimated_life_span: string;
    usd_cost: string;
    ngn_cost: string;
    unit: number;
    created_by: string;
    updated_by: string;
}
