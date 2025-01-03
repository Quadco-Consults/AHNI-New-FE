import { z } from "zod";

export const AssetTypeSchema = z.object({
    name: z.string().min(1, "Field Required"),
    manufacturer: z.string().min(1, "Field Required"),
    model: z.string().min(1, "Field Required"),
    serial_number: z.string().min(1, "Field Required"),
});

export type TAssetTypeFormValues = z.infer<typeof AssetTypeSchema>;

export interface TAssetTypeData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    serial_number: string;
    manufacturer: string;
    model: string;
}
