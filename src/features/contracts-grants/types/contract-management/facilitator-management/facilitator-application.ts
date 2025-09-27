import { z } from "zod";

export const FacilitatorApplicantSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  qualifications: z.string().min(1, "Qualifications are required"),
  experience: z.string().min(1, "Experience is required"),
  facilitator_id: z.string().optional(),
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