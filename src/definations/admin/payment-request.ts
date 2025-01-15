import { IUser } from "definations/auth/user";
import { z } from "zod";

export const PaymentRequestSchema = z.object({
    payment_date: z.string().min(1, "Please select date"),
    purchase_order: z.string().min(1, "Please enter payment reason"),
    payment_to: z.string().min(1, "Please enter payment to"),
    tax_identification_number: z
        .string()
        .min(1, "Please enter tax identification number"),
    amount_in_figures: z.string().min(1, "Please enter amount in figures"),
    amount_in_words: z.string().min(1, "Please enter amount in words"),
    account_number: z.string().min(1, "Please enter account number"),
    bank_name: z.string().min(1, "Please enter bank name"),
    requested_by: z.string().min(1, "Please select requestor"),
    payment_reason: z.string().min(1, "Please enter payment reason"),
    reviewer: z.string().min(1, "Please select reviewer"),
    authorizer: z.string().min(1, "Please select authorizer"),
    approver: z.string().min(1, "Please select approver"),
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
