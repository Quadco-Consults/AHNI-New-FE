import { z } from "zod";

export const AgreementSchema = z.object({
    service: z.string().min(1, "Please enter service"),
    type: z.string().min(1, "Please select type"),
    start_date: z.string().min(1, "Please select start date"),
    end_date: z.string().min(1, "Please select end date"),
    contract_cost: z.string().min(1, "Please enter contract cost"),
    location: z.string().min(1, "Please select location"),
    // Conditional fields based on agreement type
    consultant_id: z.string().optional(),
    facilitator_id: z.string().optional(),
    adhoc_staff_id: z.string().optional(),
    vendor_id: z.string().optional(),
}).refine((data) => {
    // Ensure at least one entity is selected based on type
    const { type } = data;
    if (type === "CONSULTANT" && !data.consultant_id) return false;
    if (type === "FACILITATOR" && !data.facilitator_id) return false;
    if (type === "ADHOC_STAFF" && !data.adhoc_staff_id) return false;
    if (["SLA", "SECURITY", "INSURANCE", "LEASE", "HMO", "TICKETING"].includes(type) && !data.vendor_id) return false;
    return true;
}, {
    message: "Please select the appropriate entity for this agreement type",
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
