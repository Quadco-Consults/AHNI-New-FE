import { z } from "zod";

const RefereeSchema = z.object({
  name: z.string().min(1, "Referee name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.coerce.string().min(1, "Phone number is required"),
});

const DocumentSchema = z.object({
  document: z.string().optional().default(""),
  name: z.string().min(1, "Document name is required"),
});

export const FacilitatorApplicantSchema = z.object({
  // Referees and Documents arrays
  referees: z.array(RefereeSchema).min(1, "At least one referee is required"),
  documents: z.array(DocumentSchema).min(1, "At least one document is required"),

  // Required UUIDs
  contract_request: z.string().min(1, "Contract request is required"),
  project: z.string().min(1, "Project is required"),
  location: z.string().min(1, "Location is required"),
  technical_monitor_user: z.string().min(1, "Technical monitor user is required"),

  // Basic Information
  name: z.string().min(1, "Name is required"),
  contractor_name: z.string().min(1, "Contractor name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.coerce.string().min(1, "Phone number is required"),

  // Contract Details
  contract_number: z.coerce.string().min(1, "Contract number is required"),
  position_under_contract: z.string().min(1, "Position under contract is required"),
  proposed_salary: z.coerce.string().min(1, "Proposed salary is required"),

  // Personal Information
  place_of_birth: z.string().min(1, "Place of birth is required"),
  address: z.string().min(1, "Address is required"),
  citizenship: z.string().min(1, "Citizenship is required"),
  gender: z.string().min(1, "Gender is required"),
  state_of_origin: z.string().min(1, "State of origin is required"),

  // Dates
  start_duration_date: z.string().min(1, "Start date is required"),
  end_duration_date: z.string().min(1, "End date is required"),

  // Professional Information
  education: z.string().min(1, "Education is required"),
  language_proficiency: z.string().min(1, "Language proficiency is required"),
  employment_history: z.string().min(1, "Employment history is required"),
  special_consultant_services: z.string().min(1, "Special consultant services is required"),

  // Status
  status: z.enum(["APPLIED", "SELECTED", "REJECTED", "ACCEPTED"]).default("APPLIED"),

  // Technical Monitor Partner Information
  technical_monitor_partner_name: z.string().min(1, "Technical monitor partner name is required"),
  technical_monitor_partner_email: z.string().email("Invalid email"),
  technical_monitor_partner_phone: z.coerce.string().min(1, "Phone is required"),

  // Offer Details
  offer_accepted: z.boolean().default(false),
  offer_acceptance_date: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  signature: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val),

  // Health Facility Details
  health_facility: z.string().min(1, "Health facility is required"),
  lga: z.string().min(1, "LGA is required"),
  spoke_site_name: z.string().min(1, "Spoke site name is required"),

  // Staff Details
  qmap_backstop: z.string().min(1, "QMAP backstop is required"),
  programs_officer: z.string().min(1, "Programs officer is required"),
  stl: z.string().min(1, "STL is required"),
  seo: z.string().min(1, "SEO is required"),
  lga2: z.string().min(1, "LGA 2 is required"),
  cluster: z.string().min(1, "Cluster is required"),

  // Bank Details
  account_name: z.string().min(1, "Account name is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  account_number: z.coerce.string().min(1, "Account number is required"),
  sort_code: z.coerce.string().min(1, "Sort code is required"),
});

export type TFacilitatorApplicantFormData = z.infer<typeof FacilitatorApplicantSchema>;

export interface IFacilitatorApplicantPaginatedData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  qualifications: string;
  experience: string;
  status: "APPLIED" | "SELECTED" | "REJECTED";
  facilitator: string | any; // API might return object instead of string
  created_by: string | any; // API might return object instead of string
  updated_by: string | null | any; // API might return object instead of string
}

export interface IFacilitatorApplicantSingleData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  qualifications: string;
  experience: string;
  status: "APPLIED" | "SELECTED" | "REJECTED";
  facilitator: string;
  created_by: string;
  updated_by: string | null;
}