import { z } from "zod";

export const AdhocStaffSchema = z.object({
  sur_name: z.string().min(1, "Surname is required"),
  other_names: z.string().min(1, "Other names are required"),
  gender: z.enum(["MALE", "FEMALE", "Other"]),
  state_of_origin: z.string().min(1, "State of origin is required"),
  designation: z.string().min(1, "Designation is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email_address: z.string().email("Valid email is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  health_facility: z.string().min(1, "Health facility/Assignment location is required"),
  spoke_site_name: z.string().optional(),
  lga: z.string().min(1, "LGA is required"),
  status_of_adhoc_staff: z.string().optional(),
  qmap_backstop: z.string().optional(),
  programs_officer: z.string().optional(),
  stl: z.string().optional(),
  seo: z.string().optional(),
  account_name: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  sort_code: z.string().optional(),
  tax_identification_number: z.string().optional(),
  // Project assignment
  project: z.string().optional(),
});

export type TAdhocStaffFormData = z.infer<typeof AdhocStaffSchema>;

export interface IAdhocStaffPaginatedData {
  id: string;
  sur_name: string;
  other_names: string;
  gender: "MALE" | "FEMALE" | "Other";
  state_of_origin: string;
  designation: string;
  phone_number: string;
  email_address: string;
  qualifications: string;
  health_facility: string;
  spoke_site_name?: string;
  lga: string;
  status_of_adhoc_staff?: string;
  qmap_backstop?: string;
  programs_officer?: string;
  stl?: string;
  seo?: string;
  lga2?: string;
  cluster?: string;
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  sort_code?: string;
  tax_identification_number?: string;
  created_datetime: string;
  updated_datetime: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
  };
}

export interface IAdhocStaffSingleData extends IAdhocStaffPaginatedData {
  // Additional fields that might be needed for single record view
  additional_details?: string;
  documents?: string[];
  contract_details?: {
    start_date: string;
    end_date: string;
    salary: string;
    contract_type: string;
  };
}