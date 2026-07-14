import { z } from "zod";

// EOI Registration Criterion (14-point checklist)
export type EOIRegistrationCriterion = {
  id: string;
  name: string;
  description: string;
  is_mandatory: boolean;
  exempted_for_small_business: boolean;
  required_for_small_business: boolean;
  display_order: number;
  score: boolean;  // Current pass/fail status
  remark: string;  // Procurement officer's notes
};

// Document types
export type VendorDocumentFile = {
  id: string;
  file_url: string;
  uploaded_datetime: string;
};

export type VendorDocument = {
  id: string;
  title: string;
  document_type: string;
  description: string;
  uploaded_datetime: string;
  files: VendorDocumentFile[];
};

// Organizational structure types
export type Branch = {
  address: string;
  state: string;
  phone?: string;
};

export type Shareholder = {
  name: string;
  shares: string;
  nationality?: string;
};

export type KeyStaff = {
  name: string;
  position: string;
  qualification?: string;
  experience?: string;
};

export type AssociatedEntity = {
  name: string;
  relationship: string;
  description?: string;
};

export type ProductionEquipment = {
  name: string;
  quantity?: string;
  capacity?: string;
};

export type KeyClient = {
  name: string;
  contact?: string;
  projects?: string;
  value?: string;
};

export type VendorPrequalificationData = {
  vendor: {
    // Basic Company Info
    id: string;
    company_name: string;
    company_registration_number: string;
    year_or_incorperation: string;
    type_of_business: string;
    nature_of_business: string;
    company_chairman: string;

    // Contact Information
    email: string;
    phone_numbers: string;
    website: string;
    company_address: string;
    state: string;

    // Financial Details
    account_name: string;
    account_number: string;
    bank_name: string;
    bank_address: string;
    tin: string;

    // Tax Configuration
    default_wht_rate: number | null;
    default_vat_rate: number | null;
    is_tax_exempt: boolean;
    tax_exemption_certificate: string | null;
    vendor_type: string;

    // Organizational Structure
    branches: Branch[];
    share_holders: Shareholder[];
    key_staff: KeyStaff[];
    associated_entities: AssociatedEntity[];

    // Technical Capacity
    installed_capacity: string;
    lagest_capacity_and_utilization: string;
    number_of_operational_work_shift: number;
    brief_of_quality_control: string;
    brief_of_sampling: string;
    production_equipments: ProductionEquipment[];
    key_client: KeyClient[];

    // Categories & Status
    submitted_categories: {
      id: string;
      code: string;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
      serial_number: number;
      job_category: string;
    }[];
    approved_categories: {
      id: string;
      code: string;
      description: string;
    }[];
    status: string;
    evaluation_status: string;
    is_active: boolean;
    passport: string | null;

    // Qualification Validity
    qualification_valid_from: string | null;
    qualification_valid_until: string | null;
    last_revalidation_date: string | null;

    // Documents
    vendor_documents: VendorDocument[];
  };
  financial_year_id: string;
  categories: EOIRegistrationCriterion[];  // 14-point EOI checklist
  assignment_info?: {
    is_assigned: boolean;
    assigned_to: string;
    assigned_at: string;
    assigned_to_name?: string;
  };
};

export interface VendorPrequalificationResponse {
  message: string;
  data: VendorPrequalificationData;
}

// Zod schema for EOI Registration submission
export const VendorPrequalificationSchema = z.object({
  vendor: z.string(),
  financial_year: z.string().optional(),
  prequalifications: z.array(
    z.object({
      passed: z.boolean(),  // Changed from 'score' to 'passed' to match backend
      remark: z.string().optional().default(""),
      criteria: z.string(),
    })
  ).optional(),
  approved_categories: z.array(z.string()),
});

// Type for form submission data
export type VendorPrequalificationSubmission = z.infer<typeof VendorPrequalificationSchema>;
