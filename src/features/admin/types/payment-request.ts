import { IUser } from "features/auth/types/user";
import { z } from "zod";

// Payment item schema for the new API structure
export const PaymentItemSchema = z.object({
    payment_to: z.string().min(1, "Please enter payment to"),
    account_number: z.string().min(1, "Please enter account number"),
    bank_name: z.string().min(1, "Please enter bank name"),
    amount_in_figures: z.string().min(1, "Please enter amount in figures"),
    amount_in_words: z.string().min(1, "Please enter amount in words"),
    tax_identification_number: z.string().optional(),
    phone_number: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
    consultant: z.string().optional(),
    facilitator: z.string().optional(),
    adhoc_staff: z.string().optional(),
    consultant_legacy_id: z.string().optional(),
    staff_legacy_id: z.string().optional(),
    facilitator_legacy_id: z.string().optional(),
});

// Main payment request schema
export const PaymentRequestSchema = z.object({
    payment_type: z.enum(["CONSULTANT", "FACILITATOR", "ADHOC_STAFF", "PURCHASE_ORDER", "OTHER"], {
        required_error: "Please select payment type"
    }),
    payment_date: z.string().min(1, "Please select date"),
    payment_reason: z.string().min(1, "Please enter payment reason"),
    purchase_order: z.string().optional(),
    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),
    payment_items: z.array(PaymentItemSchema).min(1, "At least one payment item is required"),
    
    // Legacy fields for backward compatibility
    number: z.string().optional(),
}).refine((data) => {
    // If payment type is PURCHASE_ORDER, purchase_order is required
    if (data.payment_type === "PURCHASE_ORDER") {
        return data.purchase_order && data.purchase_order.trim() !== "";
    }
    return true;
}, {
    message: "Purchase order is required for purchase order payments",
    path: ["purchase_order"],
}).refine((data) => {
    // Validate payment items based on payment type
    if (data.payment_type === "CONSULTANT") {
        return data.payment_items.every(item => 
            item.consultant || item.consultant_legacy_id
        );
    }
    if (data.payment_type === "FACILITATOR") {
        return data.payment_items.every(item => 
            item.facilitator || item.facilitator_legacy_id
        );
    }
    if (data.payment_type === "ADHOC_STAFF") {
        return data.payment_items.every(item => 
            item.adhoc_staff || item.staff_legacy_id
        );
    }
    return true;
}, {
    message: "Each payment item must have the corresponding reference based on payment type",
    path: ["payment_items"],
});

export type TPaymentRequestFormData = z.infer<typeof PaymentRequestSchema>;
export type TPaymentItemFormData = z.infer<typeof PaymentItemSchema>;

// API payload interface for creating payment requests
export interface IPaymentRequestPayload {
    payment_type: "CONSULTANT" | "FACILITATOR" | "ADHOC_STAFF" | "PURCHASE_ORDER" | "OTHER";
    payment_date: string;
    payment_reason: string;
    document: File;
    purchase_order?: string;
    reviewer: string;
    authorizer: string;
    approver: string;
    payment_items: Array<{
        payment_to: string;
        account_number: string;
        bank_name: string;
        amount_in_figures: string;
        amount_in_words: string;
        tax_identification_number?: string;
        phone_number?: string;
        email?: string;
        address?: string;
        consultant?: string;
        facilitator?: string;
        adhoc_staff?: string;
        consultant_legacy_id?: string;
        staff_legacy_id?: string;
        facilitator_legacy_id?: string;
    }>;
}

export interface IPaymentRequestPaginatedData {
    id: string;
    payment_type: string;
    purchase_order: string;
    created_datetime: string;
    updated_datetime: string;
    payment_date: string;
    payment_reason: string;
    document: string;
    status: string;
    created_by: string;
    requested_by: string;
    updated_by: null;
    total_amount: string;
    payment_items: Array<{
        id: string;
        payment_to: string;
        amount_in_figures: string;
        amount_in_words: string;
        account_number: string;
        bank_name: string;
    }>;
}

export interface IPaymentRequestSingleData {
    id: string;
    payment_type: "CONSULTANT" | "FACILITATOR" | "ADHOC_STAFF" | "PURCHASE_ORDER" | "OTHER";
    purchase_order: {
        id: string;
        purchase_order_number: string;
    };
    requested_by: IUser;
    approvals: [];
    created_datetime: string;
    updated_datetime: string;
    payment_date: string;
    payment_reason: string;
    document: string;
    status: string;
    created_by: string;
    updated_by: null;
    total_amount: string;
    payment_items: Array<{
        id: string;
        payment_to: string;
        account_number: string;
        bank_name: string;
        amount_in_figures: string;
        amount_in_words: string;
        tax_identification_number?: string;
        phone_number?: string;
        email?: string;
        address?: string;
        consultant?: {
            id: string;
            first_name: string;
            last_name: string;
        };
        facilitator?: {
            id: string;
            first_name: string;
            last_name: string;
        };
        adhoc_staff?: {
            id: string;
            first_name: string;
            last_name: string;
        };
    }>;
}
