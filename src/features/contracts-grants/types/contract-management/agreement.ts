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

    // Approval workflow roles (optional)
    reviewer_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    authorizer_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),
    approver_id: z.string().optional().transform(val => val && val.trim() !== "" ? val : undefined),

    // SLA-specific fields (only used when type='SLA')
    response_time: z.string().optional(),
    resolution_time: z.string().optional(),
    uptime_percentage: z.coerce.number().optional(),
    service_hours: z.string().optional(),
    key_deliverables: z.string().optional(), // Will be converted to JSON
    performance_kpis: z.string().optional(), // Will be converted to JSON
    penalty_terms: z.string().optional(),
    escalation_matrix: z.string().optional(), // Will be converted to JSON
    monthly_cost: z.coerce.number().optional(),
    payment_frequency: z.string().optional(),
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
    entity_name?: string; // Combined entity name field from backend
    entity_type?: string; // Entity type (adhoc_staff, consultant, etc.)

    // Location (flattened)
    location_name: string;

    // Vendor fields (flattened)
    vendor_name: string | null;
    vendor_contact_person: string | null;
    vendor_contact_email: string | null;
    vendor_contact_phone: string | null;

    // Consultant fields (flattened) - backend uses _contact_name suffix
    consultant_contact_name?: string | null;
    consultant_contact_email?: string | null;
    consultant_contact_phone?: string | null;
    consultant_name?: string | null;
    consultant_email?: string | null;
    consultant_phone?: string | null;

    // Facilitator fields (flattened) - backend uses _contact_name suffix
    facilitator_contact_name?: string | null;
    facilitator_contact_email?: string | null;
    facilitator_contact_phone?: string | null;
    facilitator_name?: string | null;
    facilitator_email?: string | null;
    facilitator_phone?: string | null;

    // Adhoc Staff fields (flattened) - backend uses _contact_name suffix
    adhoc_staff_contact_name?: string | null;
    adhoc_staff_contact_email?: string | null;
    adhoc_staff_contact_phone?: string | null;
    adhoc_staff_name?: string | null;
    adhoc_staff_email?: string | null;
    adhoc_staff_phone?: string | null;

    // Service name field
    service_name?: string | null;

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
    title: string;
    file: string;  // Cloudinary URL
    file_url: string;  // Same as file
    file_name: string;
    description?: string | null;
    document_type: 'CONTRACT' | 'EXTENSION' | 'ADDENDUM' | 'AMENDMENT';
    version?: number | null;
    contract_number?: string | null;
    file_size_bytes: number;
    file_size: number;
    is_active: boolean;
    created_datetime: string;
    updated_datetime: string;
    created_by_name?: string;
    remarks?: string;

    // Legacy/alternative field names for backward compatibility
    document_url?: string;  // Alias for file_url
    document_name?: string;  // Alias for file_name or title
    uploaded_at?: string;  // Alias for created_datetime
    uploaded_by?: string;  // Alias for created_by_name
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
    provider: string | null;
    service: string;
    type: string;
    start_date: string;
    end_date: string;
    created_by: string | null;
    updated_by: string | null;

    // Contract workflow fields
    status: 'DRAFT' | 'SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
    status_display?: string;
    contract_number?: string | null;
    current_version?: number;

    // Additional fields from backend
    service_type_display?: string;
    location?: string;
    location_name?: string;
    entity_name?: string;
    entity_type?: string;

    // Date helpers
    start_month?: string;
    start_year?: number;
    end_month?: string;
    end_year?: number;
    duration_days?: number;
    days_until_expiry?: number;
    is_active?: boolean;
    is_expired?: boolean;

    // Renewal fields
    auto_renew?: boolean;
    renewal_period_days?: number | null;
    notification_days_before_expiry?: number;
    original_end_date?: string | null;

    // Contact fields (backend uses different naming)
    contact_person?: string | null;
    contact_person_email?: string | null;
    contact_person_phone?: string | null;

    // Vendor fields
    vendor?: number | null;
    vendor_name?: string | null;
    vendor_contact_person?: string | null;
    vendor_contact_email?: string | null;
    vendor_contact_phone?: string | null;

    // Consultant fields
    consultant?: number | null;
    consultant_contact_name?: string | null;
    consultant_contact_email?: string | null;
    consultant_contact_phone?: string | null;
    consultant_name?: string | null;
    consultant_email?: string | null;
    consultant_phone?: string | null;

    // Facilitator fields
    facilitator?: number | null;
    facilitator_contact_name?: string | null;
    facilitator_contact_email?: string | null;
    facilitator_contact_phone?: string | null;
    facilitator_name?: string | null;
    facilitator_email?: string | null;
    facilitator_phone?: string | null;

    // Adhoc Staff fields
    adhoc_staff?: number | null;
    adhoc_staff_contact_name?: string | null;
    adhoc_staff_contact_email?: string | null;
    adhoc_staff_contact_phone?: string | null;
    adhoc_staff_name?: string | null;
    adhoc_staff_email?: string | null;
    adhoc_staff_phone?: string | null;

    // Cost field (may not be present in all agreements)
    contract_cost?: string | number | null;

    // Documents and modifications
    agreement_documents?: IContractDocument[];
    documents?: IContractDocument[];
    modifications?: IContractModification[];

    // Approval fields
    approval_status?: string;
    approval_stage?: string;
    submitted_at?: string | null;
    submitted_by?: string | null;
    submitted_by_name?: string | null;
    approved_at?: string | null;
    approved_by?: string | null;
    approved_by_name?: string | null;

    // Additional fields
    remarks?: string | null;

    // SLA-specific fields (only populated when type='SLA')
    response_time?: string | null;
    resolution_time?: string | null;
    uptime_percentage?: number | null;
    service_hours?: string | null;
    key_deliverables?: any; // JSON field
    performance_kpis?: any; // JSON field
    penalty_terms?: string | null;
    escalation_matrix?: any; // JSON field
    monthly_cost?: number | null;
    payment_frequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'MILESTONE' | 'ON_DEMAND' | null;
}
