import { z } from "zod";

export const AgreementSchema = z.object({
    // Step 1: Job Category (First dropdown)
    service_type: z.string().optional(), // Job category for filtering
    // Step 2: Service Category (Parent category - filtered by job category)
    service: z.string().optional(), // Frontend-only field, auto-populated for staff contracts
    // Step 3: Subcategory (Child category - filtered by parent category, optional)
    subcategory: z.string().optional(), // Optional subcategory
    // Step 4: Agreement Type (Consultant, Facilitator, etc.)
    type: z.string().min(1, "Please select agreement type"),
    // Other fields
    start_date: z.string().min(1, "Please select start date"),
    end_date: z.string().min(1, "Please select end date"),
    contract_cost: z.coerce.string().min(1, "Please enter contract cost"),
    location: z.string().min(1, "Please select location"),
    // Conditional fields based on agreement type
    // Transform empty strings to undefined for proper validation
    consultant_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    facilitator_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    adhoc_staff_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    vendor_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
}).superRefine((data, ctx) => {
    const { type } = data;
    const serviceAgreementTypes = ["SLA", "SECURITY", "INSURANCE", "LEASE", "HMO", "TICKETING"];

    console.log('🔍 Validation Debug:', {
        type,
        service: data.service,
        consultant_id: data.consultant_id,
        facilitator_id: data.facilitator_id,
        adhoc_staff_id: data.adhoc_staff_id,
        vendor_id: data.vendor_id,
    });

    // For service agreements, service field is required
    if (serviceAgreementTypes.includes(type) && (!data.service || data.service.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Service category is required for service agreements",
            path: ["service"]
        });
    }

    // Ensure appropriate entity is selected based on type
    if (type === "CONSULTANT" && !data.consultant_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a consultant",
            path: ["consultant_id"]
        });
    }

    if (type === "FACILITATOR" && !data.facilitator_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a facilitator",
            path: ["facilitator_id"]
        });
    }

    if (type === "ADHOC_STAFF" && !data.adhoc_staff_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select an adhoc staff member",
            path: ["adhoc_staff_id"]
        });
    }

    if (serviceAgreementTypes.includes(type) && !data.vendor_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a vendor",
            path: ["vendor_id"]
        });
    }
});

export type TAgreementFormData = z.infer<typeof AgreementSchema>;

export interface IAgreementPaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    provider: string;
    service: string;
    type: string;
    start_date: string;
    end_date: string;
    created_by: string | null;
    updated_by: string | null;
}

export interface IAgreementSingleData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    provider: string;
    service: string;
    type: string;
    start_date: string;
    end_date: string;
    created_by: string | null;
    updated_by: string | null;
}
