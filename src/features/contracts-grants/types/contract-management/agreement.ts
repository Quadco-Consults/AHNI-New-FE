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
    created_datetime?: string;
    updated_datetime?: string;
    provider?: string;
    service: string; // Service category UUID
    start_date: string;
    end_date: string;
    contract_cost?: string | number;
    created_by?: string | null;
    updated_by?: string | null;

    // Backend returns flattened fields with specific names
    service_type_display: string; // "Sla", "Consultant", "Adhoc Staff", "Facilitator"
    status: string; // "DRAFT", "ACTIVE", etc.
    status_display: string; // "Draft", "Active", etc.

    // Location (flattened)
    location_name: string;

    // Vendor fields (flattened)
    vendor_name: string | null;
    vendor_contact_person: string | null;
    vendor_contact_email: string | null;
    vendor_contact_phone: string | null;

    // Consultant fields (flattened) - backend should add these
    consultant_name?: string | null;
    consultant_email?: string | null;
    consultant_phone?: string | null;

    // Facilitator fields (flattened) - backend should add these
    facilitator_name?: string | null;
    facilitator_email?: string | null;
    facilitator_phone?: string | null;

    // Adhoc Staff fields (flattened) - backend should add these
    adhoc_staff_name?: string | null;
    adhoc_staff_email?: string | null;
    adhoc_staff_phone?: string | null;

    // Date helpers
    start_month?: string;
    start_year?: number;
    end_month?: string;
    end_year?: number;
    days_until_expiry?: number;
    is_active?: boolean;
    is_expired?: boolean;
    remarks?: string | null;

    // Legacy fields for backward compatibility
    type?: string;
    location?: string | ExpandedLocation;
    consultant?: string | ExpandedConsultant | null;
    facilitator?: string | ExpandedFacilitator | null;
    adhoc_staff?: string | ExpandedAdhocStaff | null;
    vendor?: string | ExpandedVendor | null;
    location_details?: ExpandedLocation;
    consultant_details?: ExpandedConsultant;
    facilitator_details?: ExpandedFacilitator;
    adhoc_staff_details?: ExpandedAdhocStaff;
    vendor_details?: ExpandedVendor;
    service_details?: ExpandedService;
}

// Contract Document interface
export interface IContractDocument {
    id: string;
    document_url: string;
    document_name: string;
    document_type: 'CONTRACT' | 'EXTENSION' | 'ADDENDUM' | 'AMENDMENT';
    version: number;
    contract_number: string;
    uploaded_at: string;
    uploaded_by?: string;
    file_size?: number;
    remarks?: string;
}

// Contract Modification interface
export interface IContractModification {
    id: string;
    modification_type: 'EXTENSION' | 'ADDENDUM' | 'AMENDMENT';
    description: string;
    new_end_date?: string;
    additional_cost?: number;
    document?: IContractDocument;
    created_at: string;
    created_by?: string;
    approved_at?: string;
    approved_by?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
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

    // Contract workflow fields
    status: 'DRAFT' | 'SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
    status_display?: string;
    contract_number?: string;
    current_version?: number;

    // Additional fields from paginated data
    service_type_display?: string;
    location_name?: string;
    vendor_name?: string | null;
    vendor_contact_person?: string | null;
    vendor_contact_email?: string | null;
    vendor_contact_phone?: string | null;
    consultant_name?: string | null;
    consultant_email?: string | null;
    consultant_phone?: string | null;
    facilitator_name?: string | null;
    facilitator_email?: string | null;
    facilitator_phone?: string | null;
    adhoc_staff_name?: string | null;
    adhoc_staff_email?: string | null;
    adhoc_staff_phone?: string | null;
    contract_cost?: string | number;

    // Documents and modifications
    documents?: IContractDocument[];
    modifications?: IContractModification[];

    // Approval fields
    approval_status?: string;
    approval_stage?: string;
    submitted_at?: string;
    submitted_by?: string;
}
