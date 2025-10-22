import { z } from "zod";

const ActivitySchema = z.object({
    id: z.string().optional(), // Activity ID (present when editing)
    date: z.string().min(1, "Please select date"),
    activity: z.string().min(1, "Please enter activity"),
    departure_datetime: z
        .string()
        .min(1, "Please select departure date"),
    departure_point: z.string().optional().or(z.literal("")),
    arrival_datetime: z.string().min(1, "Please select arrival date"),
    assignment_location: z
        .string()
        .optional().or(z.literal("")),
    visa_free: z.string().optional().or(z.literal("")),
    airport_taxi_fee: z
        .string()
        .optional().or(z.literal("")),
    registration_fee: z
        .string()
        .optional().or(z.literal("")),
    inter_city_taxi_fee: z
        .string()
        .optional().or(z.literal("")),
    total_amount: z.string().optional().or(z.literal("")),
    others: z.string().optional().or(z.literal("")), // Make others optional
});

const TravelerSchema = z.object({
    user: z.string().min(1, "Please select user"),
    staff_id: z.string().min(1, "Please enter staff id"),
    activities: z.array(ActivitySchema).min(1, "At least one activity is required"),
});

export const TravelExpenseSchema = z.object({
    expense_authorization: z.string().optional().or(z.literal("")), // Optional in edit mode
    user: z.string().min(1, "Please select user").optional(),
    staff_id: z.string().min(1, "Please enter staff id").optional(),
    travel_purpose: z.string().min(1, "Please enter travel purpose"),
    document: z.any().optional().nullable(), // Allow null and undefined

    // Approval workflow fields
    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),

    // Single traveler format
    activities: z.array(ActivitySchema).optional(),

    // Multiple travelers format
    travelers: z.array(TravelerSchema).optional(),
}).refine(
    (data) => {
        // Either activities (single traveler) or travelers (multiple travelers) must be provided
        const hasActivities = data.activities && data.activities.length > 0;
        const hasTravelers = data.travelers && data.travelers.length > 0;

        return hasActivities || hasTravelers;
    },
    {
        message: "Either activities (single traveler) or travelers (multiple travelers) must be provided",
        path: ["activities"], // This will show the error on the activities field
    }
);

export type TTravelExpenseFormData = z.infer<typeof TravelExpenseSchema>;

// Activity interface for API response
export interface IActivity {
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
}

// Traveler interface for API response
export interface ITraveler {
    id: string;
    user: {
        id: string;
        email: string;
        employee_id: string | null;
        full_name: string;
        department: string | null;
    };
    staff_id: string;
    activities: IActivity[];
}

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
    user?: {
        id: string;
        email: string;
        employee_id: string | null;
        full_name: string;
        department: string | null;
    };
    // Single traveler format
    activities?: IActivity[];
    // Multiple travelers format
    travelers?: ITraveler[];
    approvals: IApproval[];
    document?: string;
    document_url?: string;
    created_datetime: string;
    updated_datetime: string;
    staff_id?: string;
    travel_purpose: string;
    status: string;
    approved_datetime: null;
    rejected_datetime: null;
    created_by: string;
    updated_by: string | null;
    approved_by: string | null;
    rejected_by: string | null;
}
