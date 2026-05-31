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
    visa_fee: z
        .string()
        .optional().or(z.literal("")),
    airport_taxi_fee: z
        .string()
        .optional().or(z.literal("")),
    registration_fee: z
        .string()
        .optional().or(z.literal("")),
    inter_city_taxi_fee: z
        .string()
        .optional().or(z.literal("")),
    // New expense fields
    mileage_cost: z
        .string()
        .optional().or(z.literal("")),
    hotel_accommodation: z
        .string()
        .optional().or(z.literal("")),
    per_diem: z
        .string()
        .optional().or(z.literal("")),
    communication_costs: z
        .string()
        .optional().or(z.literal("")),
    within_city_taxi_fee: z
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
    // Link to EA and Site Visit (optional)
    expense_authorization: z.string().optional().or(z.literal("")),
    site_visit: z.string().optional().or(z.literal("")),

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
    visa_fee: string;
    airport_taxi_fee: string;
    registration_fee: string;
    inter_city_taxi_fee: string;
    // New expense fields to match manual TER form
    mileage_cost: string;
    hotel_accommodation: string;
    per_diem: string;
    communication_costs: string;
    within_city_taxi_fee: string;
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
    user: string | {
        id: string;
        email: string;
        employee_id: string | null;
        full_name: string;
        department: string | null;
    };
    user_data?: {
        id: string;
        email: string;
        employee_id: string | null;
        full_name: string;
        department: string | null;
    };
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

// Reconciliation document interface
export interface IReconciliationDocument {
    id: string;
    reconciliation_id: string;
    document_type: "INVOICE" | "RECEIPT" | "BANK_STATEMENT" | "OTHER";
    document_name: string;
    document_url: string;
    file_size: number;
    uploaded_by: string;
    uploaded_datetime: string;
    description?: string;
}

// Reconciliation interface
export interface ITravelReconciliation {
    id: string;
    travel_expense_id: string;
    site_visit_id?: string;
    budgeted_accommodation: number;
    budgeted_meals: number;
    budgeted_transport: number;
    budgeted_per_diem: number;
    budgeted_total: number;
    actual_total: number;
    difference: number;
    reconciliation_type: "REIMBURSEMENT" | "RETIREMENT";
    reconciliation_amount: number;
    reconciliation_status: "PENDING" | "PROCESSED" | "COMPLETED";
    reconciliation_date?: string;
    notes?: string;
    processed_by?: string;
    processed_datetime?: string;
    // Document tracking
    supporting_documents?: IReconciliationDocument[];
    reimbursement_invoice?: IReconciliationDocument;
    retirement_receipt?: IReconciliationDocument;
    requires_invoice: boolean;
    requires_receipt: boolean;
}

// Reconciliation processing with documents
export const ReconciliationProcessingSchema = z.object({
    action: z.enum(["approve", "request_reimbursement", "request_retirement"]),
    notes: z.string().optional(),
    // Document uploads
    reimbursement_invoice: z.any().optional(), // For reimbursements - invoice for payment
    retirement_receipt: z.any().optional(), // For retirements - receipt of fund return
    supporting_documents: z.array(z.any()).optional(), // Additional supporting documents
    document_descriptions: z.array(z.string()).optional(), // Descriptions for each document
});

export type TReconciliationProcessingData = z.infer<typeof ReconciliationProcessingSchema>;

// Enhanced TER data with reconciliation
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
    // Link to EA and Site Visit
    expense_authorization?: {
        id: string;
        ta_number: string;
        department?: any;
        fco?: any;
        project?: any;
        destinations?: Array<{
            id: string;
            city: string;
            state: string;
            arrival_date: string;
            departure_date: string;
            purpose: string;
        }>;
        travel_fees?: Array<{
            id: string;
            lodging: number;
            meals: number;
            number_of_nights: number;
            interstate: number;
            airport_taxi: number;
            car_hire: number;
        }>;
        status: string;
    };
    site_visit?: {
        id: string;
        title: string;
        visit_type: string;
        location: any;
        start_date: string;
        end_date: string;
        duration_days: number;
        status: string;
    };
    // Reconciliation data
    reconciliation?: ITravelReconciliation;
}

// Employee TER submission schema
export const EmployeeTERSchema = z.object({
    site_visit_id: z.string().min(1, "Site visit is required"),
    travel_purpose: z.string().min(1, "Travel purpose is required"),
    activities: z.array(ActivitySchema).min(1, "At least one activity is required"),
    document: z.any().optional(),
});

export type TEmployeeTERFormData = z.infer<typeof EmployeeTERSchema>;
