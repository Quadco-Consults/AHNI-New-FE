import { z } from "zod";

export const AgreementSchema = z.object({
    // Step 1: Type of Service Job (Goods, Service, Works, Other)
    service_job_type: z.string().optional(), // Frontend-only field for filtering categories
    // Step 2: Service Category (filtered by service job type)
    service: z.string().optional(), // Frontend-only field, auto-populated for staff contracts
    // Step 3: Service Type (Job Categories)
    service_type: z.string().optional(), // Frontend-only field for UI filtering
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

// Type for expanded entity fields (when backend expands relationships)
type ExpandedLocation = {
    id: string;
    name: string;
    address?: string;
    city?: string;
    state?: string;
};

type ExpandedConsultant = {
    id: string;
    user?: {
        id: string;
        full_name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
    };
    full_name?: string;
    email?: string;
    phone_number?: string;
};

type ExpandedFacilitator = {
    id: string;
    user?: {
        id: string;
        full_name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
    };
    full_name?: string;
    email?: string;
    phone_number?: string;
};

type ExpandedAdhocStaff = {
    id: string;
    user?: {
        id: string;
        full_name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
    };
    full_name?: string;
    email?: string;
    phone_number?: string;
};

type ExpandedVendor = {
    id: string;
    company_name?: string;
    name?: string;
    contact_person?: string;
    contact_email?: string;
    contact_phone?: string;
    email?: string;
    phone_number?: string;
};

type ExpandedService = {
    id: string;
    name: string;
};

export interface IAgreementPaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    provider: string;
    service: string | ExpandedService; // Can be ID or expanded object
    type: string;
    start_date: string;
    end_date: string;
    contract_cost: string | number;
    created_by: string | null;
    updated_by: string | null;
    // Location - Can be ID string or expanded object
    location?: string | ExpandedLocation;
    // Entity relationships - Can be ID strings or expanded objects
    consultant?: string | ExpandedConsultant | null;
    facilitator?: string | ExpandedFacilitator | null;
    adhoc_staff?: string | ExpandedAdhocStaff | null;
    vendor?: string | ExpandedVendor | null;
    // Status field
    status?: string;

    // Alternative naming if backend uses _details suffix
    location_details?: ExpandedLocation;
    consultant_details?: ExpandedConsultant;
    facilitator_details?: ExpandedFacilitator;
    adhoc_staff_details?: ExpandedAdhocStaff;
    vendor_details?: ExpandedVendor;
    service_details?: ExpandedService;
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
