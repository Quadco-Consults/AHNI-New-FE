import { z } from "zod";

export const AgreementSchema = z.object({
    // Note: Backend requires 'service' field for all agreements
    // Frontend will auto-generate meaningful service names for staff contracts
    service: z.string().optional(), // Frontend-only field, auto-populated
    service_type: z.string().optional(), // Frontend-only field for UI filtering
    type: z.string().min(1, "Please select type"),
    start_date: z.string().min(1, "Please select start date"),
    end_date: z.string().min(1, "Please select end date"),
    contract_cost: z.string().min(1, "Please enter contract cost"),
    location: z.string().min(1, "Please select location"),
    // Conditional fields based on agreement type
    // Transform empty strings to undefined for proper validation
    consultant_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    facilitator_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    adhoc_staff_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    vendor_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
}).refine((data) => {
    const { type } = data;

    // For service agreements, service field is required in UI
    const serviceAgreementTypes = ["SLA", "SECURITY", "INSURANCE", "LEASE", "HMO", "TICKETING"];
    if (serviceAgreementTypes.includes(type) && (!data.service || data.service.length === 0)) {
        return false;
    }

    // Ensure at least one entity is selected based on type
    // After transformation, empty strings become undefined, so just check for truthiness
    if (type === "CONSULTANT" && !data.consultant_id) return false;
    if (type === "FACILITATOR" && !data.facilitator_id) return false;
    if (type === "ADHOC_STAFF" && !data.adhoc_staff_id) return false;
    if (serviceAgreementTypes.includes(type) && !data.vendor_id) return false;

    return true;
}, {
    message: "Please complete all required fields for this agreement type",
    path: ["service"]
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
