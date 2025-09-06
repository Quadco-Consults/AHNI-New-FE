import { z } from "zod";
import { TAssetSingleData } from "../inventory-management/asset";
import { IUser } from "features/auth/types/user";
import { TLocationData } from "definations/modules/config/location";
import { TFCONumberData } from "definations/modules/finance/fco-number";

export const FuelRequestSchema = z.object({
    asset: z.string().min(1, "Please select asset"),
    assigned_driver: z.string().min(1, "Please select assigned driver"),
    location: z.string().min(1, "Please select location"),
    vendor: z.string().min(1, "Please select vendor"),
    odometer: z.string().min(1, "Please enter odometer"),
    date: z.string().min(1, "Please select date"),
    price_per_litre: z.string().min(1, "Please enter price per litre"),
    quantity: z.string().min(1, "Please enter quantity"),
    amount: z.string().min(1, "Please enter amount"),
    fco: z.string().min(1, "Please select fco"),
    fuel_coupon: z.string().min(1, "Please enter fuel coupon"),
});

export type TFuelRequestFormValues = z.infer<typeof FuelRequestSchema>;

export interface IFuelRequestPaginatedData {
    id: string;
    asset: string;
    assigned_driver: string;
    location: string;
    vendor: {
        id: string;
        name: string;
    };
    fco: string;
    fuel_coupon: string;
    created_datetime: string;
    updated_datetime: string;
    odometer: number;
    date: string;
    distance_covered: number;
    price_per_litre: string;
    quantity: number;
    amount: string;
    status: string;
    approved_datetime: null;
    rejected_datetime: null;
    created_by: null;
    updated_by: null;
}

export interface IFuelRequestSingleData {
    id: string;
    asset: TAssetSingleData;
    assigned_driver: IUser;
    approved_by: null;
    rejected_by: null;
    location: TLocationData;
    vendor: {
        id: string;
    };
    fco: TFCONumberData;
    fuel_coupon: string;
    created_datetime: string;
    updated_datetime: string;
    odometer: number;
    date: string;
    distance_covered: number;
    price_per_litre: string;
    quantity: number;
    amount: string;
    status: string;
    approved_datetime: null;
    rejected_datetime: null;
    created_by: null;
    updated_by: null;
}
