import { z } from "zod";

export const TravelExpenseSchema = z.object({
    expense_authorization: z.string().min(1, "Please select expense authorization"),
    user: z.string().min(1, "Please select user"),
    staff_id: z.string().min(1, "Please enter staff id"),
    travel_purpose: z.string().min(1, "Please enter travel purpose"),

    // Approval workflow fields
    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),

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

// Approval interface for API response
interface IApproval {
    id: string;
    user: {
        id: string;
        email: string;
        employee_id: string | null;
        full_name: string;
        department: string | null;
    };
    created_datetime: string;
    updated_datetime: string;
    approval_level: "REVIEW" | "AUTHORIZE" | "APPROVE";
    comments: string | null;
    is_executed: boolean;
}

export interface ITravelExpenseSingleData {
    id: string;
    user: {
        id: string;
        email: string;
        employee_id: string | null;
        full_name: string;
        department: string | null;
    };
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
    approvals: IApproval[];
    created_datetime: string;
    updated_datetime: string;
    staff_id: string;
    travel_purpose: string;
    status: string;
    approved_datetime: null;
    rejected_datetime: null;
    created_by: string;
    updated_by: string | null;
    approved_by: string | null;
    rejected_by: string | null;
}
