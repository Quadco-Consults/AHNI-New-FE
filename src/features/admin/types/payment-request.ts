import { IUser } from "features/auth/types/user";
import { z } from "zod";

export const PaymentRequestSchema = z.object({
    payment_date: z.string().min(1, "Please select date"),
    purchase_order: z.string().optional(),
    payment_to: z.string().min(1, "Please enter payment to"),
    tax_identification_number: z.string().optional(),
    amount_in_figures: z.string().min(1, "Please enter amount in figures"),
    amount_in_words: z.string().min(1, "Please enter amount in words"),
    account_number: z.string().optional(),
    bank_name: z.string().optional(),
    payment_reason: z.string().min(1, "Please enter payment reason"),
    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),

    // to be added
    request_type: z.string().min(1, "Please select request type"),
    number: z.string().optional(),
    consultant: z.string().optional(),
    adhoc_staff: z.string().optional(),
}).refine((data) => {
    // If request type is SERVICE_ORDER, purchase_order is required
    if (data.request_type === "SERVICE_ORDER") {
        return data.purchase_order && data.purchase_order.trim() !== "";
    }
    return true;
}, {
    message: "Purchase order is required for service order",
    path: ["purchase_order"],
}).refine((data) => {
    // If request type is CONSULTANT or ADHOC_STAFF, number is required
    if (data.request_type === "CONSULTANT" || data.request_type === "ADHOC_STAFF") {
        return data.number && data.number.trim() !== "";
    }
    return true;
}, {
    message: "Number is required for consultant or adhoc staff",
    path: ["number"],
}).refine((data) => {
    // If number is SINGLE, these fields are required
    if (data.number === "SINGLE") {
        return data.tax_identification_number && 
               data.account_number && 
               data.bank_name &&
               data.tax_identification_number.trim() !== "" &&
               data.account_number.trim() !== "" &&
               data.bank_name.trim() !== "";
    }
    return true;
}, {
    message: "Tax ID, account number, and bank name are required for single payments",
    path: ["tax_identification_number"],
});

export type TPaymentRequestFormData = z.infer<typeof PaymentRequestSchema>;

export interface IPaymentRequestPaginatedData {
    id: string;
    purchase_order: string;
    created_datetime: string;
    updated_datetime: string;
    payment_date: string;
    payment_to: string;
    tax_identification_number: string;
    amount_in_figures: string;
    amount_in_words: string;
    account_number: string;
    bank_name: string;
    payment_reason: string;
    document: string;
    status: string;
    created_by: string;
    requested_by: string;
    updated_by: null;
}

export interface IPaymentRequestSingleData {
    id: string;
    purchase_order: {
        id: string;
        purchase_order_number: string;
    };
    requested_by: IUser;
    approvals: [];
    created_datetime: string;
    updated_datetime: string;
    payment_date: string;
    payment_to: string;
    tax_identification_number: string;
    amount_in_figures: string;
    amount_in_words: string;
    account_number: string;
    bank_name: string;
    payment_reason: string;
    document: string;
    status: string;
    created_by: string;
    updated_by: null;
}
