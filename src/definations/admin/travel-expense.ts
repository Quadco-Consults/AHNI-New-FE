import { IUser } from "definations/auth/user";
import { z } from "zod";

export const TravelExpenseSchema = z.object({
    user: z.string().min(1, "Please select user"),
    staff_id: z.string().min(1, "Please enter staff id"),
    travel_purpose: z.string().min(1, "Please enter travel purpose"),

    activities: z.array(
        z.object({
            date: z.string().min(1, "Please select date"),
            activity: z.string().min(1, "Please enter activity"),
            departure_datetime: z
                .string()
                .min(1, "Please select departure date"),
            departure_point: z.string().min(1, "Please enter departure point"),
            arrival_datetime: z.string().min(1, "Please select arrival date"),
            assignment_location: z
                .string()
                .min(1, "Please enter assignment location"),
            visa_free: z.string().min(1, "Please select visa free option"),
            airport_taxi_fee: z
                .string()
                .min(1, "Please enter airport taxi fee"),
            registration_fee: z
                .string()
                .min(1, "Please enter registration fee"),
            inter_city_taxi_fee: z
                .string()
                .min(1, "Please enter inner city taxi fee"),
            total_amount: z.string().min(1, "Please enter total amount"),
            others: z.string(),
        })
    ),
});

export type TTravelExpenseFormData = z.infer<typeof TravelExpenseSchema>;

export interface ITravelExpensePaginatedData {
    id: string;
    user: string;
    created_datetime: string;
    updated_datetime: string;
    staff_id: string;
    travel_purpose: string;
    status: string;
    approved_datetime: string | null;
    rejected_datetime: string | null;
    created_by: null;
    updated_by: null;
    approved_by: null;
    rejected_by: null;
}

export interface ITravelExpenseSingleData {
    id: string;
    user: IUser;
    activities: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        activity: string;
        date: string;
        departure_point: string;
        departure_datetime: string;
        arrival_datetime: string;
        assignment_location: string;
        visa_free: boolean;
        airport_taxi_fee: string;
        registration_fee: string;
        inter_city_taxi_fee: string;
        total_amount: string;
        others: string;
    }[];
    created_datetime: string;
    updated_datetime: string;
    staff_id: string;
    travel_purpose: string;
    status: string;
    approved_datetime: null;
    rejected_datetime: null;
    created_by: null;
    updated_by: null;
    approved_by: null;
    rejected_by: null;
}
