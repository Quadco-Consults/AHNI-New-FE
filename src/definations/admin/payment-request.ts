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
    payment_reason: z.string().min(1, "Please enter payment reason"),
});

export type TPaymentRequestFormData = z.infer<typeof PaymentRequestSchema>;

export interface IPaymentRequestPaginatedData {}

export interface IPaymentRequestSingleData {}

// requested_by
